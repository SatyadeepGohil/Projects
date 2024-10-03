let time = document.getElementById('time');
let start = document.getElementById('start');
let stop = document.getElementById('stop');
let reset = document.getElementById('reset');


let hour = 0;
let minute = 0;
let seconds = 0;
let count = 0;
let timer;
let interval;

start.addEventListener('click', () =>{
    if (!timer) {
    timer = true;
    interval = setInterval(stopwatch,10);
    }
})

stop.addEventListener('click', () =>{
    timer = false;
    clearInterval(interval);
})

reset.addEventListener("click", () => {
    timer = false
    hour = 0;
    minute = 0;
    seconds = 0;
    count = 0;
    clearInterval(interval);
    time.textContent = "00:00:00.00";
})

function stopwatch() {
    if (timer) {
    count++;
    if (count === 100) {
        seconds++;
        count = 0;
        if (seconds === 60) {
            minute++;
            seconds = 0;
            if (minute === 60) {
                hour++;
                minute = 0;
            }
        }
    }

    let hourString = hour < 10 ? "0" + hour : hour;
    let minuteString = minute < 10 ? "0" + minute : minute;
    let secondsString = seconds < 10 ? "0" + seconds : seconds;
    let countString = count < 10 ? "0" + count : count;

    time.textContent = `${hourString}:${minuteString}:${secondsString}.${countString}`;
}
}