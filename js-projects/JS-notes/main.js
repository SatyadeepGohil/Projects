const editor = document.getElementById('editor');
const preview = document.getElementById('preview');

const sidebar = document.getElementById('sidebar');
const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');

const fileCreateBtn = document.getElementById('file');
const folderCreateBtn = document.getElementById('folder');

let isToggle = false;
let isPreviewVisible = false;

let currentFile = null;
let currentFolder = null;

let intialNote = { file: { name: 'Untitled', content: 'write something'}};

let localData = localStorage.getItem('notes-data');
let fileData;

if (localData) {
    fileData = JSON.parse(localData);
} else {
    fileData = intialNote;
    localStorage.setItem('notes-data', JSON.stringify(fileData));
}


function toggleSidebar () {
    isToggle = !isToggle;
    if (isToggle) {
        sidebar.style.display = 'block';
        sidebar.style.width = '200px';
        fileCreateBtn.style.visibility = 'visible';
        folderCreateBtn.style.visibility = 'visible';
    } else {
        sidebar.style.display = 'none';
        sidebar.style.width = '0';
    }
}

function togglePreview () {
    isPreviewVisible = !isPreviewVisible;

    if (isPreviewVisible) {
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
    }
}

editor.addEventListener('input', () => {
    preview.innerHTML = marked.parse(editor.value);
})


document.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.key === 't' || e.shiftKey && e.key === 'T') {
        e.preventDefault();
        toggleSidebar();
    }

    if (e.shiftKey && e.key === 'c' || e.shiftKey && e.key === 'C') {
        e.preventDefault();
        togglePreview();
    }
})

sidebarToggleBtn.addEventListener('click', () => {
    toggleSidebar();
});