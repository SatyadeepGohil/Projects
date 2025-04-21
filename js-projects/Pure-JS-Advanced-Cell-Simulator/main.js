const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

let cells = [];
const upperLimit = 50;
const radius = 20;

const maxVelocity = 3;
const drag = 0.95;
const repulsionThreshold = radius * 2;
const minDistance = 1.0;
const repulsionFactor = 0.5;
const maxForce = 0.5;

// Generates random cells
for (let i = 0; i < upperLimit; i++) {
    const randomX = Math.random() * (canvas.width - 2 * radius) + radius;
    const randomY = Math.random() * (canvas.height - 2 * radius) + radius;
    const vx = (Math.random() * 2 - 1) * maxVelocity;
    const vy = (Math.random() * 2 - 1) * maxVelocity;
    cells.push({ x: randomX, y: randomY, vx, vy });
}

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const moveAndWrap = () => {
    for (let cell of cells) {

        if (Math.abs(cell.vx) > maxVelocity) {
            cell.vx *= drag;
            cell.vx = clamp(cell.vx, -maxVelocity, maxVelocity);
        }

        if (Math.abs(cell.vy) > maxVelocity) {
            cell.vy *= drag;
            cell.vy = clamp(cell.vy, -maxVelocity, maxVelocity);
        }
    

        cell.x += cell.vx;
        cell.y += cell.vy;

        if (cell.x > canvas.width + radius) {
            cell.x = -radius;
        }
        else if (cell.x < -radius) {
            cell.x = canvas.width + radius;
        }

        if (cell.y > canvas.height + radius) {
            cell.y = -radius;
        }
        else if (cell.y < -radius) {
            cell.y = canvas.height + radius;
        }
    }
}

const applyRepulsion = () => {
    for (let i = 0; i < cells.length; i++) {
        for (let j = i + 1; j < cells.length; j++) {

            const dx = cells[i].x - cells[j].x;
            const dy = cells[i].y - cells[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < repulsionThreshold) {
                const effectiveDistance = Math.max(distance, minDistance);

                //Normalized direction vector
                const nx = dx / effectiveDistance;
                const ny = dy / effectiveDistance;

                const strength = clamp((repulsionThreshold - effectiveDistance) * repulsionFactor, -maxForce, maxForce);

                cells[i].vx += nx * strength;
                cells[i].vy += ny * strength;
                cells[j].vx -= nx * strength;
                cells[j].vy -= ny * strength;
            }
        }
    }
}

const draw = () => {
    for (let cell of cells) {
        ctx.beginPath();
        ctx.arc(cell.x, cell.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.stroke();
    }
}

function animate() {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    applyRepulsion();
    moveAndWrap();
    draw()
    requestAnimationFrame(animate);
}

animate();