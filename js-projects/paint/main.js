const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 300;

let isResizing = false;
let isDrawing = false;
let startX, startY, startWidth, startHeight, startLeft, startTop;
let direction = '';
let savedImageData;

let colorArray = ['rgb(255, 0, 0)', 'rgb(0, 128, 0)', 'rgb(0, 0, 255)', 'rgb(255, 255, 0)', 'rgb(255, 165, 0)', 'rgb(128, 0, 128)', 'rgb(255, 192, 203)', 'rgb(165, 42, 42)', 'rgb(0, 255, 255)', 'rgb(255, 0, 255)', 'rgb(0, 255, 0)', 'rgb(75, 0, 130)', 'rgb(238, 130, 238)', 'rgb(255, 215, 0)', 'rgb(192, 192, 192)', 'rgb(0, 0, 0)'];


let colorWheel = document.getElementById('color-wheel');
let chosenColors = document.getElementsByClassName('chosen-colors');

let mainColor1 = document.getElementById('main-color1');
let mainColor2 = document.getElementById('main-color2');

let colorPicker;
let activeMainColor = mainColor1;
let selectedColor = null;

let colorCode = document.getElementById('color-code');
let colorPreview = document.getElementById('color-preview');

colorWheel.addEventListener('click', () => {
    if(!colorPicker) {
        colorPicker = new iro.ColorPicker('#color-picker', {
            width: 300,
            layout: [
                { component: iro.ui.Box },
                { component: iro.ui.Slider, options: { sliderType: 'hue' } },
                { component: iro.ui.Slider, options: { sliderType: 'saturation' } },
                { component: iro.ui.Slider, options: { sliderType: 'value' } },
                { component: iro.ui.Slider, options: { sliderType: 'alpha' } },
            ]
        });

        colorPicker.on('color:change', (color) => {
            let colorValue = colorCode.value;
            let colorString;

            switch (colorValue) {
                case 'rgb': colorString = color.rgbString; break;
                case 'rgba': colorString = color.rgbaString; break;
                case 'hex': colorString = color.hexString; break;
                case 'hsl': colorString = color.hslString; break;
                case 'hsla': colorString = color.hslaString; break;
                case 'hsv':
                    let hsv = color.hsv;
                    colorString = `hsv(${hsv.h.toFixed(0)}, ${hsv.s.toFixed(0)}%, ${hsv.v.toFixed(0)}%)`;
                    break;
            }

            colorName.textContent = `Selected Color: ${colorString}`;
            colorPreview.style.backgroundColor = colorString;

            if (selectedColor) {
                selectedColor.style.backgroundColor = colorString;

                if (selectedColor === activeMainColor) {
                    activeMainColor.style.backgroundColor = colorString;
                }
            }
        })
    }
})


for(let i = 0; i < chosenColors.length; i++) {
    chosenColors[i].style.backgroundColor = colorArray[i];

    chosenColors[i].addEventListener('click', () => {
        selectedColor = chosenColors[i];

        activeMainColor.style.backgroundColor = selectedColor.style.backgroundColor;
    })
}

mainColor1.addEventListener('click', () => {
    activeMainColor = mainColor1;
    selectedColor = null;
})

mainColor2.addEventListener('click', () => {
    activeMainColor = mainColor2;
    selectedColor = null;
})

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