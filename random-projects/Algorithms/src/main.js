let display = document.getElementById("container");
let numberOfBars = document.getElementById("bars");
let selectedValue = parseInt(numberOfBars.value);
let sorting = document.getElementById("Sorting");
let generate = document.getElementById("generateButton");
let start = document.getElementById("startButton");
let speed = document.getElementById("speed");
let speedValue = parseInt(speed.value);
const swapColors = ["#D30C7B", "#FCE762"];
const arr = [];
let left = 0;
let right = arr.length - 1;
let isSortingInProgress = false;

function randomArray() {
    arr.length = 0;
    for (let i = 0; i < selectedValue; i++) {
        arr.push(Math.floor(Math.random() * selectedValue));
    }
}

function initializeCanvasSize() {
  const canvas = document.getElementById("container");
  const rect = canvas.getBoundingClientRect();
  const dpi = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpi;
  canvas.height = rect.height * dpi;
};

window.addEventListener('resize', function() {
  initializeCanvasSize();
  drawBars();
});

initializeCanvasSize();
drawBars()


function drawBars() {
    display.innerHTML = "";
    randomArray();
    const canvas = display;
    const ctx = canvas.getContext("2d");

    const dpi = window.devicePixelRatio || 1;
    const canvasWidth = canvas.width / dpi;
    const canvasHeight = canvas.height/ dpi;
    const barWidth = canvasWidth/arr.length;

    ctx.clearRect(0,0, canvasWidth, canvasHeight);
    ctx.imageSmoothingEnabled = false;


    for(let i = 0; i <arr.length; i++) {
       const barHeight = (arr[i] / selectedValue) * canvasHeight;
       ctx.fillStyle = "#262626";
       ctx.fillRect(i * barWidth, canvasHeight - barHeight, barWidth, barHeight)
    }
}

generate.addEventListener("click", function() {
    selectedValue = parseInt(numberOfBars.value);
    drawBars();
})

start.addEventListener("click",async function(event) {
    event.preventDefault();
      let value = sorting.value;
    try {
        switch (value) {
            case "Bubble":
                bubbleSort(arr);
                break;
            case "Selection":
                selectionSort(arr);
                break;
            case "Merge":
                mergeSort(arr);
                break;
                case "Insertion":
                    insertionSort(arr);
                    break;
                case "Quick":
                    quickSort(arr);
                    break;
                    case "Heap":
                      heapSort(arr);
                      break;
                       case "Count":
                        countSort(arr);
                        break;
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
});



speed.addEventListener("change", function() {
    speedValue = parseInt(speed.value);
});

function updateBars(bars, compareIndexes = [], swappedIndex = null, sorted = false) {
  return new Promise((resolve) => {
    setTimeout(() => {
      requestAnimationFrame(() => {
      const canvas = display;
      const ctx = canvas.getContext("2d");

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const barWidth = canvasWidth/arr.length;
      const minBarHeight = Math.min(...arr) / selectedValue;
      const maxBarHeight = Math.max(...arr) / selectedValue;


      ctx.clearRect(0,0, canvasWidth, canvasHeight);

            for (let i = 0; i < arr.length; i++) {
        const barHeight = (arr[i] / selectedValue) * canvasHeight;

        if (isSorted()) {
          const gradient = ctx.createLinearGradient(0, 0, canvasWidth, 0);
        gradient.addColorStop(0, '#00008B');      // Dark Blue
        gradient.addColorStop(1/6, '#0000CD');    // Medium Blue
        gradient.addColorStop(2/6, '#0000FF');    // Blue
        gradient.addColorStop(3/6, '#4169E1');    // Royal Blue
        gradient.addColorStop(4/6, '#6495ED');    // Cornflower Blue
        gradient.addColorStop(5/6, '#87CEEB');    // Sky Blue
        gradient.addColorStop(1, '#ADD8E6');      // Light Blue
        ctx.fillStyle = gradient;
        } else {
          if (compareIndexes.includes(i)) {
            color = swapColors[0];
          } else if (swappedIndex === i || swappedIndex === i + 1) {
           color = swapColors[1];
          } else {
            color = "#262626";
          }
          ctx.fillStyle = color;
        }
        ctx.fillRect(i * barWidth, canvasHeight - barHeight, barWidth, barHeight);
      }
      })
      resolve();
    }, speedValue);
  });
};

function isSorted() {
    for (let i = 1; i < arr.length; i++) {
        if (arr[i - 1] > arr[i]) {
            return false;
        }
    }
    return true;
}