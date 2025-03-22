// js/index/background/CoreDarkMode.js
document.addEventListener('DOMContentLoaded', function() {
    const darkModeSwitch = document.getElementById('flexSwitchCheckDefault');

    // Kiểm tra trạng thái ban đầu
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'enabled') {
        enableDarkMode();
    } else {
        disableDarkMode();
    }

    // Sự kiện thay đổi switch
    darkModeSwitch.addEventListener('change', function() {
        if (this.checked) {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    });

    // Hàm bật chế độ tối
    function enableDarkMode() {
        darkModeSwitch.checked = true;
        localStorage.setItem('darkMode', 'enabled');

        // Gọi các hàm từ các file khác
        enableBodyDarkMode();
        enableNavbarDarkMode();
        enableDropdownDarkMode();
        enableSearchDarkMode();
        enableFooterDarkMode();
        enablePaginationDarkMode();
        enableCardDarkMode();
        enableTextDarkMode();
        enableOffcanvasDarkMode();
        enableModalDarkMode();
    }

    // Hàm tắt chế độ tối
    function disableDarkMode() {
        darkModeSwitch.checked = false;
        localStorage.setItem('darkMode', 'disabled');

        // Gọi các hàm từ các file khác
        disableBodyDarkMode();
        disableNavbarDarkMode();
        disableDropdownDarkMode();
        disableSearchDarkMode();
        disableFooterDarkMode();
        disablePaginationDarkMode();
        disableCardDarkMode();
        disableTextDarkMode();
        disableOffcanvasDarkMode();
        disableModalDarkMode();
    }
});