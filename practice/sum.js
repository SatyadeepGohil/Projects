/* const array = [[1,2],[3,4],[5,6]];

function flatenArray(arr) {
    let res = [];
    for (let i = 0; i < arr.length; i++){
        for (let j = 0; j < arr[i].length; j++) {
            res.push(arr[i][j]);
        }
    }
    return res;
}

console.log(flatenArray(array), array.flat()) */

let string = '1';
let number = 1;
let res;

function fn (s, n) {
    if (s === n) {
        return res = true;
    } else {
        return res = false;
    }
}

console.log(fn(string, number));