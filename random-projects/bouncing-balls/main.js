const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let balls = [];

function getRandomColor() {
    let r = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);

    return `rgb(${r},${g},${b})`;
}

class Ball {
    constructor(x, y, radius, color, dx, dy, gravity, bounce) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = dx;
        this.dy = dy;
        this.gravity = gravity;
        this.bounce = bounce;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update(canvas) {
        this.dy += this.gravity;
        this.x += this.dx;
        this.y += this.dy;

        if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
            this.dy *= -this.bounce;
        }

        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.dy *= -this.bounce;
        }

        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx *= -1;
        }
    }
}

function createBalls(numBalls) {
    for (let i = 0; i < numBalls; i++) {
        let radius = Math.floor(Math.random() * 10);
        let x = Math.random() * (canvas.width - 2 * radius) + radius;
        let y = Math.random() * (canvas.height - 2 * radius) + radius;
        let color = getRandomColor();
        let dx = Math.random() * 2 - 0.5;
        let dy = Math.random() * 2 - 0.5;
        let gravity = 0.8;
        let bounce = 1;

        balls.push(new Ball(x,y,radius,color,dx,dy,gravity,bounce));
    }
}

let numberOfBalls = prompt('how many balls do you want to see?');

createBalls(numberOfBalls);

function update() {
    ctx.clearRect(0,0, canvas.width, canvas.height);

    balls.forEach(ball => {
        ball.update(canvas);
        ball.draw(ctx);
    });

    requestAnimationFrame(update);
}

update();

window.addEventListener('resize' , () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    update();
});