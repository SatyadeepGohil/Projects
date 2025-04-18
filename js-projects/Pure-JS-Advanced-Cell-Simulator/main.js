const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

let cells = [];
const upperLimit = 20;
const radius = 10;

// Generates random cells
for (let i = 0; i < upperLimit; i++) {
    const randomX = Math.random() * (canvas.width - 2 * radius) + radius;
    const randomY = Math.random() * (canvas.height - 2 * radius) + radius;
    cells.push({ x: randomX, y: randomY });
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

draw();