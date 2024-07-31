const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height =window.innerHeight;
let mousex = 0;
let mouseY = 0;

document.addEventListener('mousemove', () => {
    mousex = event.clientX;
    mouseY = event.clientY;
});

function getRandomColor() {
    let r = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);

    return `rgb(${r},${g},${b})`;
}


function balls() {
    let radius = Math.floor(Math.random() * 50);
    let color = getRandomColor();
    let x = Math.floor(Math.random() * canvas.height);
    let y = Math.floor(Math.random() * canvas.width);
    ctx.beginPath();
    ctx.arc(x,y,radius,0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

balls();

let gravity = 1;

function animate() {
}

for (let i = 0; i < 10; i++) {
    balls();
}