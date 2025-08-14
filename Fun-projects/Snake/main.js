const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

class Game {
    constructor () {
        this.gridSize = this.findingGridSize(20);
        this.cols = Math.floor(canvasWidth / this.gridSize);
        this.rows = Math.floor(canvasHeight / this.gridSize);
        
        this.totalGridWidth = this.cols * this.gridSize;
        this.totalGridHeight = this.rows * this.gridSize;

        this.offsetX = (canvasWidth - this.totalGridWidth) / 2;
        this.offsetY = (canvasWidth - this.totalGridHeight) / 2;

        this.dx,
        this.dy,

        this.snake;
    }

    findingGridSize (startSize) {
        let currentSize = startSize;

        while (currentSize > 10) {
            const cols = Math.floor(canvasWidth / currentSize);
            const rows = Math.floor(canvasHeight / currentSize);

            if (cols % 2 === 0 && rows % 2 === 0) {
                return currentSize;
            }

            currentSize--;
        }

        return currentSize;
    }
}