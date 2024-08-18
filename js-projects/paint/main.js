const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

let isResizing = false;
let startX, startY, startWidth, startHeight, startLeft, startTop;
let direction = '';
let isDrawing = false;

function updateCursorStyle(direction) {
    switch (direction) {
        case 'top':
        case 'bottom':
            canvas.style.cursor = 'ns-resize';
            break;

        case 'left':
        case 'right':
            canvas.style.cursor = 'ew-resize';
            break;

        case 'top-left':
        case 'bottom-right':
            canvas.style.cursor = 'nwse-resize';
            break;

        case 'top-right':
        case 'bottom-left':
            canvas.style.cursor = 'nesw-resize';
            break;

            default:
                canvas.style.cursor = 'default';
    }
}

function getResizeDirection(e, rect) {
    const edgeThreshold = 5;
    const right = Math.abs(rect.right - e.clientX) <= edgeThreshold;
    const left = Math.abs(e.clientX - rect.left) <= edgeThreshold;
    const bottom = Math.abs(rect.bottom - e.clientY) <= edgeThreshold;
    const top = Math.abs(e.clientY - rect.top) <= edgeThreshold;

    if (top && left) return 'top-left';
    if (top && right) return 'top-right';
    if (bottom && left) return 'bottom-left';
    if (bottom && right) return 'bottom-right';
    if (top) return 'top';
    if (left) return 'left';
    if (right) return 'right';
    if (bottom) return 'bottom';

    return '';
 }

 canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    startWidth = rect.width;
    startHeight = rect.height;
    startLeft = rect.left;
    startTop = rect.top;

    direction = getResizeDirection(e, rect);

    if (direction) {
        isResizing = true;
        updateCursorStyle(direction);
        e.preventDefault();
    }
    else {
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    }
});

document.addEventListener('mousemove', (e) => {
    if (isResizing) {

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (direction.includes('right')) {
        canvas.width = Math.max(startWidth + dx, 50);
    }

    if (direction.includes('bottom')) {
        canvas.height = Math.max(startHeight + dy, 50);
    }

    if (direction.includes('left')) {
        const newWidth = Math.max(startWidth - dx, 50);
        canvas.width = newWidth;
        canvas.style.left = startLeft + dx + 'px';
    }

    if (direction.includes('top')) {
        const newHeight = Math.max(startHeight - dy, 50);
        canvas.height = newHeight;
        canvas.style.top = startTop + dy + 'px';
    }

    updateCursorStyle(direction);
    } else if (isDrawing) {
        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.stroke();
    } else {
        const rect = canvas.getBoundingClientRect();
        const dir = getResizeDirection(e, rect);
        updateCursorStyle(dir);
    }
});

document.addEventListener('mouseup', () => {
    isResizing = false;
    isDrawing = false;
    updateCursorStyle('');
});

document.addEventListener('selectstart', (e) => {
    if (isResizing) {
        e.preventDefault();
    }
});