const search = document.getElementById('search');
const title = document.getElementById('title');
const notesInput = document.getElementById('notes-input');
const inputHeight = window.getComputedStyle(notesInput).height;
const closeBtn = document.getElementById('close-btn');
let container = document.getElementById('container');
let draggedCard = null;

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

notesInput.addEventListener('input', resizingInput)

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
    if (notesInput.value.trim() !== '') {
        let cardHTML = `
    <div class="card" draggable="true">
        <h1>${title.value}</h1>
    <p>${notesInput.value}</p>
    <p> Created on ${currentDate()}</p>
    </div>`;

        container.innerHTML += cardHTML;

        title.value = '';
        notesInput.value = '';
        notesInput.style.height = inputHeight;

        applyCardEventListeners();
        applyDragDrop();
    }
}

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

notesInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            addCard();
        }
    })

const searchCards = debounce((searchTerm) => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const allcards = document.querySelectorAll('.card');
    let foundMatch = false;


    allcards.forEach(card => {
        const titleElement = card.querySelector('h1');
        const contentElement = card.querySelector('p');
        const dateElement = card.querySelector('p:last-child');

        if (!titleElement.hasAttribute('data-original')) {
            titleElement.setAttribute('data-original', titleElement.textContent);
            contentElement.setAttribute('data-original', contentElement.textContent);
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


let clickedCard = null;
let originalColumnCount = getComputedStyle(container).columnCount;

function applyCardEventListeners() {
    const allcards = document.querySelectorAll('.card');

    for(let card of allcards) {
        card.addEventListener('click', (e) => {
            e.stopPropagation();

            if (clickedCard && clickedCard !== card) {
                resetCard(clickedCard);
                clickedCard = null;
            }

            if(!clickedCard) {
            enlargeCard(card);
            clickedCard = card;
            }
        })
    }

    document.addEventListener('click', () => {
                    if (clickedCard && !clickedCard.contains(event.target) && !event.target.hasAttribute('contenteditable')) {
                    resetCard(clickedCard);
                    clickedCard = null;
                }
            });
}

function enlargeCard(card) {
    const randomColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;

    const titleElement = card.querySelector('h1');
    const contentElement = card.querySelector('p');
    const dateElement = card.querySelector('p:last-child');

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
}

function handleEdit(event, dateElement) {
    const element = event.target;
    const originalContent = element.getAttribute('data-original');
    const currentContent = element.textContent;

    if (currentContent !== originalContent) {
        element.setAttribute('data-original', currentContent);
        dateElement.textContent = `Edited on ${currentDate()}`;

        removeEmptyCard();
    }
}

function resetCard(card) {
    const titleElement = card.querySelector('h1');
    const contentElement = card.querySelector('p');
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
    }, 300);
}

function removeEmptyCard() {
const allcards = document.querySelectorAll('.card');

    allcards.forEach(card => {
        const titleElement = card.querySelector('h1');
        const contentElement = card.querySelector('p:nth-of-type(1)');
        if(titleElement.textContent.trim() === '' && contentElement.textContent.trim() === '') {
            container.removeChild(card);
        }
    })
}

applyCardEventListeners();
applyDragDrop();
removeEmptyCard();

closeBtn.addEventListener('click', addCard);