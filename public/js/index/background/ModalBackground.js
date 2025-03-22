// js/index/background/ModalBackground.js
function enableModalDarkMode() {
    const modals = document.querySelectorAll('.modal-content');
    const modalHeaders = document.querySelectorAll('.modal-header');
    const modalBodies = document.querySelectorAll('.modal-body');
    const modalFooters = document.querySelectorAll('.modal-footer');
    const modalTitles = document.querySelectorAll('.modal-title');
    const formLabels = document.querySelectorAll('.form-label');
    const formText = document.querySelectorAll('.form-text');
    const formCheckLabel = document.querySelectorAll('.form-check-label');

    if (modals.length > 0) {
        modals.forEach(modal => {
            modal.style.backgroundColor = '#212529';
            modal.style.color = '#fff';
            modal.style.borderColor = '#343a40';
        });
    }

    if (modalHeaders.length > 0) {
        modalHeaders.forEach(header => {
            header.style.backgroundColor = '#343a40';
            header.style.borderBottom = '1px solid #495057';
        });
    }

    if (modalBodies.length > 0) {
        modalBodies.forEach(body => {
            body.style.backgroundColor = '#212529';
            body.style.color = '#fff';
        });
    }

    if (modalFooters.length > 0) {
        modalFooters.forEach(footer => {
            footer.style.backgroundColor = '#343a40';
            footer.style.borderTop = '1px solid #495057';
        });
    }

    if (modalTitles.length > 0) {
        modalTitles.forEach(title => {
            title.style.color = '#fff';
        });
    }

    if (formLabels.length > 0) {
        formLabels.forEach(label => {
            label.style.color = '#e9ecef';
        });
    }

    if (formText.length > 0) {
        formText.forEach(text => {
            text.style.color = '#adb5bd';
        });
    }

    if (formCheckLabel.length > 0) {
        formCheckLabel.forEach(label => {
            label.style.color = '#e9ecef';
        });
    }

    // Xử lý inputs trong modal
    const inputs = document.querySelectorAll('.modal .form-control');
    if (inputs.length > 0) {
        inputs.forEach(input => {
            input.style.backgroundColor = '#2b3035';
            input.style.borderColor = '#495057';
            input.style.color = '#fff';
        });
    }
}

function disableModalDarkMode() {
    const modals = document.querySelectorAll('.modal-content');
    const modalHeaders = document.querySelectorAll('.modal-header');
    const modalBodies = document.querySelectorAll('.modal-body');
    const modalFooters = document.querySelectorAll('.modal-footer');
    const modalTitles = document.querySelectorAll('.modal-title');
    const formLabels = document.querySelectorAll('.form-label');
    const formText = document.querySelectorAll('.form-text');
    const formCheckLabel = document.querySelectorAll('.form-check-label');

    if (modals.length > 0) {
        modals.forEach(modal => {
            modal.style.backgroundColor = '';
            modal.style.color = '';
            modal.style.borderColor = '';
        });
    }

    if (modalHeaders.length > 0) {
        modalHeaders.forEach(header => {
            header.style.backgroundColor = '';
            header.style.borderBottom = '';
        });
    }

    if (modalBodies.length > 0) {
        modalBodies.forEach(body => {
            body.style.backgroundColor = '';
            body.style.color = '';
        });
    }

    if (modalFooters.length > 0) {
        modalFooters.forEach(footer => {
            footer.style.backgroundColor = '';
            footer.style.borderTop = '';
        });
    }

    if (modalTitles.length > 0) {
        modalTitles.forEach(title => {
            title.style.color = '';
        });
    }

    if (formLabels.length > 0) {
        formLabels.forEach(label => {
            label.style.color = '';
        });
    }

    if (formText.length > 0) {
        formText.forEach(text => {
            text.style.color = '';
        });
    }

    if (formCheckLabel.length > 0) {
        formCheckLabel.forEach(label => {
            label.style.color = '';
        });
    }

    // Xử lý inputs trong modal
    const inputs = document.querySelectorAll('.modal .form-control');
    if (inputs.length > 0) {
        inputs.forEach(input => {
            input.style.backgroundColor = '';
            input.style.borderColor = '';
            input.style.color = '';
        });
    }
}