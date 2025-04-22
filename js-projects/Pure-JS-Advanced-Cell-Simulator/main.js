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
const upperLimit = 500;
const radius = 10;

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

// Using Unit8Array for better performance
const cellsColliding = new Uint8Array(upperLimit);
const cellsCollisionTimer = new Uint8Array(upperLimit);
const maxCollisionFrames = 5;

const clampXMin = -radius;
const clampXMax = canvas.width + radius;
const clampYMin = -radius;
const clampYMax = canvas.height + radius;

const colorPoolSize = 1;
const colorPool = new Array(colorPoolSize);

for (let i = 0; i < colorPoolSize; i++) {
    const hue = (i * (360 / colorPoolSize)) % 360;
    colorPool[i] =  `hsl(${hue}, 100%, 50%)`
}

const cellsColorIndex = new Uint8Array(upperLimit);

// Generates random cells
for (let i = 0; i < upperLimit; i++) {
    cellsX[i] = Math.random() * (canvas.width - 2 * radius) + radius;
    cellsY[i] = Math.random() * (canvas.height - 2 * radius) + radius;
    cellsVX[i] = (Math.random() * 2 - 1) * maxVelocity;
    cellsVY[i] = (Math.random() * 2 - 1) * maxVelocity;
    cellsColorIndex[i] = i % colorPoolSize;
}

const clamp = (val, min, max) => val < min ? min : (val > max ? max : val);

const moveAndWrap = () => {
    for (let i = 0; i < upperLimit; i++) {

        if (cellsCollisionTimer[i] > 0) {
            cellsCollisionTimer[i]--;
        }

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

    for (let i = 0; i < upperLimit; i++) {
        cellsColliding[i] = 0;
    } 
    
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

                                // by assigning 1 it is getting marked as colliding
                                cellsColliding[cellIdxA] = 1;
                                cellsColliding[cellIdxB] = 1;

                                // Reset collision timer to max for a more prominent visual effect
                                cellsCollisionTimer[cellIdxA] = maxCollisionFrames;
                                cellsCollisionTimer[cellIdxB] = maxCollisionFrames;

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

    // drawing non colliding cells
    offCtx.beginPath();
    for (let i = 0; i < upperLimit; i++) {
        offCtx.moveTo(cellsX[i] + radius, cellsY[i]);
        offCtx.arc(cellsX[i], cellsY[i], radius, 0, 2 * Math.PI);
    }

    offCtx.fillStyle = 'black';
    offCtx.fill();

    // drawing colliding cells by color group to minimize context changes
    for (let colorIdx = 0; colorIdx < colorPoolSize; colorIdx++) {
        let hasCollidingCells = false;
        offCtx.beginPath();

        for (let i = 0; i < upperLimit; i++) {
            if (cellsCollisionTimer[i] > 0 && cellsColorIndex[i] === colorIdx) {
                offCtx.moveTo(cellsX[i] + radius, cellsY[i]);
                offCtx.arc(cellsX[i], cellsY[i], radius, 0, 2 * Math.PI);
                hasCollidingCells = true;
            }
        }

        if (hasCollidingCells) {
            offCtx.fillStyle = colorPool[colorIdx];
            offCtx.fill();
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(offScreenCanvas, 0, 0);
}

let frameCount = 0;
let lastFPSUpdate = 0;
let fps = 0;
let collisionCount = 0;

function drawStats() {
    const padding = 10;
    const lineHeight = 25;

    // Background box
    ctx.fillStyle = 'grey';
    ctx.fillRect(10, 10, 180, 90); // Slightly bigger box for more room

    // Text style
    ctx.fillStyle = 'black';
    ctx.font = '26px Arial';

    // Base position
    const startX = 10 + padding;
    let startY = 10 + padding + 20; // First line's Y position

    // Draw text with spacing
    ctx.fillText(`FPS: ${fps.toFixed(1)}`, startX, startY);
    ctx.fillText(`Cells: ${upperLimit}`, startX, startY + lineHeight);
    ctx.fillText(`Collisions: ${collisionCount}`, startX, startY + 2 * lineHeight);
}


function updateFPS(now) {
    frameCount++;

    if (now - lastFPSUpdate > 1000) {
        fps = frameCount * 1000 / (now - lastFPSUpdate);
        frameCount = 0;
        lastFPSUpdate = now;

        collisionCount = 0;
        for (let i = 0; i < upperLimit; i++) {
            if (cellsColliding[i]) collisionCount++;
        }
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