const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 300;

let isResizing = false;
let isDrawing = false;
let startX, startY, startWidth, startHeight, startLeft, startTop;
let direction = '';
let savedImageData;


let colorWheel = document.getElementById('color-wheel');
let colorPicker;
let colorPickerContainer = document.getElementById('picker');
let colorPreview = document.getElementById('color-preview');
let hexValueParagraph = document.getElementById('hex-value');
let rgbaValueParagraph = document.getElementById('rgba-value');

const colors = [
    '#FF0000',
    '#00FF00',
    '#0000FF',
    '#FFFF00',
    '#FF00FF',
    '#00FFFF'
];

const colorButtons = document.querySelectorAll('.color-btn');

colorButtons.forEach((btn, index) => {
    btn.style.backgroundColor = colors[index];
})

let mainColor1 = document.getElementById('main-color1');
let mainColor2 = document.getElementById('main-color2');

let activeMainColor = mainColor1;

colorButtons.forEach((colorSwitch) => {
    colorSwitch.addEventListener('click', () => {
        const color = window.getComputedStyle(colorSwitch).backgroundColor;
        activeMainColor.style.backgroundColor = color;
    })
})

const initializeColorPicker = () => {
    colorPicker = new iro.ColorPicker(colorPickerContainer, {
        width: 300,
        layoutDirection: 'horizontal',
        layout: [
            {
                component: iro.ui.Box,
                options: {}
            },
            {
                component: iro.ui.Slider,
                options: {
                    sliderType: 'hue'
                }
            },
            {
                component: iro.ui.Slider,
                options: {
                    sliderType: 'saturation'
                }
            },
            {
                component: iro.ui.Slider,
                options: {
                    sliderType: 'value'
                }
            },
            {
                component: iro.ui.Slider,
                options: {
                    sliderType: 'alpha'
                }
            }
        ],
        color: activeMainColor.style.backgroundColor || '#FFFFFF'
    });

    colorPicker.on('color:change', (color) => {
        activeMainColor.style.backgroundColor = color.rgbaString;
        colorPreview.style.backgroundColor = color.rgbaString;
        hexValueParagraph.textContent = `Hex: ${color.hexString}`;
        rgbaValueParagraph.textContent = `RGBA: ${color.rgbaString}`;
    });
}

const closeColorPicker = (event) => {
    if (!colorPickerContainer.contains(event.target) && event.target !== colorWheel) {
        colorPickerContainer.style.display = 'none';
        hexValueParagraph.style.display = 'none';
        rgbaValueParagraph.style.display = 'none';
        document.removeEventListener('click', closeColorPicker);
    }
}

colorWheel.addEventListener('click', (event) => {
    if (!colorPicker) {
        initializeColorPicker();
    }
    colorPickerContainer.style.display = 'block';
    hexValueParagraph.style.display = 'block';
    rgbaValueParagraph.style.display = 'block';
    document.addEventListener('click', closeColorPicker);
    event.stopPropagation();
});

mainColor1.addEventListener('click', () => {
    activeMainColor = mainColor1;
});

mainColor2.addEventListener('click', () => {
    activeMainColor = mainColor2;
});

mainColor1.style.backgroundColor = '#000';
mainColor2.style.backgroundColor = '#fff';



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
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
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
    if (isResizing) {
        e.preventDefault();
    }
});