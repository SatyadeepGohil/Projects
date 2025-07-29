const editor = document.getElementById('editor');
const preview = document.getElementById('preview');

const sidebar = document.getElementById('sidebar');
const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');

const fileBtn = document.getElementById('file');
const folderBtn = document.getElementById('folder');

let isToggle = false;
let isPreviewVisible = false;

let currentFile = null;
let currentFolder = null;

let fileData;
const localData = localStorage.getItem('notes-data');

if (localData) {
    fileData = JSON.parse(localData);
} else {
    fileData = { mynotes: {} }
    localStorage.setItem('notes-data', JSON.stringify(fileData));
}


editor.addEventListener('input', () => {
    const raw = editor.value;
    preview.innerHTML = marked.parse(raw);
    contentUpdation(raw);
})

function renderSidebar() {
    sidebar.innerHTML = '';

    Object.keys(fileData).forEach(folder => {
        const folderButton = document.createElement('button');
        folderButton.textContent = folder;
        folderButton.onclick = () => {
            currentFolder = folder;
            renderSidebar();
            renderFiles(folder);
        };
        sidebar.appendChild(folderButton);
    });

    const controls = document.createElement('div');
    controls.appendChild(fileBtn);
    controls.appendChild(folderBtn);
    sidebar.appendChild(controls)
}

function renderFiles (folder) {
    const files = fileData[folder];

    Object.keys(files).forEach(file => {
        const fileButton = document.createElement('button');
        fileButton.textContent = file;
        fileButton.addEventListener('click', () => {
            currentFile = file;
            editor.value = fileData[folder][file];
            preview.innerHTML = marked.parse(editor.value);
        });
        sidebar.appendChild(fileButton);
    })
}

function contentUpdation (content) {
    if (!currentFolder || !currentFile) return;
    fileData[currentFolder][currentFile] = content;
    localStorage.setItem('notes-data', JSON.stringify(fileData));
}

folderBtn.addEventListener('click', () => {
    const folderName = prompt('Enter folder name:');
    if (!folderName || fileData[folderName]) return;

    fileData[folderName] = {};
    localStorage.setItem('notes-data', JSON.stringify(fileData));
    renderSidebar();
})

fileBtn.addEventListener('click', () => {
    if (!currentFolder) {
        alert('Select a folder first');
        return;
    }

    const fileName = prompt('Enter file name:');
    if (!fileName || fileData[currentFolder][fileName]) return;

    fileData[currentFolder][fileName] = '';
    localStorage.setItem('notes-data', JSON.stringify(fileData));
    renderSidebar();
})


function toggleSidebar () {
    isToggle = !isToggle;
    if (isToggle) {
        sidebar.style.display = 'block';
        sidebar.style.width = '200px';
    } else {
        sidebar.style.display = 'none';
        sidebar.style.width = '0';
    }
}

function togglePreview () {
    isPreviewVisible = !isPreviewVisible;

    if (isPreveiwVisible) {
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
    }
}


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

window.addEventListener('DOMContentLoaded', () => {
    renderSidebar();
})