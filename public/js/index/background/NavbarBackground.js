// js/index/background/NavbarBackground.js
function enableNavbarDarkMode() {
    const navbarElement = document.querySelector('.navbar');
    if (navbarElement) {
        navbarElement.classList.remove('bg-body-tertiary');
        navbarElement.classList.add('navbar-dark', 'bg-dark');
        navbarElement.style.color = '#fff';
        navbarElement.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
    }

    const navbarBrand = document.querySelector('.navbar-brand');
    if (navbarBrand) {
        navbarBrand.style.color = '#fff';
    }

    const navbarLinks = document.querySelectorAll('.navbar-nav .nav-link');
    if (navbarLinks) {
        navbarLinks.forEach(link => {
            link.style.color = '#fff';
            if (link.classList.contains('active')) {
                link.style.color = '#fff';
                link.style.fontWeight = 'bold';
            }
        });
    }

    // Xử lý các nút Tin nhắn và Thông báo
    const userActionLinks = document.querySelectorAll('#userActions .nav-link');
    if (userActionLinks.length > 0) {
        userActionLinks.forEach(link => {
            link.style.backgroundColor = '#343a40'; // Màu nền đậm hơn trong chế độ tối
            link.style.color = '#fff'; // Màu icon trắng
        });
    }
}

function disableNavbarDarkMode() {
    const navbarElement = document.querySelector('.navbar');
    if (navbarElement) {
        navbarElement.classList.remove('navbar-dark', 'bg-dark');
        navbarElement.classList.add('bg-body-tertiary');
        navbarElement.style.color = '';
        navbarElement.style.boxShadow = '';
    }

    const navbarBrand = document.querySelector('.navbar-brand');
    if (navbarBrand) {
        navbarBrand.style.color = '';
    }

    const navbarLinks = document.querySelectorAll('.navbar-nav .nav-link');
    if (navbarLinks) {
        navbarLinks.forEach(link => {
            link.style.color = '';
            if (link.classList.contains('active')) {
                link.style.fontWeight = '';
            }
        });
    }

    // Xử lý các nút Tin nhắn và Thông báo
    const userActionLinks = document.querySelectorAll('#userActions .nav-link');
    if (userActionLinks.length > 0) {
        userActionLinks.forEach(link => {
            link.style.backgroundColor = '#e4e6eb'; // Màu nền sáng trong chế độ sáng
            link.style.color = '#000'; // Màu icon đen
        });
    }
}