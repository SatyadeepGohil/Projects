const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 300;

let isResizing = false;
let isDrawing = false;
let startX, startY, startWidth, startHeight, startLeft, startTop;
let direction = '';
let savedImageData;
let brushType = 'round';

const colors = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FFA500', '#800080',
    '#00FFFF', '#FFC0CB', '#808080', '#000000', '#FFFFFF', '#8B4513',
    '#FFD700', '#C0C0C0', '#A52A2A', '#008000', '#000080', '#FF6347',
    '#FF1493', '#F0E68C', '#4B0082', '#FF4500', '#2E8B57', '#B22222',
    '#DAA520', '#7FFFD4'
];


const mainColor1 = document.getElementById('main-color1');
const mainColor2 = document.getElementById('main-color2');

let activeMainColor = mainColor1;

const colorPalette = document.getElementById('color-palette');

colors.forEach(color => {
    const btn = document.createElement('button');
    btn.style.backgroundColor = color;
    btn.addEventListener('click', () => {
        activeMainColor.style.backgroundColor = color;
        ctx.strokeStyle = activeMainColor.style.backgroundColor;
    });
    colorPalette.appendChild(btn);
});

const customColorsButtons = [];
const maxCustomColors = 13;
let currentCustomColorIndex = -1;

for (let i = 0; i < maxCustomColors; i++) {
    const btn = document.createElement('button');
    btn.style.background = 'transparent';
    colorPalette.appendChild(btn);
    customColorsButtons.push(btn);

    btn.addEventListener('click', () => {
        activeMainColor.style.backgroundColor = btn.style.backgroundColor;
        ctx.strokeStyle = activeMainColor.style.backgroundColor;
    })
}

const colorPickerContainer = document.getElementById('picker');
const colorPreview = document.getElementById('color-preview')
const colorWheel = document.getElementById('color-wheel');
const hexValueParagraph = document.getElementById('hex-value');
const rgbaValueParagraph = document.getElementById('rgba-value');

let colorPicker;

function initializeColorPicker() {
    if (colorPicker) return;

    colorPicker = new iro.ColorPicker(colorPickerContainer, {
        width: 300,
        layoutDirection: 'horizontal',
        layout: [
            { component: iro.ui.Box },
            { component: iro.ui.Slider, options: { sliderType: 'hue' } },
            { component: iro.ui.Slider, options: { sliderType: 'saturation' } },
            { component: iro.ui.Slider, options: { sliderType: 'value' } },
            { component: iro.ui.Slider, options: { sliderType: 'alpha' } }
        ],
        color: activeMainColor.style.backgroundColor || '#FFFFFF'
    });

    colorPicker.on('color:change', (color) => {
        const colorString = color.rgbaString;

        customColorsButtons.forEach((btn, index) => {
            if (index === currentCustomColorIndex) {
                btn.style.backgroundColor = colorString;
            }
        });

        colorPreview.style.backgroundColor = colorString;
        hexValueParagraph.textContent = `Hex: ${color.hexString}`;
        rgbaValueParagraph.textContent = `RGBA: ${colorString}`;
    });
}

function closeColorPicker (event) {
    if (!colorPickerContainer.contains(event.target) && event.target !== colorWheel) {
        colorPickerContainer.style.display = 'none';
        hexValueParagraph.style.display = 'none';
        rgbaValueParagraph.style.display = 'none';
        document.removeEventListener('click', closeColorPicker);
    }
}

colorWheel.addEventListener('click', (event) => {
    initializeColorPicker();
    currentCustomColorIndex = (currentCustomColorIndex + 1) % maxCustomColors;
    colorPickerContainer.style.display = 'block';
    hexValueParagraph.style.display = 'block';
    rgbaValueParagraph.style.display = 'block';
    document.addEventListener('click', closeColorPicker);
    event.stopPropagation();
});

[mainColor1,mainColor2].forEach(mainColor => {
    mainColor.addEventListener('click', () => {
        activeMainColor = mainColor;
        ctx.strokeStyle = activeMainColor.style.backgroundColor;
    });
});


mainColor1.style.backgroundColor = '#000';
mainColor2.style.backgroundColor = '#fff';


const brushSelection = document.getElementById('brush-selection');

brushSelection.addEventListener('change', (e) => {
    brushType = e.target.value;
});

function drawSquareBrush(e) {
    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.strokeStyle = activeMainColor.style.backgroundColor;
    ctx.lineWidth = 5;
    ctx.lineCap = 'square';
    ctx.stroke();
}

function drawRoundBrush(e) {
    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.strokeStyle = activeMainColor.style.backgroundColor;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.stroke();
}

function drawSprayBrush(e) {
    for(let i = 0; i < 10; i++) {
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;
        ctx.fillStyle = activeMainColor.style.backgroundColor;
        ctx.fillRect(e.clientX + offsetX - canvas.offsetLeft, e.clientY + offsetY - canvas.offsetTop, 1, 1);
    }
}


function saveCanvasState() {
    savedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreCanvasState() {
    ctx.putImageData(savedImageData, 0, 0);
}

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
    const edgeThreshold = 10;
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
        saveCanvasState();
        updateCursorStyle(direction);
        e.preventDefault();
    }
    else {
        isDrawing = true;
        switch (brushType) {
            case 'round':
                drawRoundBrush(e);
                break;
            case 'sqaure':
                drawSquareBrush(e);
                break;
            case 'spray':
                drawSprayBrush(e);
                break;
        }
    }
});

document.addEventListener('mousemove', (e) => {
    if (isResizing) {

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    let newHeight = startHeight;
    let newWidth = startWidth;

    if (direction.includes('right')) {
        newWidth = Math.max(startWidth + dx, 50);
    }

    if (direction.includes('bottom')) {
        newHeight = Math.max(startHeight + dy, 50);
    }

    if (direction.includes('left')) {
        newWidth = Math.max(startWidth - dx, 50);
    }

    if (direction.includes('top')) {
        newHeight = Math.max(startHeight - dy, 50);
    }

    const scaleX = newWidth / canvas.width;
    const scaleY = newHeight / canvas.height;

    canvas.width = newWidth;
    canvas.height = newHeight;

    ctx.scale(scaleX, scaleY);
    restoreCanvasState();


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
    if (isResizing) e.preventDefault();
});