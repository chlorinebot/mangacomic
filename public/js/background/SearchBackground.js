// js/index/background/SearchBackground.js
function enableSearchDarkMode() {
    const searchBox = document.querySelector('.form-control');
    if (searchBox) {
        searchBox.style.backgroundColor = '#2b3035';
        searchBox.style.borderColor = '#495057';
        searchBox.style.color = '#fff';
    }
}

function disableSearchDarkMode() {
    const searchBox = document.querySelector('.form-control');
    if (searchBox) {
        searchBox.style.backgroundColor = '';
        searchBox.style.borderColor = '';
        searchBox.style.color = '';
    }
}