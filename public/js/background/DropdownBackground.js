// js/index/background/DropdownBackground.js
function enableDropdownDarkMode() {
    const dropdownMenu = document.querySelector('.dropdown-menu');
    if (dropdownMenu) {
        dropdownMenu.classList.add('dropdown-menu-dark');
        dropdownMenu.style.backgroundColor = '#343a40';
        dropdownMenu.style.borderColor = '#212529';
    }

    const dropdownItems = document.querySelectorAll('.dropdown-item');
    if (dropdownItems) {
        dropdownItems.forEach(item => {
            item.style.color = '#e9ecef';
        });
    }
}

function disableDropdownDarkMode() {
    const dropdownMenu = document.querySelector('.dropdown-menu');
    if (dropdownMenu) {
        dropdownMenu.classList.remove('dropdown-menu-dark');
        dropdownMenu.style.backgroundColor = '';
        dropdownMenu.style.borderColor = '';
    }

    const dropdownItems = document.querySelectorAll('.dropdown-item');
    if (dropdownItems) {
        dropdownItems.forEach(item => {
            item.style.color = '';
        });
    }
}