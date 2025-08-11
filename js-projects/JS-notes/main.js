const STORAGE_KEY = 'notes-data-v1';
const EXP_KEY = 'notes-expanded-v1';

const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const sidebar = document.getElementById('treeRoot');
const fileCreateBtn = document.getElementById('file');
const folderCreateBtn = document.getElementById('folder');
const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
const previewToggleBtn = document.getElementById('preview-toggle');
const darkModeToggleBtn = document.getElementById('dark-mode-toggle');
const collapseAllBtn = document.getElementById('collapseAll');
const currentPathEl = document.getElementById('currentPath');

let isSidebarVisible = true;
let isPreviewVisible = false;

// Track selected items by ID (consistent ID-based approach)
let currentFileId = null;     // id of currently opened file
let currentFolderId = 'root'; // where new files/folders will be created by default

// Example starter structure
const starter = {
    id: 'root', type: 'folder', name: 'Root', children: {
        f1: { id: 'f1', type: 'file', name: 'index.md', content: '# Welcome\nThis is index' },
        d1: {
            id: 'd1', type: 'folder', name: 'Notes', children: {
                f2: { id: 'f2', type: 'file', name: 'todo.md', content: '- buy milk' }
            }
        }
    }
};

let fileData = null;
let expandedIds = new Set();

function load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    fileData = raw ? JSON.parse(raw) : starter;
    const exp = localStorage.getItem(EXP_KEY);
    expandedIds = exp ? new Set(JSON.parse(exp)) : new Set();
}

function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fileData));
    localStorage.setItem(EXP_KEY, JSON.stringify(Array.from(expandedIds)));
}

function generateId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8) }

// ---------- Helpers: traversal by ID ----------
function findById(node, id) {
    if (!node) return null;
    if (node.id === id) return node;
    if (node.type === 'folder') {
        for (const child of Object.values(node.children || {})) {
            const res = findById(child, id);
            if (res) return res;
        }
    }
    return null;
}

function findParent(node, id) {
    if (node.type !== 'folder') return null;
    for (const key of Object.keys(node.children || {})) {
        const child = node.children[key];
        if (child.id === id) return node;
        if (child.type === 'folder') {
            const res = findParent(child, id);
            if (res) return res;
        }
    }
    return null;
}

// ---------- Rendering (ID-based) ----------
function renderTree(container, folder) {
    container.innerHTML = '';
    const ul = document.createElement('ul');
    for (const key of Object.keys(folder.children || {})) {
        const item = folder.children[key];
        const li = document.createElement('li');
        li.className = 'item ' + (item.type);
        li.dataset.id = item.id;

        if (item.type === 'folder') {
            const caret = document.createElement('span');
            caret.className = 'caret';
            caret.textContent = expandedIds.has(item.id) ? '▼' : '▶';
            caret.addEventListener('click', (e) => {
                e.stopPropagation();
                if (expandedIds.has(item.id)) expandedIds.delete(item.id);
                else expandedIds.add(item.id);
                save();
                renderAll();
            });
            li.appendChild(caret);

            const name = document.createElement('span');
            name.className = 'item-name';
            name.textContent = item.name;
            name.addEventListener('click', (e) => {
                e.stopPropagation();
                // selecting folder -> set currentFolderId where new items go
                currentFolderId = item.id;
                highlightSelection(item.id);
                updateCurrentPath(item.id);
            });
            li.appendChild(name);

            // menu
            attachHoverMenu(li, item);

            // children
            const childrenWrap = document.createElement('div');
            childrenWrap.style.paddingLeft = '14px';
            if (!expandedIds.has(item.id)) childrenWrap.classList.add('hidden');
            else childrenWrap.classList.remove('hidden');
            const subtree = renderTreeFragment(item);
            childrenWrap.appendChild(subtree);
            li.appendChild(childrenWrap);

        } else {
            // file
            const spacer = document.createElement('span');
            spacer.style.width = '16px';
            li.appendChild(spacer);

            const name = document.createElement('span');
            name.className = 'item-name';
            name.textContent = item.name;
            name.addEventListener('click', () => {
                openFile(item.id);
            });
            li.appendChild(name);

            attachHoverMenu(li, item);
        }
        ul.appendChild(li);
    }
    return ul;
}

// helper to create subtree without wiping parents' listeners
function renderTreeFragment(folder) {
    return renderTree(document.createElement('div'), folder);
}

function renderAll() {
    const rootEl = document.getElementById('treeRoot');
    rootEl.innerHTML = '';
    const rootTitle = document.createElement('div');
    rootTitle.textContent = fileData.name;
    rootTitle.style.fontWeight = '600';
    rootTitle.style.marginBottom = '8px';
    rootEl.appendChild(rootTitle);
    const tree = renderTreeFragment(fileData);
    rootEl.appendChild(tree);
    // reflect selection highlight
    highlightSelection(currentFileId || currentFolderId);
}

function highlightSelection(id) {
    // clear
    document.querySelectorAll('.item').forEach(el => el.classList.remove('selected'));
    if (!id) return;
    const el = document.querySelector(`.item[data-id='${id}']`);
    if (el) el.classList.add('selected');
}

function updateCurrentPath(id) {
    if (!id) { currentPathEl.textContent = '/'; return; }
    const parts = [];
    let node = findById(fileData, id);
    while (node && node.id !== 'root') {
        parts.unshift(node.name);
        node = findParent(fileData, node.id);
    }
    currentPathEl.textContent = '/' + parts.join('/') || '/';
}

// ---------- File / Folder operations ----------
function createFile(name = 'Untitled.md', folderId = null, content = '') {
    const folder = findById(fileData, folderId || currentFolderId) || fileData;
    const id = generateId();
    folder.children[id] = { id, type: 'file', name, content };
    // ensure parent expanded
    expandedIds.add(folder.id);
    save(); renderAll();
    openFile(id);
}

function createFolder(name = 'New Folder', parentId = null) {
    const parent = findById(fileData, parentId || currentFolderId) || fileData;
    const id = generateId();
    parent.children[id] = { id, type: 'folder', name, children: {} };
    expandedIds.add(parent.id);
    save(); renderAll();
}

function openFile(id) {
    const file = findById(fileData, id);
    if (!file || file.type !== 'file') return;
    currentFileId = id;
    // ensure its parents expanded so user sees it
    let p = findParent(fileData, id);
    while (p) { expandedIds.add(p.id); p = findParent(fileData, p.id); }
    editor.value = file.content || '';
    preview.innerHTML = marked.parse(file.content || '');
    updateCurrentPath(id);
    highlightSelection(id);
    save(); renderAll();
}

function updateFileContent(id, newContent) {
    const file = findById(fileData, id);
    if (file && file.type === 'file') {
        file.content = newContent;
        preview.innerHTML = marked.parse(newContent);
        save();
    }
}

function renameItem(id, newName) {
    const node = findById(fileData, id);
    if (node) { node.name = newName; save(); renderAll(); }
}

function deleteItem(id) {
    if (id === 'root') return;
    const parent = findParent(fileData, id);
    if (!parent) return;
    // remove key by matching child id
    for (const key of Object.keys(parent.children)) {
        if (parent.children[key].id === id) {
            delete parent.children[key];
            // if deleting current open file, clear editor
            if (currentFileId === id) { currentFileId = null; editor.value = ''; preview.innerHTML = ''; updateCurrentPath(null); }
            save(); renderAll();
            return;
        }
    }
}

// ---------- Modal (rename / delete) ----------
const optionsModal = document.getElementById('optionsModal');
const modalOverlay = document.getElementById('modalOverlay');
const renameInput = document.getElementById('renameInput');
const renameBtn = document.getElementById('renameBtn');
const deleteBtn = document.getElementById('deleteBtn');
const cancelBtn = document.getElementById('cancelBtn');
let modalTargetId = null;

function openOptionsModal(id) {
    modalTargetId = id;
    const node = findById(fileData, id);
    if (!node) return;
    renameInput.value = node.name;
    optionsModal.style.display = 'block'; modalOverlay.style.display = 'block';
}
function closeModal() { optionsModal.style.display = 'none'; modalOverlay.style.display = 'none'; modalTargetId = null }

renameBtn.addEventListener('click', () => { if (modalTargetId) { renameItem(modalTargetId, renameInput.value.trim() || 'Untitled'); closeModal(); } });
deleteBtn.addEventListener('click', () => { if (modalTargetId) { deleteItem(modalTargetId); closeModal(); } });
cancelBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

// attach hover menu called during render
function attachHoverMenu(li, item) {
    const menu = document.createElement('span');
    menu.className = 'item-menu';
    menu.innerHTML = '⋮';
    menu.title = 'Options';
    menu.addEventListener('click', (e) => {
        e.stopPropagation();
        openOptionsModal(item.id);
    });
    li.appendChild(menu);
}

// ---------- Events ----------
fileCreateBtn.addEventListener('click', () => createFile());
folderCreateBtn.addEventListener('click', () => createFolder());

collapseAllBtn.addEventListener('click', () => { expandedIds.clear(); save(); renderAll(); });

editor.addEventListener('input', () => {
    if (!currentFileId) return; // nothing to save
    updateFileContent(currentFileId, editor.value);
});

// keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.shiftKey && (e.key === 'T' || e.key === 't')) { e.preventDefault(); toggleSidebar(); }
    if (e.shiftKey && (e.key === 'C' || e.key === 'c')) { e.preventDefault(); togglePreview(); }
    if (e.ctrlKey && e.key === 's') { e.preventDefault(); save(); }
});

sidebarToggleBtn.addEventListener('click', toggleSidebar);
previewToggleBtn.addEventListener('click', togglePreview);

function toggleSidebar() {
    isSidebarVisible = !isSidebarVisible;
    document.getElementById('sidebar').style.display = isSidebarVisible ? 'block' : 'none';
}
function togglePreview() {
    isPreviewVisible = !isPreviewVisible;
    if (isPreviewVisible) preview.classList.remove('hidden');
    else preview.classList.add('hidden');
}

function applyDarkModePreference() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', isDark);
}

darkModeToggleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDark);
});

applyDarkModePreference();

// ---------- Init ----------
load(); renderAll();
// make sure root is expanded by default
expandedIds.add('root'); save(); renderAll();