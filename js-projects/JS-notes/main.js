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


let root = {
        id: generateUniqueId(),
        type: 'folder',
        name: 'Root',
        children: {
            file1: {
                id: generateUniqueId(),
                type: 'file',
                name: 'Untiltled',
                content: 'write something...',
                lastModified: 'some time'
            },
            folder1: {
                id: generateUniqueId(),
                type: 'folder',
                name: 'My folder',
                children: {
                    file2: {
                        id: generateUniqueId(),
                        type: 'file',
                        name: 'Notes',
                        content: 'some content',
                    }
                }
            }
        }
};

let localData = localStorage.getItem('notes-data');
let fileData;

if (localData) {
    fileData = JSON.parse(localData);
} else {
    fileData = root;
    saveToLocalStorage();
}

function saveToLocalStorage () {
    localStorage.setItem('notes-data', JSON.stringify(fileData));
}

function generateUniqueId () {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function renderSidebar (container, folderObj,  level = 0) {
    container.innerHTML = '';

    if (!folderObj.children) return;
    
    Object.values(folderObj.children).forEach(item => {
        let row = document.createElement('div');
        row.classList.add(item.type, `level-${level}`);
        row.dataset.id = item.id;

        if (item.type === 'file') {
            row.textContent = item.name;
            row.addEventListener('click', () => openFile(item.id));
        } else if (item.type === 'folder') {
            let arrow = document.createElement('span');
            arrow.textContent = '>';
            arrow.classList.add('arrow');

            let name = document.createElement('span');
            name.textContent = item.name;

            row.appendChild(arrow);
            row.appendChild(name);

            let subContainer = document.createElement('div');
            subContainer.classList.add('subfolder');
            subContainer.style.display = 'none';

            renderSidebar(subContainer, item, level + 1);

            row.addEventListener('click', (e) => {
                e.stopPropagation();
                let isHidden = subContainer.style.display === 'none';
                subContainer.style.display = isHidden ? 'block' : 'none';
                arrow.classList.toggle('open', isHidden);
            });

            container.appendChild(row);
            container.appendChild(subContainer);
            return;
        }
        container.appendChild(row);
    })
}

fileCreateBtn.addEventListener('click', () => {
    let id = generateUniqueId();
    fileData.children[id] = {
        id,
        type: 'file',
        name: 'Untitled.md',
        content: ''
    };
    saveToLocalStorage();
    renderSidebar(sidebar, fileData);
})

folderCreateBtn.addEventListener('click', () => {
    let id = generateUniqueId();
    fileData.children[id] = {
        id,
        type: 'folder',
        name: 'New Folder',
        children: {}
    };
    saveToLocalStorage();
    renderSidebar(sidebar, fileData);
});

function openFile (fileId) {
    let file = findById(fileData, fileId);
    if (file && file.type === 'file') {
        currentFile = fileId;
        editor.value = file.content;
    }
}

function findById (folder, id) {
    if (folder.id === id) {
        return folder;
    }

    for (let child of Object.values(folder.children || {})) {
        let result = findById(child, id);
        if (result) return result;
    }
    return null;
}

function deleteItem(id, parentFolder = fileData) {
    for (let key in parentFolder.children) {
        if (parentFolder.children[key].id === id) {
            delete parentFolder.children[key];
            saveToLocalStorage();
            return true;
        }
        if (parentFolder.children[key].type === 'folder') {
            if (deleteItem(id, parentFolder.children[key])) return true;
        }
    }
    return false;
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
    if (currentFile) {
        let file = findById(fileData, currentFile);
        if (file) {
            file.content = editor.value;
            saveToLocalStorage();
            preview.innerHTML = marked.parse(file.content);
        }
    }
})
document.addEventListener('DOMContentLoaded', () => {
    renderSidebar(sidebar, fileData);
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