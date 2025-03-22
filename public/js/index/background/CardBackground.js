// js/index/background/CardBackground.js
function enableCardDarkMode() {
    const cardElements = document.querySelectorAll('.card');
    const cardBodies = document.querySelectorAll('.card-body');
    const cardTitles = document.querySelectorAll('.card-title');
    const cardTexts = document.querySelectorAll('.card-text');

    cardElements.forEach(card => {
        card.style.backgroundColor = '#212529';
        card.style.borderColor = '#343a40';
        card.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        card.style.color = '#fff';
    });

    cardBodies.forEach(cardBody => {
        cardBody.style.backgroundColor = '#212529';
        cardBody.style.color = '#fff';
    });

    cardTitles.forEach(title => {
        title.style.color = '#fff';
    });

    cardTexts.forEach(text => {
        text.style.color = '#adb5bd';
    });
}

function disableCardDarkMode() {
    const cardElements = document.querySelectorAll('.card');
    const cardBodies = document.querySelectorAll('.card-body');
    const cardTitles = document.querySelectorAll('.card-title');
    const cardTexts = document.querySelectorAll('.card-text');

    cardElements.forEach(card => {
        card.style.backgroundColor = '#fff';
        card.style.borderColor = '#dee2e6';
        card.style.boxShadow = '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)';
        card.style.color = '#212529';
    });

    cardBodies.forEach(cardBody => {
        cardBody.style.backgroundColor = '#fff';
        cardBody.style.color = '#212529';
    });

    cardTitles.forEach(title => {
        title.style.color = '#212529';
    });

    cardTexts.forEach(text => {
        text.style.color = '#6c757d';
    });
}