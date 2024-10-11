// DOM Element Selectors
let container = document.getElementById('container');
const search = document.getElementById('search');
const title = document.getElementById('title');
const notesInput = document.getElementById('notes-input');
const closeBtn = document.getElementById('close-btn');
const markedownBtn = document.getElementById('markdown-btn');
const listBtn = document.getElementById('list-btn');
const toggleWrapper = document.querySelector('.toggle-wrapper');
const toggleBtn = document.querySelector('.toggle-wrapper input');

// State Variables
let isPreviewMode = false;
let isList = false;
let draggedCard = null;
let clickedCard = null;
let originalColumnCount = getComputedStyle(container).columnCount;

// Toolbar Button Configurations
const toolbarButtons = [
    { icon: 'bold', command: '**', placeholder: 'bold text' },
    { icon: 'italic', command: '_', placeholder: 'italic text' },
    { icon: 'code', command: '`', placeholder: 'code' },
    { icon: 'list-ordered', command: '1. ', placeholder: 'ordered list item' },
    { icon: 'list-unordered', command: '- ', placeholder: 'list item' },
    { icon: 'link', command: '[]()', placeholder: 'link text' }
];

// Markdown Options
marked.setOptions({
    gfm: true,
    breaks: true,
    sanitize: true,
    headerIds: false,
    mangle: false
});

// Input Resizing and Placeholder Handling
function resizingInput() {
    notesInput.style.height = 'auto';
    notesInput.style.height = notesInput.scrollHeight + 'px';
}

function checkPlaceholder() {
    if (notesInput.textContent.trim() === "") {
        notesInput.classList.add('placeholder');
    } else {
        notesInput.classList.remove('placeholder');
    }
}

checkPlaceholder();

notesInput.addEventListener('focus', checkPlaceholder);
notesInput.addEventListener('blur', checkPlaceholder);

notesInput.addEventListener('input', () => {
    resizingInput();
    checkPlaceholder();
    notesInput.setAttribute('data-text', encodeRawText(notesInput.innerText));

    if (isPreviewMode && toggleBtn.checked) {
        updatePreview();
    }
});

function encodeRawText(rawText) {
    return rawText.replace(/\n/g, '<br>').replace(/ {2}/g, '&nbsp;&nbsp;');
}

function decodeToRawText(encodedHtml) {
    return encodedHtml.replace(/<br>/g, "\n").replace(/&nbsp;/g, '');
}

function updatePreview() {
    const rawText = notesInput.getAttribute('data-text') || notesInput.innerText;
    const parsedHtml = marked.parse(encodeRawText(rawText));

    notesInput.innerHTML = parsedHtml;

    notesInput.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightText(block);
    })
}

function exitPreview() {
    const rawText = notesInput.getAttribute('data-text') || decodeToRawText(notesInput.innerHTML);
    notesInput.innerHTML = rawText;
}
// Markdown and List Button Handlers
listBtn.addEventListener('click', () => {
    listBtn.style.backgroundColor = isList ? 'black' : 'green';
    isList = !isList;
});

markedownBtn.addEventListener('click', () => {
    isPreviewMode = !isPreviewMode;
    if (!isPreviewMode) {
        markedownBtn.style.backgroundColor = 'green';
        markedownBtn.textContent = 'Markdown: Preview';
        toggleWrapper.style.display = 'inline-block';
        if (toggleBtn.checked) {
            updatePreview();
        }
    } else {
        markedownBtn.style.backgroundColor = 'black';
        markedownBtn.textContent = 'Markdown';
        toggleWrapper.style.display = 'none';
        exitPreview();
    }
});

// Toggle Between Markdown and Raw Text
toggleBtn.addEventListener('change', () => {
    if (toggleBtn.checked) {
        updatePreview();
    }
    else {
        exitPreview();
    }
    resizingInput();
});

function insertMarkdown(command, placeholder) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    let insertText;

    if (command === '[]()') {
        insertText = selectedText ? `[${selectedText}]()` : `[${placeholder}](url)`;
    } else {
        insertText = selectedText ? `${command}${selectedText}${command}` : `${command}${placeholder}${command}`;
    }

    const textNode = document.createTextNode(insertText);
    range.deleteContents();
    range.insertNode(textNode);

    if (isPreviewMode && toggleBtn.checked) {
        notesInput.setAttribute('data-text', notesInput.textContent);
    }

    notesInput.focus();
}

// Add New Card Functionality
function addCard() {
    if (notesInput.innerHTML.trim() !== '') {
        const rawContent = isPreviewMode ? notesInput.getAttribute('data-text') : notesInput.innerHTML;

        let cardHTML = `
        <div class="card" draggable="true">
            <h1>${title.value || 'Untitled Note'}</h1>
            <div class='card-content'>${marked.parse(rawContent)}</div>
            <p class='card-date'> Created on ${currentDate()}</p>
        </div>`;
        container.innerHTML += cardHTML;

        const newCard = container.lastElementChild;
        newCard.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightText(block);
        });

        title.value = '';
        notesInput.innerHTML = '';
        notesInput.setAttribute('data-text', '');

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
});

// Drag-and-Drop Functionality
function applyDragDrop() {
    const allcards = document.querySelectorAll('.card');
    allcards.forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragover', handleDragOver);
        card.addEventListener('drop', handleDrop);
        card.addEventListener('dragend', handleDragEnd);
    });
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
        } else {
            container.insertBefore(draggedCard, this.nextSibling);
        }
    }
}

function handleDragEnd(e) {
    this.style.opacity = '1';
    this.style.border = '1px solid white';
}

// Search Functionality
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
        } else {
            card.style.display = 'none';
        }
    });
    updateNoResultsMessage(foundMatch, normalizedSearchTerm);
}, 300);

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
    if (!noResultMessage) {
        noResultMessage = document.createElement('p');
        noResultMessage.id = 'no-results-message';
        container.parentNode.insertBefore(noResultMessage, container.nextSibling);
    }
    if (!foundMatch && searchTerm.length > 0) {
        noResultMessage.style.display = 'block';
        noResultMessage.innerHTML = `
        <div class="no-results">
            <p>No matching notes found</p>
            <small>Try adjusting your search term</small>
        </div>`;
    } else {
        noResultMessage.style.display = 'none';
    }
}

search.addEventListener('input', (e) => searchCards(e.target.value));

// Card Enlargement and Editing Functionality
function applyCardEventListeners() {
    const allcards = document.querySelectorAll('.card');
    allcards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            if (clickedCard && clickedCard !== card) {
                resetCard(clickedCard);
                clickedCard = null;
            }
            if (!clickedCard) {
                enlargeCard(card);
                clickedCard = card;
            }
        });
    });
    document.addEventListener('click', (event) => {
        if (clickedCard && !clickedCard.contains(event.target) && !event.target.hasAttribute('contenteditable')) {
            resetCard(clickedCard);
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
    titleElement.addEventListener('input', (event) => handleEdit(event, dateElement));
    contentElement.addEventListener('input', (event) => handleEdit(event, dateElement));
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
        if (titleElement.textContent.trim() === "" && contentElement.textContent.trim() === '') {
            removeEmptyCard();
        }
    }, 300);
}

// Removing Empty Cards
function removeEmptyCard() {
    const allcards = document.querySelectorAll('.card');
    allcards.forEach(card => {
        const titleElement = card.querySelector('h1');
        const contentElement = card.querySelector('.card-content');
        const isEnlarged = card.getAttribute('data-enlarged') === 'true';
        const isBeingEdited = Array.from(card.querySelectorAll('*')).some(el => el.getAttribute('contenteditable') === 'true');
        if (titleElement.textContent.trim() === '' && contentElement.textContent.trim() === '' && !isEnlarged && !isBeingEdited) {
            card.style.transition = 'opacity 0.3s ease';
            card.style.opacity = '0';
            setTimeout(() => {
                if (card.parentNode) {
                    card.parentNode.removeChild(card);
                }
            }, 300);
        }
    });
}

applyCardEventListeners();
applyDragDrop();
closeBtn.addEventListener('click', addCard);

// Helper Functions
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function currentDate() {
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth();
    let date = d.getDate();
    let hour = d.getHours();
    let minute = String(d.getMinutes()).padStart(2, '0');
    let period = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let currentMonth = monthNames[month];
    return `${date}/${currentMonth}/${year} at ${hour}:${minute} ${period}`;
}
