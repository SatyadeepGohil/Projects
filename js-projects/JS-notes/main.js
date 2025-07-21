const sidebar = document.getElementById('sidebar');
const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
let isToggle = false;
let isPreveiwVisible = false;

const editor = document.getElementById('editor');
const preview = document.getElementById('preview');

editor.addEventListener('input', () => {
    const raw = editor.value;
    preview.innerHTML = marked.parse(raw);
})

function togglesidebar () {
    isToggle = !isToggle;
    if (isToggle) {
        sidebar.style.display = 'block';
        sidebar.style.width = '200px';
    } else {
        sidebar.style.display = 'none';
        sidebar.style.width = '0';
    }
}

function togglepreview () {
    isPreveiwVisible = !isPreveiwVisible;

    if (isPreveiwVisible) {
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
    }
}


document.addEventListener('keydown', (e) => {
    if (e.key === 't' || e.key === 'T') {
        togglesidebar();
    }
})

sidebarToggleBtn.addEventListener('click', () => {
    togglesidebar();
})

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'c' || e.ctrlKey && e.key === 'C') {
        togglepreview();
    }
})