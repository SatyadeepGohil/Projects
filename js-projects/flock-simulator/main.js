const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let boids = [];
let numOfBoids = 200;

let maxSpeed = 3;
let minSpeed = 0.5;
let maxForce = 1;


class Boid {
    constructor (x,y,vx,vy) {
        this.position = { x: x, y: y};
        this.vx = vx;
        this.vy = vy;
        this.acceleration = { x: x, y: y};
        this.radius = 2;
        this.color = 'black';
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.vx += this.acceleration.x;
        this.vy += this.acceleration.y;

        let speed = Math.sqrt(this.vx ** 2 + this.vy ** 2);
        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }

        this.position.x += this.vx;
        this.position.y += this.vy;

        this.acceleration.x = 0;
        this.acceleration.y = 0;

        if (this.position.x + this.radius > canvas.width) {
            this.position.x = this.radius;
        }

        if (this.position.x - this.radius < 0) {
            this.position.x = canvas.width - this.radius;
        }

        if (this.position.y + this.radius > canvas.height) {
            this.position.y = this.radius;
        }

        if (this.position.y - this.radius < 0) {
            this.position.y = canvas.height - this.radius;
        }
    }

    applyForce(force) {
        this.acceleration.x += force.x;
        this.acceleration.y += force.y;

        let magnitude = Math.sqrt(force.x ** 2 + force.y ** 2);
        if (magnitude > maxForce) {
            force.x = (force.x / magnitude) * maxForce;
            force.y = (force.y / magnitude) * maxForce;
        }
    }

    flock(boids) {
        let separation = this.seperate(boids);
        let alignment = this.align(boids);
        let cohesion = this.cohere(boids);

        separation.x *= 1.5;
        separation.y *= 1.5;
        alignment.x *= 1.0;
        alignment.y *= 1.0;
        cohesion.x *= 1.0;
        cohesion.y *= 1.0;

        this.applyForce(separation);
        this.applyForce(alignment);
        this.applyForce(cohesion);
    }

    seperate(boids) {
        let desiredSeparation = 25.0;
        let steer = { x: 0, y: 0};
        let count = 0;

        boids.forEach(other => {
            let d = Math.sqrt((this.position.x - other.position.x) ** 2 + (this.position.y - other.position.y) ** 2);
            if (d > 0 && d < desiredSeparation) {
                let diff = {
                    x: this.position.x - other.position.x,
                    y: this.position.y - other.position.y
                };
                let dist = Math.sqrt(diff.x ** 2 + diff.y ** 2);
                diff.x /= dist;
                diff.y /= dist;
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

    align(boids) {
        let neighborDist = 50.0;
        let sum = { x: 0, y: 0};
        let count = 0;

        boids.forEach(other => {
            let d = Math.sqrt((this.position.x - other.position.x) ** 2 + (this.position.y - other.position.y) ** 2);
            if (d > 0 && d < neighborDist) {
                sum.x += other.vx;
                sum.y += other.vy;
                count++;
            }
        });

        if (count > 0) {
            sum.x /= count;
            sum.y /= count;

            let mag = Math.sqrt(sum.x ** 2 + sum.y ** 2);

            sum.x /= mag;
            sum.y /= mag;
            
            sum.x *= maxSpeed;
            sum.y *= maxSpeed;

            let steer = {
                x: sum.x - this.vx,
                y: sum.y - this.vy
            };
            return steer;
        }
        return { x: 0, y: 0};
    }

    cohere(boids) {
        let neighborDist = 15.0;
        let sum = { x: 0, y: 0};
        let count = 0;

        boids.forEach(other => {
            let d = Math.sqrt((this.position.x - other.position.x) ** 2 + (this.position.y - other.position.y) ** 2);
            if (d > 0 && d < neighborDist) {
                sum.x += other.vx;
                sum.y += other.vy;
                count++;
            }
        });

        if (count > 0) {
            sum.x /= count;
            sum.y /= count;
            let desired = {
                x: sum.x - this.position.x,
                y: sum.y - this.position.y
            };
            let mag = Math.sqrt(desired.x ** 2 + desired.y ** 2);
            desired.x /= mag;
            desired.y /= mag;
            desired.x *= maxSpeed;
            desired.y *= maxSpeed;
            let steer = {
                x: desired.x - this.vx,
                y: desired.y - this.vy
            };
            return steer;
        }
        return { x: 0, y: 0};
    }
}

function createBoids(numOfBoids) {
    for (let i = 0; i < numOfBoids; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let vx = (Math.random() - 0.5)* 2;
        let vy = (Math.random() - 0.5)* 2
        boids.push(new Boid(x,y,vx, vy));
    }
}

createBoids(numOfBoids);

function update() {
    ctx.clearRect( 0, 0, canvas.width, canvas.height);

    boids.forEach(boid => {
        boid.flock(boids);
        boid.draw(ctx);
        boid.update();
    })

    requestAnimationFrame(update);
}

update();

window.addEventListener('resize' , () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    update();
});