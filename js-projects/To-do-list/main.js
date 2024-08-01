let div = document.getElementById('listadder');
let button = document.getElementById('plus');
let ul = document.createElement('ul');

div.appendChild(ul);

button.addEventListener('click', () => {
    let input = document.getElementById('task').value;
    let li = document.createElement('li');
    let remove = document.createElement('button');
    let span = document.createElement('span');

    if (input === '') return;

    remove.innerHTML = '×';

    span.textContent = input;
    li.appendChild(span);
    li.appendChild(remove);
    ul.appendChild(li);

    span.addEventListener('click', () => {
        if (span.style.textDecoration === 'line-through') {
            span.style.textDecoration = 'none'
        }
        else {
            span.style.textDecoration = 'line-through';
        }
    })

    remove.addEventListener('click', () => {
    ul.removeChild(li);
    });

    document.getElementById('task').value = "";
})