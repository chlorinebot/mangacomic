// js/index/background/FooterBackground.js
function enableFooterDarkMode() {
    const footerElement = document.querySelector('footer');
    if (footerElement) {
        footerElement.classList.remove('bg-light', 'bg-body-tertiary');
        footerElement.classList.add('bg-dark');
        footerElement.style.borderTop = '1px solid #343a40';
    }

    const footerTextElement = document.querySelector('footer p');
    if (footerTextElement) {
        footerTextElement.style.color = '#adb5bd';
    }
}

function disableFooterDarkMode() {
    const footerElement = document.querySelector('footer');
    if (footerElement) {
        footerElement.classList.remove('bg-dark');
        footerElement.classList.add('bg-light', 'bg-body-tertiary');
        footerElement.style.borderTop = '';
    }

    const footerTextElement = document.querySelector('footer p');
    if (footerTextElement) {
        footerTextElement.style.color = '';
    }
}