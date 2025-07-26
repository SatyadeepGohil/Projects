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
    isPreveiwVisible = !isPreveiwVisible;

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
})