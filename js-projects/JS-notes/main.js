const sidebar = document.getElementById('sidebar');
const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
let istoggle = false;

function togglesidebar () {
    istoggle = !istoggle;
    if (istoggle) {
        sidebar.style.display = 'block';
        sidebar.style.width = '200px';
    } else {
        sidebar.style.display = 'none';
        sidebar.style.width = '0';
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