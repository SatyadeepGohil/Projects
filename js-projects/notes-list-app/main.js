const search = document.getElementById('search');
let container = document.getElementById('container');
const title = document.getElementById('title');
const notesInput = document.getElementById('notes-input');
const inputHeight = window.getComputedStyle(notesInput).height;
const closeBtn = document.getElementById('close-btn');
const markedownBtn = document.getElementById('markdown-btn');
const listBtn = document.getElementById('list-btn');
const toggleWrapper = document.querySelector('.toggle-wrapper');
const toggleBtn = document.querySelector('.toggle-wrapper input');
let isPreviewMode = false;
let isList = false;
let draggedCard = null;
let clickedCard = null;
let originalColumnCount = getComputedStyle(container).columnCount;

marked.setOptions({
    gfm: true,
    breaks: true,
    sanitize: true,
})

function resizingInput() {
    notesInput.style.height = 'auto';
    notesInput.style.height = notesInput.scrollHeight + 'px';
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    }
}

function checkPlaceholder() {
    if (notesInput.textContent.trim() === "") {
        notesInput.classList.add('placeholder');
    } else {
        notesInput.classList.remove('placeholder');
    }
}

checkPlaceholder();

notesInput.addEventListener('input', () => {
    resizingInput();
    checkPlaceholder();
})

notesInput.addEventListener('focus', checkPlaceholder);
notesInput.addEventListener('blur', checkPlaceholder);

listBtn.addEventListener('click', () => {
    if (!isList) {
        listBtn.style.backgroundColor = 'green';
    }
    else {
        listBtn.style.backgroundColor = 'black';
    }

    isList = !isList;
})

markedownBtn.addEventListener('click', () => {
    if (!isPreviewMode) {
        markedownBtn.style.backgroundColor = 'green';
        markedownBtn.textContent = 'Markdown: Preview';
        toggleWrapper.style.display = 'inline-block';
        notesInput.setAttribute('data-text', `${notesInput.innerHTML}`);
    }
    else {
        markedownBtn.style.backgroundColor = 'black';
        markedownBtn.textContent = 'Markdown';
        toggleWrapper.style.display = 'none';
    }

    isPreviewMode = !isPreviewMode;
})

toggleBtn.addEventListener('change', () => {
    if (toggleBtn.checked) {
        notesInput.innerHTML = marked.parse(notesInput.getAttribute('data-text'));
    }
    else {
        notesInput.innerHTML = notesInput.getAttribute('data-text');
    }
    resizingInput();
})


function currentDate() {
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth();
    let date = d.getDate();
    let hour = d.getHours();
    let minute = String(d.getMinutes()).padStart(2, '0');

    let period = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;

    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    let currentMonth = monthNames[month];

    let time = `${date}/${currentMonth}/${year} at ${hour}:${minute} ${period}`;
    return time;
}

function addCard() {
    if (notesInput.innerHTML.trim() !== '') {
    
    let cardHTML = `
    <div class="card" draggable="true">
        <h1>${title.value}</h1>
    <div class='card-content'>${marked.parse(notesInput.innerHTML)}</div>
    <p class='card-date'> Created on ${currentDate()}</p>
    </div>`;

        container.innerHTML += cardHTML;

        title.value = '';
        notesInput.innerHTML = '';

        resizingInput();
        applyCardEventListeners();
        applyDragDrop();
    }
}

notesInput.addEventListener('keydown', e => {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            addCard();
        }
    })

function applyDragDrop() {
    const allcards = document.querySelectorAll('.card');

    allcards.forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragover', handleDragOver);
        card.addEventListener('drop', handleDrop);
        card.addEventListener('dragend', handleDragEnd);
    })
}

function handleDragStart(e) {
    draggedCard = this;
    this.style.opacity = 0.5;
}

function handleDragOver(e) {
    e.preventDefault();
    this.style.border = '2px solid green';
}

function handleDrop(e) {
    e.preventDefault();
    this.style.border = '';

    if (this !== draggedCard) {
        const allcards = Array.from(container.children);
        const draggedIndex = allcards.indexOf(draggedCard);
        const droppedIndex = allcards.indexOf(this);

        if (draggedIndex > droppedIndex) {
            container.insertBefore(draggedCard, this);
        }
        else {
            container.insertBefore(draggedCard, this.nextSibling);
        }
    }
}

function handleDragEnd(e) {
    this.style.opacity = '1';
    this.style.border = '1px solid white';
}

const searchCards = debounce((searchTerm) => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const allcards = document.querySelectorAll('.card');
    let foundMatch = false;


    allcards.forEach(card => {
        const titleElement = card.querySelector('h1');
        const contentElement = card.querySelector('.card-content');
        const dateElement = card.querySelector('.card-date');

        if (!titleElement.hasAttribute('data-original')) {
            titleElement.setAttribute('data-original', titleElement.innerHTML);
            contentElement.setAttribute('data-original', contentElement.innerHTML);
        }

        const originalTitle = titleElement.getAttribute('data-original');
        const originalContent = contentElement.getAttribute('data-original');

        if (normalizedSearchTerm.length === 0 ||
            originalTitle.toLowerCase().includes(normalizedSearchTerm) || 
            originalContent.toLowerCase().includes(normalizedSearchTerm)) {

            titleElement.innerHTML = highlightText(originalTitle, normalizedSearchTerm);
            contentElement.innerHTML = highlightText(originalContent, normalizedSearchTerm);

            card.style.display = 'block';
            foundMatch = true;
        }
        else {
            card.style.display = 'none';
        }
    });

    updateNoResultsMessage(foundMatch, normalizedSearchTerm);
}, 300)

function highlightText(text, searchTerm) {
    if (!searchTerm) return text;
    const escapeSearchTerm = escapeRegex(searchTerm);
    const regex = new RegExp(`(${escapeSearchTerm})`, 'gi');
    return text.replace(regex, '<mark class="highlight">$1</mark>');
}

function escapeRegex(string) {
        return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

function updateNoResultsMessage(foundMatch, searchTerm) {
   let noResultMessage = document.getElementById('no-results-message');

    if(!noResultMessage) {
        noResultMessage = document.createElement('p');
        noResultMessage.id = 'no-results-message';
        container.parentNode.insertBefore(noResultMessage, container.nextSibling);
    }

    if(!foundMatch && searchTerm.length > 0) {
        noResultMessage.style.display = 'block';
        let noResultMessageHTML = `
        <div class="no-results">
                <p>No matching notes found</p>
                <small>Try adjusting your search term</small>
            </div>`;
        noResultMessage.innerHTML = noResultMessageHTML;
    } else {
        noResultMessage.style.display = 'none';
    }
}

search.addEventListener('input', (e) => searchCards(e.target.value));

function applyCardEventListeners() {
    const allcards = document.querySelectorAll('.card');

    for(let card of allcards) {
        card.addEventListener('click', (e) => {
            e.stopPropagation();

            if (clickedCard && clickedCard !== card) {
                resetCard(clickedCard);
                clickedCard = null;
                card.setAttribute('data-enlarged', 'false');
            }

            if(!clickedCard) {
                enlargeCard(card);
                clickedCard = card;
                card.setAttribute('data-enlarged', 'true');
            }
        })
    }

    document.addEventListener('click', () => {
                    if (clickedCard && !clickedCard.contains(event.target) && !event.target.hasAttribute('contenteditable')) {
                    resetCard(clickedCard);
                    clickedCard.setAttribute('data-enlarged', 'false')
                    clickedCard = null;
                }
            });
}

function enlargeCard(card) {
    const randomColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;

    const titleElement = card.querySelector('h1');
    const contentElement = card.querySelector('.card-content');
    const dateElement = card.querySelector('.card-date');

    const rect = card.getBoundingClientRect();
    card.setAttribute('data-original-top', rect.top + window.scrollY + 'px');
    card.setAttribute('data-original-left', rect.left + 'px');
        
    if (!titleElement.hasAttribute('data-original')) {
        titleElement.setAttribute('data-original', titleElement.textContent);
        contentElement.setAttribute('data-original', contentElement.textContent);
    }

    card.setAttribute('data-original-styles', card.getAttribute('style') || '');

    card.style.backgroundColor = randomColor;

    Object.assign(card.style, {
        backgroundColor: randomColor,
        position: 'fixed',
        top: '50%',
        left: '50%',
        width: '50%',
        margin: '0 auto',
        transform: 'translate(-50%, -50%) scale(1.5)',
        zIndex: '10',
        overflow: 'auto'
    });

    titleElement.setAttribute('contenteditable', 'true');
    contentElement.setAttribute('contenteditable', 'true');

    titleElement.addEventListener('input', (event) => handleEdit(event,dateElement));
    contentElement.addEventListener('input', (event) => handleEdit(event,dateElement));

    card.setAttribute('data-enlarged', 'true');
}

function handleEdit(event, dateElement) {
    const element = event.target;
    const originalContent = element.getAttribute('data-original');
    const currentContent = element.textContent;

    if (currentContent !== originalContent) {
        element.setAttribute('data-original', currentContent);
        dateElement.textContent = `Edited on ${currentDate()}`;
    }
}

function resetCard(card) {
    const titleElement = card.querySelector('h1');
    const contentElement = card.querySelector('.card-content');
    const originalTop = card.getAttribute('data-original-top');
    const originalLeft = card.getAttribute('data-original-left');

    Object.assign(card.style, {
        position: 'fixed',
        top: originalTop,
        left: originalLeft,
        transform: 'none',
        transition: 'all 0.3s ease',
    });
    
    card.scrollTop = 0;

    setTimeout(() => {
        card.setAttribute('style', card.getAttribute('data-original-styles') || '');
        titleElement.setAttribute('contenteditable', 'false');
        contentElement.setAttribute('contenteditable', 'false');
        card.setAttribute('data-enlarged', 'false');

        if (titleElement.textContent.trim() === "" && contentElement.textContent.trim() === '') {
            removeEmptyCard();
        }
    }, 300);
}

function removeEmptyCard() {
const allcards = document.querySelectorAll('.card');

        allcards.forEach(card => {
        const titleElement = card.querySelector('h1');
        const contentElement = card.querySelector('.card-content');

        const isEnlarged = card.getAttribute('data-enlarged') === 'true';
        const isBeingEdited = Array.from(card.querySelectorAll('*')).some(el => 
            el.getAttribute('contenteditable') === 'true');
        if(titleElement.textContent.trim() === '' &&
            contentElement.textContent.trim() === '' &&
            !isEnlarged && !isBeingEdited) {
            card.style.transition = 'opacity 0.3s ease';
            card.style.opacity = '0'
            
            setTimeout(() => {
                if (card.parentNode) {
                    card.parentNode.removeChild(card);
                }
            }, 300);
        }
    })
}

applyCardEventListeners();
applyDragDrop();

closeBtn.addEventListener('click', addCard);