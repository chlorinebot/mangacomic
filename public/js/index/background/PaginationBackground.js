// js/index/background/PaginationBackground.js
function enablePaginationDarkMode() {
    const paginationElement = document.querySelector('.pagination');
    if (paginationElement) {
        const pageLinks = document.querySelectorAll('.page-link');
        const pageItems = document.querySelectorAll('.page-item');
        pageLinks.forEach(link => {
            link.style.backgroundColor = '#333';
            link.style.color = '#fff';
            link.style.borderColor = '#444';
        });
        pageItems.forEach(item => {
            if (item.classList.contains('active')) {
                const activeLink = item.querySelector('.page-link');
                if (activeLink) {
                    activeLink.style.backgroundColor = '#0d6efd';
                    activeLink.style.borderColor = '#0d6efd';
                    activeLink.style.color = '#fff';
                }
            }
            if (item.classList.contains('disabled')) {
                const disabledLink = item.querySelector('.page-link');
                if (disabledLink) {
                    disabledLink.style.backgroundColor = '#222';
                    disabledLink.style.color = '#666';
                    disabledLink.style.borderColor = '#333';
                }
            }
        });
    }
}

function disablePaginationDarkMode() {
    const paginationElement = document.querySelector('.pagination');
    if (paginationElement) {
        const pageLinks = document.querySelectorAll('.page-link');
        pageLinks.forEach(link => {
            link.style.backgroundColor = '';
            link.style.color = '';
            link.style.borderColor = '';
        });
    }
}