document.addEventListener('DOMContentLoaded', () => {
    const app = new DrawingApp('myCanvas', 'color-palette', 'picker', 'color-wheel');
    app.init();
});

const CONFIG = {
    CANVAS_WIDTH: 500,
    CANVAS_HEIGHT: 300,
    EDGE_THRESHOLD: 10,
    MAX_CUSTOM_COLORS: 10,
    COLORS: [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FFA500', '#800080',
    '#00FFFF', '#FFC0CB', '#808080', '#000000', '#FFFFFF', '#8B4513',
    '#FFD700', '#C0C0C0', '#A52A2A', '#008000', '#000080', '#FF6347',
    '#FF1493', '#F0E68C', '#4B0082', '#FF4500', '#2E8B57', '#B22222',
    '#DAA520', '#7FFFD4'
]
};


class DrawingApp {
    constructor(canvasId, paletteId, pickerId, colorWheelId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.colorPalette = document.getElementById(paletteId);
        this.colorPickerContainer = document.getElementById(pickerId);
        this.colorWheel = document.getElementById(colorWheelId);
        this.hexValueParagraph = document.getElementById('hex-value');
        this.rgbaValueParagraph = document.getElementById('rgba-value');
        this.colorPreview = document.getElementById('color-preview');
        
        this.isDrawing = false;
        this.isResizing = false;
        this.direction = '';
        this.savedImageData = null;
        this.brushType = 'round';
        this.currentCustomColorIndex = -1;
        this.activeMainColor = null;
        this.colorPicker = null;
        
        this.customColorsButtons = [];
        this.lastX = 0;
        this.lastY = 0;
    }

    init() {
        this.setupCanvas();
        this.setupColorPalette();
        this.setupColorPicker();
        this.setupEventListeners();
    }

    setupCanvas() {
        this.canvas.width = CONFIG.CANVAS_WIDTH;
        this.canvas.height = CONFIG.CANVAS_HEIGHT;
        this.activeMainColor = document.getElementById('main-color1');
        this.activeMainColor.style.backgroundColor = '#000';
        document.getElementById('main-color2').style.backgroundColor = '#fff';
        this.ctx.strokeStyle = this.activeMainColor.style.backgroundColor;
    }

    setupColorPalette() {
        const colors = CONFIG.COLORS;

        colors.forEach(color => {
            const btn = document.createElement('button');
            btn.style.backgroundColor = color;
            btn.addEventListener('click', () => this.setActiveColor(color));
            this.colorPalette.appendChild(btn);
        });

        for (let i = 0; i < CONFIG.MAX_CUSTOM_COLORS; i++) {
            const btn = document.createElement('button');
            btn.style.background = 'transparent';
            this.colorPalette.appendChild(btn);
            this.customColorsButtons.push(btn);

            btn.addEventListener('click', () => {
                this.setActiveColor(btn.style.backgroundColor);
            });
        }
    }

    setupColorPicker() {
        this.colorWheel.addEventListener('click', (event) => {
            this.initializeColorPicker();
            this.currentCustomColorIndex = (this.currentCustomColorIndex + 1) % CONFIG.MAX_CUSTOM_COLORS;
            this.colorPickerContainer.style.display = 'block';
            this.hexValueParagraph.style.display = 'block';
            this.rgbaValueParagraph.style.display = 'block';
            document.addEventListener('click', this.closeColorPicker.bind(this));
            event.stopPropagation();
        });
    }

    initializeColorPicker() {
        if (this.colorPicker) return;

        this.colorPicker = new iro.ColorPicker(this.colorPickerContainer, {
            width: 300,
            layoutDirection: 'horizontal',
            layout: [
                { component: iro.ui.Box },
                { component: iro.ui.Slider, options: { sliderType: 'hue' } },
                { component: iro.ui.Slider, options: { sliderType: 'saturation' } },
                { component: iro.ui.Slider, options: { sliderType: 'value' } },
                { component: iro.ui.Slider, options: { sliderType: 'alpha' } }
            ],
            color: this.activeMainColor.style.backgroundColor || '#FFFFFF'
        });

        this.colorPicker.on('color:change', (color) => {
            const colorString = color.rgbaString;
            this.customColorsButtons.forEach((btn, index) => {
                if (index === this.currentCustomColorIndex) {
                    btn.style.backgroundColor = colorString;
                }
            });
            this.updateColorPreview(colorString, color.hexString);
        });
    }

    updateColorPreview(colorString, hexString) {
        this.colorPreview.style.backgroundColor = colorString;
        this.hexValueParagraph.textContent = `Hex: ${hexString}`;
        this.rgbaValueParagraph.textContent = `RGBA: ${colorString}`;
    }

    closeColorPicker(event) {
        if (!this.colorPickerContainer.contains(event.target) && event.target !== this.colorWheel) {
            this.colorPickerContainer.style.display = 'none';
            this.hexValueParagraph.style.display = 'none';
            this.rgbaValueParagraph.style.display = 'none';
            document.removeEventListener('click', this.closeColorPicker.bind(this));
        }
    }

    setActiveColor(color) {
        this.activeMainColor.style.backgroundColor = color;
        this.ctx.strokeStyle = color;
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleDocumentMouseUp.bind(this));
        document.addEventListener('selectstart', (e) => {
            if (this.isResizing) e.preventDefault();
        });
    }

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.startWidth = rect.width;
        this.startHeight = rect.height;
        this.startLeft = rect.left;
        this.startTop = rect.top;

        this.direction = this.getResizeDirection(e, rect);

        if (this.direction) {
            this.isResizing = true;
            this.saveCanvasState();
            this.updateCursorStyle(this.direction);
            e.preventDefault();
        } else {
            this.isDrawing = true;
            this.ctx.beginPath();
            this.ctx.moveTo(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);
            if (this.brushMap[this.brushType]) {
                this.brushMap[this.brushType](e);
            }
        }
    }

    handleMouseUp() {
        this.isDrawing = false;
        this.ctx.closePath();
    }

    handleMouseMove(e) {
        if (this.isResizing) {
            this.resizeCanvas(e);
        } else if (this.isDrawing) {
            this.ctx.lineTo(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);
            this.ctx.stroke();
        } else {
            const rect = this.canvas.getBoundingClientRect();
            const dir = this.getResizeDirection(e, rect);
            this.updateCursorStyle(dir);
        }
    }

    handleDocumentMouseUp() {
        this.isResizing = false;
        this.isDrawing = false;
        this.updateCursorStyle('');
    }

    resizeCanvas(e) {
        const dx = e.clientX - this.startX;
        const dy = e.clientY - this.startY;

        let newHeight = this.startHeight;
        let newWidth = this.startWidth;

        if (this.direction.includes('right')) {
            newWidth = Math.max(this.startWidth + dx, 50);
        }

        if (this.direction.includes('bottom')) {
            newHeight = Math.max(this.startHeight + dy, 50);
        }

        if (this.direction.includes('left')) {
            newWidth = Math.max(this.startWidth - dx, 50);
        }

        if (this.direction.includes('top')) {
            newHeight = Math.max(this.startHeight - dy, 50);
        }

        const scaleX = newWidth / this.canvas.width;
        const scaleY = newHeight / this.canvas.height;

        this.canvas.width = newWidth;
        this.canvas.height = newHeight;

        this.ctx.scale(scaleX, scaleY);
        this.restoreCanvasState();

        this.updateCursorStyle(this.direction);
    }

    updateCursorStyle(direction) {
        const cursorMap = {
            'top': 'ns-resize',
            'bottom': 'ns-resize',
            'left': 'ew-resize',
            'right': 'ew-resize',
            'top-left': 'nwse-resize',
            'bottom-right': 'nwse-resize',
            'top-right': 'nesw-resize',
            'bottom-left': 'nesw-resize',
            'default': 'default'
        };
        this.canvas.style.cursor = cursorMap[direction] || cursorMap['default'];
    }

    getResizeDirection(e, rect) {
        const edgeThreshold = CONFIG.EDGE_THRESHOLD;
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

    saveCanvasState() {
        this.savedImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    restoreCanvasState() {
        this.ctx.putImageData(this.savedImageData, 0, 0);
    }
}
