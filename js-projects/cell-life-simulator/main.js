const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let cells = [];
let gridSize = 50;
let numOfCells = 1000;
let numOfPlants = 900;
let numOfPreys = 90;
let numOfPredator = 10;
let maxSpeed = 1;

class Cell {
    constructor (x,y,vx,vy,radius,color,type) {
        this.position = { x: x, y: y}
        this.vx = vx;
        this.vy = vy;
        this.acceleration = { x: 0, y: 0};
        this.radius = radius;
        this.color = color;
        this.type = type;
        this.gridIndex = this.getGridIndex();
    }

    getGridIndex() {
        let gridX = Math.floor(this.position.x/ gridSize);
        let gridY = Math.floor(this.position.y/ gridSize);
        return `${gridX},${gridY}`;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update(grid) {
        switch (this.type) {
            case 'plant':
                this.plantBehavior();
                break;
                case 'prey':
                    this.preyBehavior(grid);
                    break;
                    case 'predator':
                        this.predatorBehavior(grid);
                        break;
        }

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

        if (this.position.x + this.radius > canvas.width || this.position.x - this.radius < 0) {
            this.vx *= -0.9;
            this.position.x = Math.min(Math.max(this.radius, this.position.x), canvas.width - this.radius);
        }
        if (this.position.y + this.radius > canvas.height || this.position.y - this.radius < 0) {
            this.vy *= -0.9;
            this.position.y = Math.min(Math.max(this.radius, this.position.y), canvas.height - this.radius);
        }

        this.checkCollisions(grid);
        this.gridIndex = this.getGridIndex();
    }

     getNearbyCells(grid) {
        let [gridX, gridY] = this.gridIndex.split(',').map(Number);
        let nearbyCells = [];

        for (let x = gridX - 1; x <= gridX + 1; x++){
            for (let y = gridY - 1; y <= gridY + 1; y++) {
                let key = `${x},${y}`;
                if (grid[key]) {
                    nearbyCells.push(...grid[key]);
                }
            }
        }
        return nearbyCells;
    }

    plantBehavior() {
        this.vx = 0;
        this.vy = 0;
    }

    preyBehavior(grid) {
        let closestPlant = null;
        let closestDistance = Infinity;
        let nearbyCells = this.getNearbyCells(grid);
        cells.forEach(cell => {
            if (cell.type === 'plant') {
                let distance = Math.hypot(cell.position.x - this.position.x, cell.position.y - this.position.y);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestPlant = cell;
                }
            }
        });

        if (closestPlant) {
            this.acceleration.x = (closestPlant.position.x - this.position.x) * 0.005;
            this.acceleration.y = (closestPlant.position.y - this.position.y) * 0.005;
        }
    }

    predatorBehavior(grid) {
        let closestPrey = null;
        let closestDistance = Infinity;
        let nearbyCells = this.getNearbyCells(grid);
        cells.forEach(cell => {
            if (cell.type === 'prey') {
                let distance = Math.hypot(cell.position.x - this.position.x, cell.position.y - this.position.y);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestPrey = cell;
                }
            }
        });

        if (closestPrey) {
            this.acceleration.x = (closestPrey.position.x - this.position.x) * 0.0005;
            this.acceleration.y = (closestPrey.position.y - this.position.y) * 0.0005;
        }
    }

    checkCollisions(grid) {
        let nearbyCells = this.getNearbyCells(grid);

        nearbyCells.forEach(cell => {
            if (this !== cell) {

                if (this.type === 'predator' && cell.type === 'prey') {
                    let distance = Math.hypot(cell.position.x - this.position.x, cell.position.y - this.position.y);
                    if (distance < this.radius + cell.radius) {
                        cells.splice(cells.indexOf(cell), 1);
                    }
                }

                if (this.type === 'prey' && cell.type === 'plant') {
                    let distance = Math.hypot(cell.position.x - this.position.x, cell.position.y - this.position.y);
                    if (distance < this.radius + cell.radius) {
                        cells.splice(cells.indexOf(cell), 1);
                    }
                }
            }
        });
    }
}

function createCells(numOfCells, type, color) {
    for (let i = 0; i < numOfCells; i++) {
        let radius = 2;
        let x = Math.random() * (canvas.width - 2 * radius) + radius;
        let y = Math.random() * (canvas.height - 2 * radius) + radius;
        let vx = (Math.random() - 0.5) * 2;
        let vy = (Math.random() - 0.5) * 2;
        cells.push(new Cell(x,y,vx,vy,radius,color,type));
    }
}

createCells(numOfPlants, 'plant', 'green');
createCells(numOfPreys, 'prey', 'blue');
createCells(numOfPredator, 'predator', 'red');

function updateGrid() {
    let grid = {};
    cells.forEach(cell => {
        let gridIndex = cell.gridIndex;
        if (!grid[gridIndex]) {
            grid[gridIndex] = [];
        }
        grid[gridIndex].push(cell);
    });
    return grid;
}

function update() {
    ctx.clearRect( 0, 0, canvas.width, canvas.height);

    let grid = updateGrid();

    cells.forEach(cell => {
        cell.draw(ctx);
        cell.update(grid);
    });

    requestAnimationFrame(update);
}

update();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    update();
});