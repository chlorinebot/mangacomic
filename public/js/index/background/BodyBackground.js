// js/index/background/BodyBackground.js
function enableBodyDarkMode() {
    const bodyElement = document.body;
    const labelElement = document.querySelector('label[for="flexSwitchCheckDefault"]');

    // Body
    bodyElement.classList.add('p-3', 'mb-2', 'bg-black', 'text-white');
    labelElement.textContent = 'Chế độ nền sáng';
    labelElement.style.color = 'white';

    // Header
    const headerElement = document.querySelector('h1');
    if (headerElement) {
        headerElement.style.backgroundColor = '#000';
        headerElement.style.color = '#fff';
        headerElement.style.padding = '15px';
        headerElement.style.borderRadius = '5px';
        headerElement.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.2)';
    }
}

function disableBodyDarkMode() {
    const bodyElement = document.body;
    const labelElement = document.querySelector('label[for="flexSwitchCheckDefault"]');

    // Body
    bodyElement.classList.remove('p-3', 'mb-2', 'bg-black', 'text-white');
    labelElement.textContent = 'Chế độ đêm tối';
    labelElement.style.color = '';

    // Header
    const headerElement = document.querySelector('h1');
    if (headerElement) {
        headerElement.style.backgroundColor = '';
        headerElement.style.color = '';
        headerElement.style.padding = '';
        headerElement.style.borderRadius = '';
        headerElement.style.boxShadow = '';
    }
}