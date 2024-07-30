document.addEventListener('DOMContentLoaded', function () {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const li = this.closest('li');
            const answer = li.querySelector('.answer');
            
            // Toggle the active class for the clicked item
            answer.classList.toggle('active');
            btn.classList.toggle('active');
            
            // Close other answers
            toggleBtns.forEach(otherBtn => {
                if (otherBtn !== btn) {
                    const otherLi = otherBtn.closest('li');
                    otherLi.querySelector('.answer').classList.remove('active');
                    otherBtn.classList.remove('active');
                }
            });
        });
    });
});
