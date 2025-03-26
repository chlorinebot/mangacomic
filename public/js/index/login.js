// login.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const changePasswordMessage = document.getElementById('changePasswordMessage');

    // Biến để theo dõi trạng thái modal
    let isOpeningModal = false;

    // Kiểm tra trạng thái đăng nhập ngay khi trang tải
    checkLoginStatus();

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    loginMessage.textContent = data.message;
                    loginMessage.className = 'mt-2 text-success';

                    // Lưu token và role_id vào localStorage
                    const token = data.token;
                    const roleId = data.role_id;
                    localStorage.setItem('token', token);
                    localStorage.setItem('username', username);
                    localStorage.setItem('roleId', roleId);

                    // Giải mã token (sử dụng CDN)
                    const decodedToken = jwt_decode(token);
                    console.log('Decoded token:', decodedToken);

                    // Cập nhật giao diện navbar ngay lập tức
                    updateNavbarForLoggedInUser(username, roleId);

                    // Kiểm tra role và chuyển hướng
                    if (roleId === '1') {
                        setTimeout(() => {
                            window.location.href = '/admin-web'; // Chuyển hướng tới admin-web cho admin
                        }, 1000);
                    } else {
                        // Đóng modal cho người dùng thường (role_id = 2)
                        setTimeout(() => {
                            const modal = bootstrap.Modal.getInstance(document.getElementById('login'));
                            if (modal) modal.hide();
                        }, 1000);
                    }

                    // Kiểm tra lại trạng thái đăng nhập sau khi cập nhật
                    checkLoginStatus();
                } else {
                    loginMessage.textContent = data.error || 'Đăng nhập thất bại!';
                    loginMessage.className = 'mt-2 text-danger';
                }
            } catch (error) {
                loginMessage.textContent = `Lỗi kết nối server: ${error.message}`;
                loginMessage.className = 'mt-2 text-danger';
                console.error('Lỗi chi tiết:', error);
            }
        });
    }

    // Xử lý form đổi mật khẩu
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmNewPassword = document.getElementById('confirmNewPassword').value;
            const username = localStorage.getItem('username');
            const token = localStorage.getItem('token');

            // Validation
            if (newPassword !== confirmNewPassword) {
                changePasswordMessage.textContent = 'Mật khẩu mới và xác nhận mật khẩu không khớp!';
                changePasswordMessage.className = 'mt-2 text-danger';
                return;
            }

            if (newPassword.length < 8 || newPassword.length > 20 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[!@#$%^&*]/.test(newPassword)) {
                changePasswordMessage.textContent = 'Mật khẩu mới phải dài 8-20 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt!';
                changePasswordMessage.className = 'mt-2 text-danger';
                return;
            }

            try {
                const response = await fetch('https://truyencuatuan.up.railway.app/api/users/change-password', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        username,
                        currentPassword,
                        newPassword,
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    changePasswordMessage.textContent = 'Đổi mật khẩu thành công!';
                    changePasswordMessage.className = 'mt-2 text-success';
                    setTimeout(() => {
                        const changePasswordModal = bootstrap.Modal.getInstance(document.getElementById('changePasswordModal'));
                        if (changePasswordModal) changePasswordModal.hide();
                        changePasswordForm.reset();
                        changePasswordMessage.textContent = '';
                    }, 1000);
                } else {
                    changePasswordMessage.textContent = data.error || 'Đổi mật khẩu thất bại!';
                    changePasswordMessage.className = 'mt-2 text-danger';
                }
            } catch (error) {
                changePasswordMessage.textContent = `Lỗi kết nối server: ${error.message}`;
                changePasswordMessage.className = 'mt-2 text-danger';
                console.error('Lỗi chi tiết:', error);
            }
        });
    }

    // Thêm sự kiện click cho các nút logout, settings, security, change password, messages và notifications
    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'logoutButton') {
            logout();
        } else if (e.target && e.target.id === 'settingsButton') {
            // Mở Modal 1 (Trung tâm tài khoản)
            isOpeningModal = true;
            const settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'));
            settingsModal.show();
        } else if (e.target && e.target.id === 'securityButton') {
            // Đóng Modal 1 và mở Modal 2 (Mật khẩu và bảo mật)
            isOpeningModal = true;
            const settingsModal = bootstrap.Modal.getInstance(document.getElementById('settingsModal'));
            if (settingsModal) settingsModal.hide();
            setTimeout(() => {
                const securityModal = new bootstrap.Modal(document.getElementById('securityModal'));
                securityModal.show();
            }, 300);
        } else if (e.target && e.target.id === 'changePasswordButton') {
            // Đóng Modal 2 và mở Modal 3 (Đổi mật khẩu)
            isOpeningModal = true;
            const securityModal = bootstrap.Modal.getInstance(document.getElementById('securityModal'));
            if (securityModal) securityModal.hide();
            setTimeout(() => {
                const changePasswordModal = new bootstrap.Modal(document.getElementById('changePasswordModal'));
                changePasswordModal.show();
            }, 300);
        } else if (e.target.closest('#messagesButton')) {
            // Xử lý khi nhấn nút Tin nhắn
            console.log('Nút Tin nhắn được nhấn');
            // Bạn có thể thêm logic để mở modal hoặc chuyển hướng tới trang tin nhắn
        } else if (e.target.closest('#notificationsButton')) {
            // Xử lý khi nhấn nút Thông báo
            console.log('Nút Thông báo được nhấn');
            // Bạn có thể thêm logic để mở modal hoặc chuyển hướng tới trang thông báo
        }
    });

    // Xử lý khi modal đóng
    const settingsModalEl = document.getElementById('settingsModal');
    const securityModalEl = document.getElementById('securityModal');
    const changePasswordModalEl = document.getElementById('changePasswordModal');

    // Khi đóng Modal 3 (Đổi mật khẩu), mở lại Modal 2 (Mật khẩu và bảo mật)
    changePasswordModalEl.addEventListener('hidden.bs.modal', () => {
        if (!isOpeningModal) {
            const securityModal = new bootstrap.Modal(document.getElementById('securityModal'));
            securityModal.show();
        }
        isOpeningModal = false;
    });

    // Khi đóng Modal 2 (Mật khẩu và bảo mật), mở lại Modal 1 (Trung tâm tài khoản)
    securityModalEl.addEventListener('hidden.bs.modal', () => {
        if (!isOpeningModal) {
            const settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'));
            settingsModal.show();
        }
        isOpeningModal = false;
    });

    // Khi đóng Modal 1 (Trung tâm tài khoản), không mở lại modal nào
    settingsModalEl.addEventListener('hidden.bs.modal', () => {
        isOpeningModal = false;
    });
});

// Hàm kiểm tra trạng thái đăng nhập
function checkLoginStatus() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const roleId = localStorage.getItem('roleId');
    const userActions = document.getElementById('userActions'); // Lấy phần tử chứa nút Tin nhắn và Thông báo

    if (token && username) {
        updateNavbarForLoggedInUser(username, roleId);
        // Nếu đã đăng nhập và là admin, tự động chuyển hướng từ index
        if (roleId === '1' && window.location.pathname === '/') {
            window.location.href = '/admin-web';
        }
    } else {
        // Nếu không có token, reset navbar
        const userDropdown = document.querySelector('.nav-item.dropdown.ms-5');
        if (userDropdown) {
            userDropdown.innerHTML = `
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                        <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                    </svg>
                    Đăng nhập/Đăng ký
                </a>
                <ul class="dropdown-menu">
                    <button type="button" class="btn btn-success ms-5" data-bs-toggle="modal" data-bs-target="#login">Đăng nhập</button>
                    <li><hr class="dropdown-divider"></li>
                    <button type="button" class="btn btn-outline-success ms-5" data-bs-toggle="modal" data-bs-target="#logup" style="width: 105px;">Đăng ký</button>
                </ul>
            `;
        }
        // Đảm bảo các nút Tin nhắn và Thông báo bị ẩn
        if (userActions) {
            userActions.classList.add('d-none');
        }
    }
}

// Hàm cập nhật navbar cho người dùng đã đăng nhập
function updateNavbarForLoggedInUser(username, roleId) {
    const userDropdown = document.querySelector('.nav-item.dropdown.ms-5');
    const userActions = document.getElementById('userActions'); // Lấy phần tử chứa nút Tin nhắn và Thông báo

    if (userDropdown) {
        // Nếu là người dùng thông thường (role_id = 2), hiển thị các mục "Thông tin tài khoản", "Cài đặt" và "Đăng xuất"
        if (roleId === '2') {
            userDropdown.innerHTML = `
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                        <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                    </svg>
                    ${username}
                </a>
                <ul class="dropdown-menu">
                    <li>
                        <a class="dropdown-item" href="#">
                            <i class="bi bi-person me-2"></i> Thông tin tài khoản
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item" id="settingsButton" href="#">
                            <i class="bi bi-gear me-2"></i> Cài đặt
                        </a>
                    </li>
                    <li><hr class="dropdown-divider"></li>
                    <li>
                        <button id="logoutButton" class="dropdown-item text-danger">
                            <i class="bi bi-box-arrow-right me-2"></i> Đăng xuất
                        </button>
                    </li>
                </ul>
            `;
        } else {
            // Nếu là admin (role_id = 1), chỉ hiển thị "Đăng xuất"
            userDropdown.innerHTML = `
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                        <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                    </svg>
                    ${username}
                </a>
                <ul class="dropdown-menu">
                    <li>
                        <button id="logoutButton" class="dropdown-item text-danger">
                            <i class="bi bi-box-arrow-right me-2"></i> Đăng xuất
                        </button>
                    </li>
                </ul>
            `;
        }

        // Hiển thị các nút Tin nhắn và Thông báo cho người dùng đã đăng nhập
        if (userActions) {
            userActions.classList.remove('d-none');
        }

        // Cập nhật modal lịch sử nếu tồn tại
        const historyModal = document.getElementById('history');
        if (historyModal) {
            const loginMessage = historyModal.querySelector('h1');
            if (loginMessage && loginMessage.textContent.includes('Vui lòng đăng nhập')) {
                loginMessage.textContent = `Lịch sử xem của ${username}`;
                const loginButton = loginMessage.nextElementSibling;
                if (loginButton && loginButton.textContent.includes('Đăng nhập')) {
                    loginButton.remove();
                }
            }
        }
    }
}

// Hàm xử lý đăng xuất
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('roleId');

    const userDropdown = document.querySelector('.nav-item.dropdown.ms-5');
    const userActions = document.getElementById('userActions'); // Lấy phần tử chứa nút Tin nhắn và Thông báo

    if (userDropdown) {
        userDropdown.innerHTML = `
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                </svg>
                Đăng nhập/Đăng ký
            </a>
            <ul class="dropdown-menu">
                <button type="button" class="btn btn-success ms-5" data-bs-toggle="modal" data-bs-target="#login">Đăng nhập</button>
                <li><hr class="dropdown-divider"></li>
                <button type="button" class="btn btn-outline-success ms-5" data-bs-toggle="modal" data-bs-target="#logup" style="width: 105px;">Đăng ký</button>
            </ul>
        `;

        // Ẩn các nút Tin nhắn và Thông báo
        if (userActions) {
            userActions.classList.add('d-none');
        }

        const historyModal = document.getElementById('history');
        if (historyModal) {
            const historyContent = historyModal.querySelector('h1');
            if (historyContent) {
                historyContent.textContent = 'Vui lòng đăng nhập để xem lại lịch sử xem!!!';
                if (!historyContent.nextElementSibling || !historyContent.nextElementSibling.textContent.includes('Đăng nhập')) {
                    const loginButton = document.createElement('button');
                    loginButton.type = 'button';
                    loginButton.className = 'btn btn-success ms-5';
                    loginButton.setAttribute('data-bs-toggle', 'modal');
                    loginButton.setAttribute('data-bs-target', '#login');
                    loginButton.textContent = 'Đăng nhập tại đây';
                    historyContent.after(loginButton);
                }
            }
        }
    }

    setTimeout(() => {
        window.location.href = '/'; // Quay lại index.ejs
    }, 500);
}