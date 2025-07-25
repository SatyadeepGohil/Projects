const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

let gridSize = 20;
function findingGridSize() {

    let currentSize = gridSize;

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

gridSize = findingGridSize();


function drawGrid () {
    console.log(gridSize);
    const cols = Math.floor(canvasWidth / gridSize);
    const rows = Math.floor(canvasHeight / gridSize);

    const totalGridWidth = cols * gridSize;
    const totalGridHeight = rows * gridSize;

    const offsetX = (canvasWidth - totalGridWidth) / 2;
    const offsetY = (canvasHeight - totalGridHeight) / 2;

    console.log('Grid Size:', gridSize);
    console.log('Canvas Width:', canvasWidth, 'Canvas Height:', canvasHeight);
    console.log('Total Grid Width', totalGridWidth, 'Total Grid Height', totalGridHeight)
    console.log('Cols:', cols, 'Rows:', rows);
    console.log('OffsetX:', offsetX, 'OffsetY:', offsetY);

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)


    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    for (let i = 0; i <= cols; i++) {
        const x = offsetX + i * gridSize;
        ctx.beginPath();
        ctx.moveTo(x, offsetY);
        ctx.lineTo(x, offsetY + totalGridHeight);
        ctx.stroke();
    }

    for (let j = 0; j <= rows; j++) {
        const y = offsetY + j * gridSize;
        ctx.beginPath();
        ctx.moveTo(offsetX, y);
        ctx.lineTo(offsetX + totalGridWidth, y);
        ctx.stroke();
    }

}

drawGrid();