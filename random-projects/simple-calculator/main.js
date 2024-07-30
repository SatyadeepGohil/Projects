let buttons = document.querySelectorAll('button');
let screen = document.getElementById('screen');

function handleInput(input) {
        if (input === 'C') {
        screen.textContent = '0';
    } else if (input === '=') {
        try {
            screen.textContent = eval(screen.textContent);
        } catch {
            screen.textContent = 'error';
        }
    } else {
        if (screen.textContent === '0') {
            screen.textContent = input;
        } else {
            screen.textContent += input;
        }
    }
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        handleInput(button.textContent);        
})
})

function findButtonKey(key) {
    let button;
    buttons.forEach(btn => {
        if (btn.textContent === key || (key === '=' && btn.id === 'equals') || (key === 'C' && btn.id === 'clear')) {
            button = btn;
        }
    })
    return button;
}

document.addEventListener('keydown', (event) => {
    let key = event.key;
    if ((key >= '0' && key <= '9') || key === "." || key === '+' || key === '-' || key === '*' || key === '/' || key === 'Enter' || key === 'Backspace' || key === 'Escape') {
        event.preventDefault();

        if (key === 'Enter') {
            key = '=';
        } else if (key === 'Backspace') {
            screen.textContent = screen.textContent.slice(0, -1) || '0';
            return;
        } else if (key === 'Escape') {
            key = 'C';
        }
        
        let button = findButtonKey(key);
        if (button) {
            button.focus();
            button.classList.add('active');
            handleInput(key);

            setTimeout(() => {
                button.classList.remove('active');
            }, 500);
        }
    }
})