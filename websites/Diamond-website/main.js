document.addEventListener('DOMContentLoaded', () => {
    const COLOR_TRACK = "#CBD5E1";
    const COLOR_RANGE = "#0EA5E9";

    // Get the sliders and tooltips
    const fromPriceSlider = document.querySelector('#fromPriceSlider');
    const toPriceSlider = document.querySelector('#toPriceSlider');
    const fromPriceTooltip = document.querySelector('#fromPriceSliderTooltip');
    const toPriceTooltip = document.querySelector('#toPriceSliderTooltip');
    const priceScale = document.getElementById('priceScale');

    // Carat sliders and tooltips
    const fromCaratSlider = document.querySelector('#fromCaratSlider');
    const toCaratSlider = document.querySelector('#toCaratSlider');
    const fromCaratTooltip = document.querySelector('#fromCaratSliderTooltip');
    const toCaratTooltip = document.querySelector('#toCaratSliderTooltip');
    const caratScale = document.getElementById('caratScale');

    // Color sliders and tooltips
    const fromColorSlider = document.querySelector('#fromColorSlider');
    const toColorSlider = document.querySelector('#toColorSlider');
    const fromColorTooltip = document.querySelector('#fromColorSliderTooltip');
    const toColorTooltip = document.querySelector('#toColorSliderTooltip');
    const colorScale = document.getElementById('colorScale');

    function controlFromSlider(fromSlider, toSlider, fromTooltip, toTooltip) {
        const [from, to] = getParsed(fromSlider, toSlider);
        fillSlider(fromSlider, toSlider, COLOR_TRACK, COLOR_RANGE, toSlider);
        if (from > to) {
            fromSlider.value = to;
        }
        setTooltip(fromSlider, fromTooltip);
    }

    function controlToSlider(fromSlider, toSlider, fromTooltip, toTooltip) {
        const [from, to] = getParsed(fromSlider, toSlider);
        fillSlider(fromSlider, toSlider, COLOR_TRACK, COLOR_RANGE, toSlider);
        setToggleAccessible(toSlider);
        if (from <= to) {
            toSlider.value = to;
        } else {
            toSlider.value = from;
        }
        setTooltip(toSlider, toTooltip);
    }

    function getParsed(currentFrom, currentTo) {
        const from = parseInt(currentFrom.value, 10);
        const to = parseInt(currentTo.value, 10);
        return [from, to];
    }

    function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
        const rangeDistance = to.max - to.min;
        const fromPosition = from.value - to.min;
        const toPosition = to.value - to.min;
        controlSlider.style.background = `linear-gradient(
          to right,
          ${sliderColor} 0%,
          ${sliderColor} ${(fromPosition) / (rangeDistance) * 100}%,
          ${rangeColor} ${((fromPosition) / (rangeDistance)) * 100}%,
          ${rangeColor} ${(toPosition) / (rangeDistance) * 100}%, 
          ${sliderColor} ${(toPosition) / (rangeDistance) * 100}%, 
          ${sliderColor} 100%)`;
    }

    function setToggleAccessible(currentTarget) {
        const toSlider = document.querySelector('#toPriceSlider');
        if (Number(currentTarget.value) <= 0) {
            toSlider.style.zIndex = 2;
        } else {
            toSlider.style.zIndex = 0;
        }
    }

    function setTooltip(slider, tooltip) {
        const value = slider.value;
        tooltip.textContent = slider === fromColorSlider || slider === toColorSlider ? colorScaleLabels[value] : (slider === fromCaratSlider || slider === toCaratSlider) ? value + ' ct' : '$' + value;
        const thumbPosition = (value - slider.min) / (slider.max - slider.min);
        const percent = thumbPosition * 100;
        const markerWidth = 20; // Width of the marker in pixels
        const offset = (((percent - 50) / 50) * markerWidth) / 2;
        tooltip.style.left = `calc(${percent}% - ${offset}px)`;
    }

    const colorScaleLabels = {
        1: 'D', 2: 'E', 3: 'F', 4: 'G', 5: 'H', 6: 'I', 7: 'J', 8: 'K', 9: 'L', 10: 'M', 11: 'N', 12: 'O', 13: 'P', 14: 'Q', 15: 'R', 16: 'S', 17: 'T', 18: 'U', 19: 'V', 20: 'W', 21: 'X', 22: 'Y', 23: 'Z'
    };

    function createScale(min, max, step, scaleElement, isCarat = false, isColor = false) {
        const range = max - min;
        const steps = range / step;
        for (let i = 0; i <= steps; i++) {
            const value = min + (i * step);
            const percent = (value - min) / range * 100;
            const marker = document.createElement('div');
            marker.style.left = `${percent}%`;
            marker.textContent = isCarat ? value + ' ct' : isColor ? colorScaleLabels[value] : '$' + value;
            scaleElement.appendChild(marker);
        }
    }

    fromPriceSlider.oninput = () => controlFromSlider(fromPriceSlider, toPriceSlider, fromPriceTooltip, toPriceTooltip);
    toPriceSlider.oninput = () => controlToSlider(fromPriceSlider, toPriceSlider, fromPriceTooltip, toPriceTooltip);
    // Carat slider events
    fromCaratSlider.oninput = () => controlFromSlider(fromCaratSlider, toCaratSlider, fromCaratTooltip, toCaratTooltip);
    toCaratSlider.oninput = () => controlToSlider(fromCaratSlider, toCaratSlider, fromCaratTooltip, toCaratTooltip);
    // Color slider events
    fromColorSlider.oninput = () => controlFromSlider(fromColorSlider, toColorSlider, fromColorTooltip, toColorTooltip);
    toColorSlider.oninput = () => controlToSlider(fromColorSlider, toColorSlider, fromColorTooltip, toColorTooltip);

    // Initial load
    fillSlider(fromPriceSlider, toPriceSlider, COLOR_TRACK, COLOR_RANGE, toPriceSlider);
    fillSlider(fromCaratSlider, toCaratSlider, COLOR_TRACK, COLOR_RANGE, toCaratSlider);
    fillSlider(fromColorSlider, toColorSlider, COLOR_TRACK, COLOR_RANGE, toColorSlider);
    setToggleAccessible(toPriceSlider);
    setTooltip(fromPriceSlider, fromPriceTooltip);
    setTooltip(toPriceSlider, toPriceTooltip);
    setTooltip(fromCaratSlider, fromCaratTooltip);
    setTooltip(toCaratSlider, toCaratTooltip);
    setTooltip(fromColorSlider, fromColorTooltip);
    setTooltip(toColorSlider, toColorTooltip);
    createScale(50, 350, 50, priceScale);
    createScale(0.25, 3.00, 0.25, caratScale, true);
    createScale(1, 23, 1, colorScale, false, true);
});
