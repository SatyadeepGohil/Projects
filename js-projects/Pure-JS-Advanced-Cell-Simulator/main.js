const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let lastTime = 0;
const targetFPS = 60;
const frameDelay = 1000 / targetFPS;

const offScreenCanvas = document.createElement('canvas');
const offCtx = offScreenCanvas.getContext('2d');

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
offScreenCanvas.width = canvas.width;
offScreenCanvas.height = canvas.height;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    offScreenCanvas.width = canvas.width;
    offScreenCanvas.height = canvas.height;
})

let cells = [];
const upperLimit = 5000;
const radius = 1;

const maxVelocity = 3;
const drag = 0.95;
const repulsionThreshold = radius * 2;
const repulsionThresholdSquared = repulsionThreshold * repulsionThreshold;
const minDistance = 0.5; // originally 1.0 but reduced to 0.5 for smaller radius
const repulsionFactor = 0.5;
const maxForce = 0.5;
const gridCellSize = Math.max(repulsionThreshold, 20); // lerger grid cells for less checks
const numCols = Math.ceil(canvas.width / gridCellSize);
const numRows = Math.ceil(canvas.height / gridCellSize);

let grid = new Array(numCols);
for (let i = 0; i < numCols; i++) {
    grid[i] = new Array(numRows);
    for (let j = 0; j < numRows; j++) {
        grid[i][j] = [];
    }
}

const cellsX = new Float32Array(upperLimit);
const cellsY = new Float32Array(upperLimit);
const cellsVX = new Float32Array(upperLimit);
const cellsVY = new Float32Array(upperLimit);

const clampXMin = -radius;
const clampXMax = canvas.width + radius;
const clampYMin = -radius;
const clampYMax = canvas.height + radius;

// Generates random cells
for (let i = 0; i < upperLimit; i++) {
    cellsX[i] = Math.random() * (canvas.width - 2 * radius) + radius;
    cellsY[i] = Math.random() * (canvas.height - 2 * radius) + radius;
    cellsVX[i] = (Math.random() * 2 - 1) * maxVelocity;
    cellsVY[i] = (Math.random() * 2 - 1) * maxVelocity;
}

const clamp = (val, min, max) => val < min ? min : (val > max ? max : val);

const moveAndWrap = () => {
    for (let i = 0; i < upperLimit; i++) {

        if (Math.abs(cellsVX[i]) > maxVelocity) {
            cellsVX[i] *= drag;
            cellsVX[i] = cellsVX[i] > maxVelocity ? maxVelocity :
                (cellsVX[i] < -maxVelocity ? -maxVelocity : cellsVX[i]);
        }

        if (Math.abs(cellsVY[i]) > maxVelocity) {
            cellsVY[i] *= drag;
            cellsVY[i] = cellsVY[i] > maxVelocity ? maxVelocity :
                (cellsVY[i] < -maxVelocity ? -maxVelocity : cellsVY[i]);
        }
    
        cellsX[i] += cellsVX[i];
        cellsY[i] += cellsVY[i];

        if (cellsX[i] > clampXMax) {
            cellsX[i] = clampXMin;
        }
        else if (cellsX[i] < clampXMin) {
            cellsX[i] = clampXMax;
        }

        if (cellsY[i] > clampYMax) {
            cellsY[i] = clampYMin;
        }
        else if (cellsY[i] < clampYMin) {
            cellsY[i] = clampYMax;
        }
    }
};

const rebuildGrid = () => {
    //clear grid
    for (let gx = 0; gx < numCols; gx++) {
        for (let gy = 0; gy < numRows; gy++) {
            grid[gx][gy].length = 0;
        }
    }
    // Assign cells to grid
    for (let i = 0; i < upperLimit; i++) {
        const x = cellsX[i];
        const y = cellsY[i];

        let gx = Math.floor(x / gridCellSize);
        let gy = Math.floor(y / gridCellSize);

        gx = clamp(gx, 0, numCols - 1);
        gy = clamp(gy, 0, numRows - 1);
        
        grid[gx][gy].push(i);
    }
} 

const applyRepulsionWithGrid = () => {
    rebuildGrid();
    
    for (let gx = 0; gx < numCols; gx++) {
        for (let gy = 0; gy < numRows; gy++) {
            const cellBucket = grid[gx][gy];

            for (let i = 0; i < cellBucket.length; i++) {
                const cellIdxA = cellBucket[i];
                const ax = cellsX[cellIdxA];
                const ay = cellsY[cellIdxA];

                //calculating only 3x3 grid
                for (let dx = -1; dx <= 1; dx++) {

                    const nx = gx + dx;
                    if (nx < 0 || nx >= numCols) continue;

                    for (let dy = -1; dy <= 1; dy++) {

                        const ny = gy + dy;
                        if (ny < 0 || ny >= numRows) continue;

                        let neighborBucket = grid[nx][ny];

                        if (neighborBucket.length === 0) continue;

                        const startJ = (dx === 0 && dy === 0) ? i + 1 : 0;

                        for (let j = startJ; j < neighborBucket.length; j++) {
                            let cellIdxB = neighborBucket[j];

                            const bx = cellsX[cellIdxB];
                            const by = cellsY[cellIdxB];

                            const diffX = ax - bx;
                            const diffY = ay - by;

                            const distanceSquared = diffX * diffX + diffY * diffY;

                            if (distanceSquared < repulsionThresholdSquared) {
                                //Only calcuting square root for optimization
                                const distance = Math.sqrt(distanceSquared);
                                const effectiveDistance = Math.max(distance, minDistance);

                                //Normalized direction vector
                                const normX = diffX / effectiveDistance;
                                const normY = diffY / effectiveDistance;

                                const strength = (repulsionThreshold - effectiveDistance) * repulsionFactor;
                                const clampedStrength = strength > maxForce ? maxForce :
                                                        (strength < -maxForce ? -maxForce : strength);

                                cellsVX[cellIdxA] += normX * clampedStrength;
                                cellsVY[cellIdxA] += normY * clampedStrength;
                                cellsVX[cellIdxB] -= normX * clampedStrength;
                                cellsVY[cellIdxB] -= normY * clampedStrength;
                            }
                        }
                    }
                }
            }
        }
    }
}

const draw = () => {
    offCtx.clearRect(0,0, canvas.width, canvas.height);

    offCtx.beginPath();

    for (let i = 0; i < upperLimit; i++) {
        offCtx.moveTo(cellsX[i] + radius, cellsY[i]);
        offCtx.arc(cellsX[i], cellsY[i], radius, 0, 2 * Math.PI);
    }

    offCtx.fillStyle = 'black';
    offCtx.fill();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(offScreenCanvas, 0, 0);
}

let frameCount = 0;
let lastFPSUpdate = 0;
let fps = 0;

function drawStats() {
    ctx.fillStyle = 'white';
    ctx.fillRect(10, 10, 120, 50);
    ctx.fillStyle = ('black');
    ctx.font = '14px Arial';
    ctx.fillText(`FPS ${fps.toFixed(1)}`, 20, 30);
    ctx.fillText(`Cells: ${upperLimit}`, 20, 50);
}

function updateFPS(now) {
    frameCount++;

    if (now - lastFPSUpdate > 1000) {
        fps = frameCount * 1000 / (now - lastFPSUpdate);
        frameCount = 0;
        lastFPSUpdate = now;
    }
}

function animate(timestamp) {

    const now = timestamp || performance.now();
    const deltaTime = now - lastTime;

    if (deltaTime > frameDelay) {

        applyRepulsionWithGrid();
        moveAndWrap();

        draw();

        updateFPS(now);
        drawStats();

        lastTime = now - (deltaTime % frameDelay);
    }

    requestAnimationFrame(animate);
}

lastFPSUpdate = performance.now();

animate();