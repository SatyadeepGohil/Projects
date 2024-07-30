async function bubbleSort(arr) {
    let swapped = false;
        let bars = document.getElementById("container");
            do {
                swapped = false;
                for (let i = 0; i < arr.length; i++){
                    for (let j = 0; j < arr.length - i - 1; j++) {
                        await updateBars(arr, [j, j + 1]);
                        if (arr[j] > arr[j + 1]) {
                        let temp = arr[j];
                        arr[j] = arr[j + 1]
                        arr[j + 1] = temp;
                        swapped = true;
                        await updateBars(bars , [], j);
                    }
                }
            }
        } while (swapped);
         await updateBars(bars, [], null, true);
    }

async function selectionSort(arr) {
    const n = arr.length;
    let bars = display;

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;

        for (let j = i + 1; j < n; j++) {
        if (arr[j] < arr[minIndex]) {
            minIndex = j;
        }
    }

    if (minIndex !== i) {
        await updateBars(bars, [i , minIndex]);
        const temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
        await updateBars(bars, [i, minIndex]);
        }
    }
    await updateBars(bars, [], null, true);
    return arr;
}

async function mergeSort(arr,left = 0, right=arr.length - 1) {
    if (left < right) {
        const mid = Math.floor((left + right) / 2);
        await mergeSort(arr, left, mid);
        await mergeSort(arr, mid + 1, right);
        await merge(arr, left, mid, right);
    }
    return;
}

async function merge(arr, left, mid, right) {
    let n1 = mid - left + 1;
    let n2 = right - mid;

    let leftArr = new Array(n1);
    let rightArr = new Array(n2);

    let bars = document.querySelectorAll("#container div");

    for(let i = 0; i < n1; i++) {
        leftArr[i] = arr[left + i];
    }

    for (let j = 0; j < n2; j++) {
        rightArr[j] = arr[mid + 1 + j];
    }

    let i = 0,
        j = 0,
        k = left;

    while(i < n1 && j < n2) {
        if (leftArr[i] <= rightArr[j]) {
            arr[k] = leftArr[i];
            i++;
            await updateBars(bars, [i + left - 1, j + mid]);
        } else {
            arr[k] = rightArr[j];
            j++;
            await updateBars(bars,[i + left - 1, j + mid],k);
        }
        k++;
    }

    while(i < n1) {
        arr[k] = leftArr[i];
        i++;
        k++;
        await updateBars(bars,[i + left - 1, null]);
        }


         while (j < n2) {
        arr[k] = rightArr[j];
        j++;
        k++;
        await updateBars(bars, [null, j + mid]);
        }
       await updateBars(bars, [], null, true);
}

async function insertionSort(arr) {
   let bars = document.getElementById("container");
     console.log("Bars length before update:", bars.length);
    if (bars) {
        for (let i = 1; i < arr.length; i++) {
            let current = arr[i];
            let j = i - 1;
            while(j >= 0 && arr[j] > current){
                arr[j + 1] = arr[j];
                await updateBars(bars, [], [j,j + 1]);
                j--;
            }
            arr[j + 1] = current;
            await updateBars(bars, [] ,[j + 1], null);
             console.log("Bars length after update:", bars.length);
        }
    }
    await updateBars(bars, [], null, true);
}


async function quickSort(arr, left = 0, right = arr.length - 1) {
    const bars = document.querySelectorAll("#container div");
    if (left < right) {
        const pivotIndex = await partition(arr, left, right, bars);
        quickSort(arr, left, pivotIndex - 1);
        await updateBars(bars, [left, pivotIndex - 1]);

        quickSort(arr, pivotIndex + 1, right);
        await updateBars(bars, [pivotIndex + 1, right]);
    }
    return arr;
}

async function partition(arr, left, right, bars) {
    const pivot = arr[right];
    let i = left - 1;

    for (let j = left; j < right; j++) {
        if (arr[j] <= pivot){
            i++;
            await swap(arr, i, j, bars);
        }
    }
    await swap(arr, i + 1, right, bars);
    return i + 1;
}

async function swap(arr, i, j, bars) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
    await updateBars(bars, [i, j]);
}

async function heapSort(arr) {
    let bars = document.querySelectorAll("#container div");
    let n = arr.length;

    for (let i = Math.floor(n/2) - 1; i >= 0; i--) {
        await heapify(arr, n, i, bars);
        await updateBars(bars, [i,0]);
    }
    for(let i = n - 1; i > 0; i--) {
        let temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        await heapify(arr,i,0,bars);
        await updateBars(bars,[i,0]);
    }
     await updateBars(bars,null,null,true);
}


async function heapify(arr, n, i,bars) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]){
        largest = left;
    }
    

    if (right< n && arr[right] > arr[largest]){
        largest = right;
    }

    if (largest != i) {
        let swap = arr[i];
        arr[i] = arr[largest];
        arr[largest] = swap;
        await updateBars(bars,[i,largest]);
        await heapify(arr,n,largest,bars);
    }
}

async function countSort(arr) {
    const bars = document.getElementById("container");
    const n = arr.length;

    let max = 0;
    for (let i = 0; i < n; i++) {
        max = Math.max(max, arr[i]);
    }

    const countArray = new Array(max + 1).fill(0);

    for (let i = 0; i < n; i++) {
        countArray[arr[i]]++;
        await updateBars(bars, [i], null);
    }

    for (let i = 1; i <= max; i++) {
        countArray[i] += countArray[i - 1];
        await updateBars(bars, [] ,countArray[i]);
    }

    const outputArray = [];
    for (let i = 0; i < n; i++) {
       const element = arr[i];
       const outputIndex = countArray[element] - 1;
       outputArray[outputIndex] = element;
       countArray[element]--;
       await updateBars(bars, [i], outputIndex);
    }

    for (let i = 0; i < n; i++) {
        arr[i] = outputArray[i];
        await updateBars(bars, [i]);
    }
     await updateBars(bars,[],null,true);
    return outputArray;
}