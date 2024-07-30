let countElement = document.getElementById("count-el");
let height = document.querySelector(".waves");
countElement.textContent = count = 0;

function waveHeight() {
    let waveHeight = count + 15;
    height.style.height = waveHeight + "vh";
}

function decrease() {
    count--;
    countElement.textContent = count;
    waveHeight();
}


function increase() {
    count++;
    countElement.textContent = count;
    waveHeight();
    console.log(height);
}


function reset() {
    count = 0;
    countElement.textContent = count;
    waveHeight();
    height.setAttribute("height", count + 15);
}

console.log(count);