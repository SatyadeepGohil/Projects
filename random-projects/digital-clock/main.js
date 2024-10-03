let clock = document.getElementById('clock');

function updateClock() {
    
const time = new Date();
let h = time.getHours().toString().padStart(2, '0');
let m = time.getMinutes().toString().padStart(2, '0');
let s = time.getSeconds().toString().padStart(2, '0');
let ms = time.getMilliseconds().toString().padStart(3, '0');
let dayofWeeks = time.getDay();
let date = time.getDate().toString().padStart(2, '0');
let month = time.getMonth();
let year = time.getFullYear();
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const currentMonth = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

return clock.innerHTML = `TIME ${h}:${m}:${s}.${ms} <br> DATE ${date}/${currentMonth[month]}/${year} Day ${days[dayofWeeks]}`;
}

updateClock();

setInterval (updateClock,1);


console.log(days[dayofWeeks],currentMonth[month]);