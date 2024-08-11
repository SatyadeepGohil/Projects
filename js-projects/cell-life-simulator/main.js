const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const plantCount = document.getElementById('plantCount');
const preyCount = document.getElementById('preyCount');
const predatorCount = document.getElementById('predatorCount');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let cells = [];
let gridSize = 50;
let numOfCells = 100;
let numOfPlants = 70;
let numOfPreys = 20;
let numOfPredator = 10;
let maxSpeed =  2;
const maxPlants = 1000;
const preyConsumptionThreshold = 5;
const predatorCosumptionThreshold = 3;
const duplicateInterval = 2000;
const lifespanDecrement = 0.1;
const initialLifespan = 100;
const lifespanIncreaseOnConsumption = 10;


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
        this.consumed = 0;
        this.lifespan = type === 'prey' || type === 'predator' ? initialLifespan : null;
        this.maxLifespan = initialLifespan;
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

        this.wrapAroundCanvas();
        this.checkCollisions(grid);
        this.gridIndex = this.getGridIndex();

        if (this.lifespan !== null) {
            this.lifespan -= lifespanDecrement;
            if (this.lifespan <= 0) {
                cells.splice(cells.indexOf(this), 1);
            }
        }
    }

    wrapAroundCanvas() {
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
        let closestPredator = null;
        let closestPlantDistance = Infinity;
        let closestPredatorDistance = Infinity;
        let nearbyCells = this.getNearbyCells(grid);
        nearbyCells.forEach(cell => {
            if (cell.type === 'plant') {
                let distance = Math.hypot(cell.position.x - this.position.x, cell.position.y - this.position.y);
                if (distance < closestPlantDistance) {
                    closestPlantDistance = distance;
                    closestPlant = cell;
                } 
            } else if (cell.type === 'predator') {
                let distance = Math.hypot(cell.position.x - this.position.x, cell.position.y - this.position.y);
                if (distance < closestPredator) {
                    closestPredatorDistance = distance;
                    closestPredator = cell;
                }
            }
        });

        if (closestPredator && closestPredatorDistance < 100) {
            this.acceleration.x = (this.position.x - closestPredator.position.x) * 0.01;
            this.acceleration.y = (this.position.y - closestPredator.position.y) * 0.01;
        } 
        else if (closestPlant) {
            this.acceleration.x = (closestPlant.position.x - this.position.x) * 0.02;
            this.acceleration.y = (closestPlant.position.y - this.position.y) * 0.02;
        }
    }

    predatorBehavior(grid) {
        let closestPrey = null;
        let closestDistance = Infinity;
        let nearbyCells = this.getNearbyCells(grid);
        nearbyCells.forEach(cell => {
            if (cell.type === 'prey') {
                let distance = Math.hypot(cell.position.x - this.position.x, cell.position.y - this.position.y);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestPrey = cell;
                }
            }
        });

        if (closestPrey) {
            this.acceleration.x = (closestPrey.position.x - this.position.x) * 0.03;
            this.acceleration.y = (closestPrey.position.y - this.position.y) * 0.03;
        }
    }

    checkCollisions(grid) {
        let nearbyCells = this.getNearbyCells(grid);

        nearbyCells.forEach(cell => {
            if (this !== cell) {

                const distance = Math.hypot(cell.position.x - this.position.x, cell.position.y - this.position.y);

                if (this.type === 'predator' && cell.type === 'prey' && distance < this.radius + cell.radius) {
                    cells.splice(cells.indexOf(cell), 1);
                    this.consumed += 1;
                    this.lifespan = Math.min(this.lifespan + lifespanIncreaseOnConsumption, this.maxLifespan);
                    if (this.consumed >= predatorCosumptionThreshold) {
                        this.duplicate();
                        this.consumed = 0;
                    }
                }

                if (this.type === 'prey' && cell.type === 'plant' && distance < this.radius + cell.radius) {
                    cells.splice(cells.indexOf(cell), 1);
                    this.consumed += 1;
                    this.lifespan = Math.min(this.lifespan + lifespanIncreaseOnConsumption, this.maxLifespan);
                    if (this.consumed >= preyConsumptionThreshold) {
                        this.duplicate();
                        this.consumed = 0;
                    }
                }
            }
        });
    }

    duplicate() {
        if (this.type == 'plant' && cells.filter(cell => cell.type === 'plant').length < maxPlants) {
            const radius = 3.8;
            const x = this.position.x + (Math.random() - 4) * gridSize;
            const y = this.position.y + (Math.random() - 4) * gridSize;
            const vx = 0;
            const vy = 0;
            cells.push(new Cell(x, y, vx, vy, radius, 'green', 'plant'));
        }
        if (this.type == 'prey' || 'predator' && this.type !== 'plant') {
            const radius = 3.8;
            const x = this.position.x + (Math.random() - 2) * gridSize;
            const y = this.position.y + (Math.random() - 2) * gridSize;
            const vx = (Math.random() - 0.5) * 2;
            const vy = (Math.random() - 0.5) * 2;
            cells.push(new Cell(x,y,vx,vy,radius, this.color, this.type));
        }
    }
}

function createCells(numOfCells, type, color) {
    for (let i = 0; i < numOfCells; i++) {
        let radius = 3.8;
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

function updateCounts() {
    plantCount.innerText = `Number of Plants: ${cells.filter(cell => cell.type === 'plant').length}`;
    preyCount.innerText = `Number of Prey: ${cells.filter(cell => cell.type === 'prey').length}`;
    predatorCount.innerText = `Number of Predator: ${cells.filter(cell => cell.type === 'predator').length}`;
}

function update() {
    ctx.clearRect( 0, 0, canvas.width, canvas.height);

    const grid = updateGrid();

    cells.forEach(cell => {
        cell.draw(ctx);
        cell.update(grid);
    });

    updateCounts();
    requestAnimationFrame(update);
}

setInterval(() => {
    cells.forEach(cell => {
        if (cell.type === 'plant') {
            cell.duplicate();
        }
    });
},duplicateInterval);

update();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    update();
});