// js/index/background/OffcanvasBackground.js
function enableOffcanvasDarkMode() {
    const offcanvasElements = document.querySelectorAll('.offcanvas');
    if (offcanvasElements.length > 0) {
        offcanvasElements.forEach(offcanvas => {
            offcanvas.style.backgroundColor = '#212529';
            offcanvas.style.color = '#fff';
            offcanvas.style.borderLeft = '1px solid #343a40';
        });
    }

    const offcanvasHeaders = document.querySelectorAll('.offcanvas-header');
    if (offcanvasHeaders.length > 0) {
        offcanvasHeaders.forEach(header => {
            header.style.backgroundColor = '#343a40';
            header.style.borderBottom = '1px solid #495057';
        });
    }

    const offcanvasTitles = document.querySelectorAll('.offcanvas-title');
    if (offcanvasTitles.length > 0) {
        offcanvasTitles.forEach(title => {
            title.style.color = '#fff';
        });
    }

    const offcanvasBodies = document.querySelectorAll('.offcanvas-body');
    if (offcanvasBodies.length > 0) {
        offcanvasBodies.forEach(body => {
            body.style.backgroundColor = '#212529';
        });
    }

    const btnClose = document.querySelectorAll('.btn-close');
    if (btnClose.length > 0) {
        btnClose.forEach(btn => {
            btn.style.filter = 'invert(1)';
            btn.style.opacity = '0.8';
        });
    }
}

function disableOffcanvasDarkMode() {
    const offcanvasElements = document.querySelectorAll('.offcanvas');
    if (offcanvasElements.length > 0) {
        offcanvasElements.forEach(offcanvas => {
            offcanvas.style.backgroundColor = '';
            offcanvas.style.color = '';
            offcanvas.style.borderLeft = '';
        });
    }

    const offcanvasHeaders = document.querySelectorAll('.offcanvas-header');
    if (offcanvasHeaders.length > 0) {
        offcanvasHeaders.forEach(header => {
            header.style.backgroundColor = '';
            header.style.borderBottom = '';
        });
    }

    const offcanvasTitles = document.querySelectorAll('.offcanvas-title');
    if (offcanvasTitles.length > 0) {
        offcanvasTitles.forEach(title => {
            title.style.color = '';
        });
    }

    const offcanvasBodies = document.querySelectorAll('.offcanvas-body');
    if (offcanvasBodies.length > 0) {
        offcanvasBodies.forEach(body => {
            body.style.backgroundColor = '';
        });
    }

    const btnClose = document.querySelectorAll('.btn-close');
    if (btnClose.length > 0) {
        btnClose.forEach(btn => {
            btn.style.filter = '';
            btn.style.opacity = '';
        });
    }
}