// login.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const changePasswordMessage = document.getElementById('changePasswordMessage');

    let isOpeningModal = false;

    // Kiểm tra trạng thái đăng nhập
    checkLoginStatus();

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            try {
                // Sử dụng ApiService thay vì gọi fetch trực tiếp
                const data = await ApiService.login({ username, password });

                loginMessage.textContent = data.message;
                loginMessage.className = 'mt-2 text-success';

                const token = data.token;
                const roleId = data.role_id;
                localStorage.setItem('token', token);
                localStorage.setItem('username', username);
                localStorage.setItem('roleId', roleId);

                // Lưu token vào cookie
                document.cookie = `token=${token}; path=/; max-age=3600`;

                const decodedToken = jwt_decode(token);
                console.log('Decoded token:', decodedToken);

                updateNavbarForLoggedInUser(username, roleId);

                if (roleId == '1') {
                    console.log('User is admin, redirecting to /admin-web');
                    setTimeout(() => {
                        window.location.href = '/admin-web';
                    }, 1000);
                } else {
                    console.log('User is not admin, closing login modal');
                    setTimeout(() => {
                        const modal = bootstrap.Modal.getInstance(document.getElementById('login'));
                        if (modal) modal.hide();
                    }, 1000);
                }

                checkLoginStatus();
            } catch (error) {
                loginMessage.textContent = error.message || 'Đăng nhập thất bại!';
                loginMessage.className = 'mt-2 text-danger';
                console.error('Lỗi chi tiết:', error);
            }
        });
    }

    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmNewPassword = document.getElementById('confirmNewPassword').value;
            const username = localStorage.getItem('username');

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
                // Sử dụng ApiService thay vì gọi fetch trực tiếp
                const data = await ApiService.changePassword({
                    username,
                    currentPassword,
                    newPassword,
                });

                changePasswordMessage.textContent = 'Đổi mật khẩu thành công!';
                changePasswordMessage.className = 'mt-2 text-success';
                setTimeout(() => {
                    const changePasswordModal = bootstrap.Modal.getInstance(document.getElementById('changePasswordModal'));
                    if (changePasswordModal) changePasswordModal.hide();
                    changePasswordForm.reset();
                    changePasswordMessage.textContent = '';
                }, 1000);
            } catch (error) {
                changePasswordMessage.textContent = error.message || 'Đổi mật khẩu thất bại!';
                changePasswordMessage.className = 'mt-2 text-danger';
                console.error('Lỗi chi tiết:', error);
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'logoutButton') {
            logout();
        } else if (e.target && e.target.id === 'settingsButton') {
            isOpeningModal = true;
            resetModalState();
            const settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'));
            settingsModal.show();
        } else if (e.target && e.target.id === 'securityButton') {
            isOpeningModal = true;
            const settingsModal = bootstrap.Modal.getInstance(document.getElementById('settingsModal'));
            if (settingsModal) settingsModal.hide();
            setTimeout(() => {
                resetModalState();
                const securityModal = new bootstrap.Modal(document.getElementById('securityModal'));
                securityModal.show();
            }, 300);
        } else if (e.target && e.target.id === 'changePasswordButton') {
            isOpeningModal = true;
            const securityModal = bootstrap.Modal.getInstance(document.getElementById('settingsModal'));
            if (securityModal) securityModal.hide();
            setTimeout(() => {
                resetModalState();
                const changePasswordModal = new bootstrap.Modal(document.getElementById('changePasswordModal'));
                changePasswordModal.show();
            }, 300);
        } else if (e.target.closest('#messagesButton')) {
            console.log('Nút Tin nhắn được nhấn');
        } else if (e.target.closest('#notificationsButton')) {
            console.log('Nút Thông báo được nhấn');
        }
    });

    const settingsModalEl = document.getElementById('settingsModal');
    const securityModalEl = document.getElementById('securityModal');
    const changePasswordModalEl = document.getElementById('changePasswordModal');

    changePasswordModalEl.addEventListener('hidden.bs.modal', () => {
        resetModalState();
        if (!isOpeningModal) {
            setTimeout(() => {
                resetModalState();
                const securityModal = new bootstrap.Modal(document.getElementById('securityModal'));
                securityModal.show();
            }, 300);
        }
        isOpeningModal = false;
    });

    securityModalEl.addEventListener('hidden.bs.modal', () => {
        resetModalState();
        if (!isOpeningModal) {
            setTimeout(() => {
                resetModalState();
                const settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'));
                settingsModal.show();
            }, 300);
        }
        isOpeningModal = false;
    });

    settingsModalEl.addEventListener('hidden.bs.modal', () => {
        resetModalState();
        isOpeningModal = false;
    });
    
    const loginModal = document.getElementById('login');
    if (loginModal) {
        loginModal.addEventListener('hidden.bs.modal', () => {
            resetModalState();
        });
    }
    
    const logupModal = document.getElementById('logup');
    if (logupModal) {
        logupModal.addEventListener('hidden.bs.modal', () => {
            resetModalState();
        });
    }
});

function checkLoginStatus() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const roleId = localStorage.getItem('roleId');
    const userActions = document.getElementById('userActions');

    console.log('Checking login status...');
    console.log('Token:', token);
    console.log('Username:', username);
    console.log('Role ID:', roleId);

    if (token && username) {
        updateNavbarForLoggedInUser(username, roleId);
        if (roleId == '1') {
            if (window.location.pathname === '/') {
                console.log('User is admin, redirecting from index to /admin-web');
                window.location.href = '/admin-web';
            } else if (window.location.pathname === '/admin-web') {
                console.log('User is admin, already on /admin-web, no redirect needed');
                // Backend sẽ xử lý render admin-web hoặc 401
            }
        } else {
            // Nếu không phải admin, không cần điều hướng ở đây, để backend xử lý
            console.log('User is not admin, letting backend handle /admin-web');
        }
    } else {
        // Nếu không có token, không điều hướng ở đây, để backend xử lý
        console.log('No token, letting backend handle /admin-web');
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
        if (userActions) {
            userActions.classList.add('d-none');
        }
    }
}

function updateNavbarForLoggedInUser(username, roleId) {
    const userDropdown = document.querySelector('.nav-item.dropdown.ms-5');
    const userActions = document.getElementById('userActions');

    if (userDropdown) {
        if (roleId == '2') {
            userDropdown.innerHTML = `
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                        <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                    </svg>
                    ${username}
                </a>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#" id="userProfileLink" data-bs-toggle="modal" data-bs-target="#userProfileModal"><i class="bi bi-person me-2"></i>Thông tin tài khoản</a></li>
                    <li><a class="dropdown-item" href="#" id="settingsButton"><i class="bi bi-gear me-2"></i>Cài đặt</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="#" id="logoutButton"><i class="bi bi-box-arrow-right me-2"></i>Đăng xuất</a></li>
                </ul>
            `;
        } else if (roleId == '1') {
            userDropdown.innerHTML = `
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                        <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                    </svg>
                    ${username} (Admin)
                </a>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="/admin-web"><i class="bi bi-speedometer2 me-2"></i>Bảng điều khiển</a></li>
                    <li><a class="dropdown-item" href="#" id="settingsButton"><i class="bi bi-gear me-2"></i>Cài đặt</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="#" id="logoutButton"><i class="bi bi-box-arrow-right me-2"></i>Đăng xuất</a></li>
                </ul>
            `;
        }
        
        if (userActions) {
            userActions.classList.remove('d-none');
            // TODO: Load badge counts for messages and notifications
        }
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('roleId');
    
    // Xóa token khỏi cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    checkLoginStatus();
    
    setTimeout(() => {
        window.location.href = '/';
    }, 500);
}

function resetModalState() {
    console.log("Reset trạng thái modal");
    // Đếm số lượng modal hiển thị
    const visibleModals = document.querySelectorAll('.modal.show').length;
    
    if (visibleModals === 0) {
        // Nếu không còn modal nào hiển thị, xóa tất cả backdrop và reset body
        document.body.classList.remove('modal-open');
        const modalBackdrops = document.querySelectorAll('.modal-backdrop');
        modalBackdrops.forEach(backdrop => backdrop.remove());
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        document.body.removeAttribute('style');
    } else if (document.querySelectorAll('.modal-backdrop').length > visibleModals) {
        // Nếu có nhiều backdrop hơn modal đang hiển thị, chỉ giữ lại số lượng backdrop cần thiết
        const extraBackdrops = document.querySelectorAll('.modal-backdrop').length - visibleModals;
        const allBackdrops = Array.from(document.querySelectorAll('.modal-backdrop'));
        allBackdrops.slice(0, extraBackdrops).forEach(backdrop => backdrop.remove());
    }
    
    // Đảm bảo z-index chính xác cho modal và backdrop còn lại
    document.querySelectorAll('.modal.show').forEach((modal, index) => {
        const zIndex = 1050 + (10 * index);
        modal.style.zIndex = zIndex;
        
        // Nếu có backdrop tương ứng, cập nhật z-index của nó
        if (document.querySelectorAll('.modal-backdrop').length > index) {
            const backdrop = document.querySelectorAll('.modal-backdrop')[index];
            backdrop.style.zIndex = zIndex - 1;
        }
    });
}