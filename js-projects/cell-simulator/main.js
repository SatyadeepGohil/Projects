const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let cells = [];
let numOfCells = 500;
const maxSpeed = 1;
const minSpeed = 0.2;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function getRandomColor () {
    let r = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);

    return `rgb(${r},${g},${b})`;
}

class Cell {
    constructor(x,y,radius,color,vx,vy) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.vx = vx;
        this.vy = vy;
    }

    draw (ctx) {
        let angle = Math.atan2(this.vy, this.vx);

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(angle);


        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.radius, this.y - this.radius);
        ctx.lineTo(this.x + this.radius, this.y - this.radius);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.restore();
    }

    move(canvas) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
            this.vy *= -0.5;
        }

        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.vy *= -0.5;
        }

        if (this.x + this.radius > canvas.width || this.x - this.radius) {
            this.vx *= -0.5;
        }

        this.limitSpeed();
    }

    limitSpeed() {
        let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }
        else if (speed < minSpeed) {
            this.vx = (this.vx / speed) * minSpeed;
            this.vy = (this.vy / speed) * minSpeed;
        }
    }

    seperation(cells, seperateDistance) {
        let steer = {x : 0, y: 0};
        let count = 0;

        cells.forEach(cell => {
            let distance = Math.hypot(this.x - cell.x, this.y - cell.y);
            if (distance > 0 && distance < seperateDistance) {
                let diff = { x: this.x - cell.x, y: this.y - cell.y};
                diff.x /= distance;
                diff.y /= distance;
                steer.x += diff.x;
                steer.y += diff.y;
                count++;
            }
        });

        if (count > 0) {
            steer.x /= count;
            steer.y /= count;
        }

        return steer;
    }

    alignment(cells, neighborDist) {
        let sum = { x: 0, y: 0};
        let count = 0;

        cells.forEach(cell => {
            let distance = Math.hypot(this.x - cell.x, this.y - cell.y);
            if (distance > 0 && distance < neighborDist) {
                sum.x += cell.vx;
                sum.y += cell.vy;
                count++;
            }
        });

        if (count > 0) {
            sum.x /= count;
            sum.y /= count;

            sum.x -= this.vx;
            sum.y -= this.vy
        }

        return sum;
    }

    cohesion(cells, neighborDist) {
        let sum = { x: 0, y: 0};
        let count = 0;

        cells.forEach(cell => {
            let distance = Math.hypot(this.x - cell.x, this.y - cell.y);
            if (distance > 0 && distance < neighborDist) {
                sum.x += cell.x;
                sum.y += cell.y;
                count++;
            }
        });

        if (count > 0) {
            sum.x /= count;
            sum.y /= count;

            sum.x -= this.x;
            sum.y -= this.y
        }

        return sum;
    }

    applyBehaviours(cells) {
        let seperationForce = this.seperation(cells, 5);
        let alignmentForce = this.alignment(cells, 20);
        let cohesionForce = this.cohesion(cells, 0.8);

        this.vx += seperationForce.x * 1.0 + alignmentForce.x * 1.0 + cohesionForce.x * 1.0;
        this.vy += seperationForce.y * 1.0 + alignmentForce.y * 1.0 + cohesionForce.y * 1.0;
    }
    
}

function createCells (numOfCells) {
    for(let i = 0; i < numOfCells; i++) {
    let radius = 6;
    let x = Math.random() * (canvas.width - 2 * radius) + radius;
    let y = Math.random() * (canvas.height - 2 * radius) + radius;
    let color = getRandomColor();
    let vx = Math.random() * 2 - 0.1;
    let vy = Math.random() * 2 - 0.1;

    cells.push(new Cell(x,y,radius,color,vx,vy));
    }
}

createCells(numOfCells);

function update() {
    ctx.clearRect(0,0, canvas.width, canvas.height);

    cells.forEach(cell => {
        cell.move(canvas);
        cell.applyBehaviours(cells);
        cell.draw(ctx);
    })

    requestAnimationFrame(update);
}

update();