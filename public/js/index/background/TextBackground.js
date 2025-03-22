// js/index/background/TextBackground.js
function enableTextDarkMode() {
    const textBodySecondary = document.querySelectorAll('.text-body-secondary');
    if (textBodySecondary.length > 0) {
        textBodySecondary.forEach(text => {
            text.style.color = '#6c757d';
        });
    }
}

function disableTextDarkMode() {
    const textBodySecondary = document.querySelectorAll('.text-body-secondary');
    if (textBodySecondary.length > 0) {
        textBodySecondary.forEach(text => {
            text.style.color = '';
        });
    }
}