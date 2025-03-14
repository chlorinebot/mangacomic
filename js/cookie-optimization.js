document.addEventListener('DOMContentLoaded', function () {
    // === Hàm tiện ích để làm việc với Cookie ===
    // Đặt cookie
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    // Lấy cookie
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        return null;
    }

    // Xóa cookie
    function eraseCookie(name) {
        document.cookie = name + '=; Max-Age=-99999999;';
    }

    // === 1. Tối ưu chế độ tối/sáng (Dark/Light Mode) ===
    const themeSwitch = document.getElementById('flexSwitchCheckDefault');
    const body = document.body;

    // Kiểm tra cookie khi tải trang
    const savedTheme = getCookie('theme');
    if (savedTheme) {
        body.classList.toggle('dark-mode', savedTheme === 'dark');
        themeSwitch.checked = savedTheme === 'dark';
    }

    // Lưu trạng thái khi người dùng thay đổi
    themeSwitch.addEventListener('change', function () {
        if (this.checked) {
            body.classList.add('dark-mode');
            setCookie('theme', 'dark', 30); // Lưu cookie trong 30 ngày
        } else {
            body.classList.remove('dark-mode');
            setCookie('theme', 'light', 30);
        }
    });

    // CSS cho dark mode (thêm vào file CSS hoặc thẻ <style>)
    const darkModeStyle = `
        .dark-mode {
            background-color: #333;
            color: #fff;
        }
        .dark-mode .navbar {
            background-color: #222 !important;
        }
        .dark-mode .card {
            background-color: #444;
            color: #fff;
        }
        .dark-mode .modal-content {
            background-color: #444;
            color: #fff;
        }
    `;
    const styleSheet = document.createElement('style');
    styleSheet.innerText = darkModeStyle;
    document.head.appendChild(styleSheet);

    // === 2. Lưu lịch sử tìm kiếm ===
    const searchInput = document.querySelector('form[role="search"] input');
    const searchButton = document.querySelector('form[role="search"] button');
    const historyModal = document.getElementById('history');
    const historyBody = historyModal.querySelector('.modal-body');

    // Lấy lịch sử tìm kiếm từ cookie
    let searchHistory = getCookie('searchHistory') ? JSON.parse(getCookie('searchHistory')) : [];

    // Hàm hiển thị lịch sử tìm kiếm
    function displaySearchHistory() {
        const loggedIn = getCookie('username'); // Kiểm tra đăng nhập
        if (!loggedIn) return; // Chỉ hiển thị nếu đã đăng nhập

        const historyList = document.createElement('ul');
        historyList.className = 'list-group';
        searchHistory.forEach((term, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            listItem.innerText = term;
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-danger btn-sm';
            deleteBtn.innerText = 'Xóa';
            deleteBtn.addEventListener('click', () => {
                searchHistory.splice(index, 1);
                setCookie('searchHistory', JSON.stringify(searchHistory), 30);
                displaySearchHistory();
            });
            listItem.appendChild(deleteBtn);
            historyList.appendChild(listItem);
        });
        historyBody.innerHTML = ''; // Xóa nội dung cũ
        historyBody.appendChild(historyModal.querySelector('form')); // Giữ form tìm kiếm
        historyBody.appendChild(historyList);
    }

    // Lưu từ khóa tìm kiếm khi người dùng tìm kiếm
    searchButton.addEventListener('click', function (e) {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (searchTerm && searchHistory.indexOf(searchTerm) === -1) {
            searchHistory.unshift(searchTerm); // Thêm vào đầu danh sách
            if (searchHistory.length > 10) searchHistory.pop(); // Giới hạn 10 mục
            setCookie('searchHistory', JSON.stringify(searchHistory), 30);
        }
        displaySearchHistory();
    });

    // Hiển thị lịch sử khi mở modal
    historyModal.addEventListener('show.bs.modal', function () {
        const loggedIn = getCookie('username');
        if (!loggedIn) {
            historyBody.innerHTML = '<h1>Vui lòng đăng nhập để xem lại lịch sử xem!!!</h1><button type="button" class="btn btn-success ms-5" data-bs-toggle="modal" data-bs-target="#login">Đăng nhập tại đây</button>';
        } else {
            displaySearchHistory();
        }
    });

    // === 3. Theo dõi trạng thái đăng nhập ===
    const loginForm = document.querySelector('#login form');
    const loginButton = document.querySelector('#login .btn-primary');
    const userDropdown = document.querySelector('.nav-item.dropdown .nav-link.dropdown-toggle');
    
    // Kiểm tra trạng thái đăng nhập khi tải trang
    const loggedInUser = getCookie('username');
    if (loggedInUser) {
        userDropdown.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
        </svg> ${loggedInUser}`;
    }

    // Xử lý đăng nhập
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('exampleInputEmail1').value;
        const password = document.getElementById('exampleInputPassword1').value;
        // Giả lập đăng nhập (thay thế bằng logic thực tế của bạn)
        if (email && password) {
            const username = email.split('@')[0]; // Lấy phần trước @ làm username
            setCookie('username', username, 7); // Lưu username trong 7 ngày
            userDropdown.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
            </svg> ${username}`;
            // Đóng modal đăng nhập
            const loginModal = bootstrap.Modal.getInstance(document.getElementById('login'));
            loginModal.hide();
        }
    });

    // Thêm nút đăng xuất vào dropdown
    if (loggedInUser) {
        const dropdownMenu = document.querySelector('.nav-item.dropdown .dropdown-menu');
        const logoutItem = document.createElement('li');
        logoutItem.innerHTML = '<button type="button" class="btn btn-danger ms-5">Đăng xuất</button>';
        logoutItem.querySelector('button').addEventListener('click', function () {
            eraseCookie('username');
            userDropdown.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
            </svg> Đăng nhập/Đăng ký`;
            dropdownMenu.innerHTML = `
                <button type="button" class="btn btn-success ms-5" data-bs-toggle="modal" data-bs-target="#login">Đăng nhập</button>
                <li><hr class="dropdown-divider"></li>
                <button type="button" class="btn btn-outline-success ms-5" data-bs-toggle="modal" data-bs-target="#logup" style="width: 105px;">Đăng ký</button>
            `;
        });
        dropdownMenu.innerHTML = '';
        dropdownMenu.appendChild(logoutItem);
    }
});