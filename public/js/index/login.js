// login.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    const signupForm = document.getElementById('signupForm');
    const signupMessage = document.getElementById('signupMessage');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const changePasswordMessage = document.getElementById('changePasswordMessage');

    // Biến để theo dõi trạng thái modal
    let isOpeningModal = false;

    // Kiểm tra trạng thái đăng nhập khi trang được tải
    checkLoginStatus();

    // Xử lý form đăng nhập
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await fetch('https://truyencuatuan.up.railway.app/api/login', {
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

                    // Lưu token, username và role_id vào localStorage
                    const token = data.token;
                    const roleId = data.role_id;
                    localStorage.setItem('token', token);
                    localStorage.setItem('username', username);
                    localStorage.setItem('roleId', roleId);

                    // Giải mã token (sử dụng CDN jwt-decode)
                    const decodedToken = jwt_decode(token);
                    console.log('Decoded token:', decodedToken);

                    // Cập nhật giao diện navbar ngay lập tức
                    updateNavbarForLoggedInUser(username, roleId);

                    // Kiểm tra role và chuyển hướng nếu là admin
                    if (roleId === '1') {
                        setTimeout(() => {
                            window.location.href = '/admin-web';
                        }, 1000);
                    } else {
                        setTimeout(() => {
                            const modal = bootstrap.Modal.getInstance(document.getElementById('login'));
                            if (modal) modal.hide();
                        }, 1000);
                    }

                    // Kiểm tra lại trạng thái đăng nhập
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

    // Xử lý form đăng ký
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('signupUsername').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                signupMessage.textContent = 'Mật khẩu và xác nhận mật khẩu không khớp!';
                signupMessage.className = 'mt-2 text-danger';
                return;
            }

            try {
                const response = await fetch('https://truyencuatuan.up.railway.app/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    signupMessage.textContent = data.message;
                    signupMessage.className = 'mt-2 text-success';
                    setTimeout(() => {
                        const modal = bootstrap.Modal.getInstance(document.getElementById('logup'));
                        if (modal) modal.hide();
                    }, 1000);
                } else {
                    signupMessage.textContent = data.error || 'Đăng ký thất bại!';
                    signupMessage.className = 'mt-2 text-danger';
                }
            } catch (error) {
                signupMessage.textContent = `Lỗi kết nối server: ${error.message}`;
                signupMessage.className = 'mt-2 text-danger';
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
            const confirmPassword = document.getElementById('confirmPassword').value;
            const token = localStorage.getItem('token');

            if (newPassword !== confirmPassword) {
                changePasswordMessage.textContent = 'Mật khẩu mới và xác nhận mật khẩu không khớp!';
                changePasswordMessage.className = 'mt-2 text-danger';
                return;
            }

            try {
                const response = await fetch('https://truyencuatuan.up.railway.app/api/change-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ currentPassword, newPassword }),
                });

                const data = await response.json();

                if (response.ok) {
                    changePasswordMessage.textContent = data.message;
                    changePasswordMessage.className = 'mt-2 text-success';
                    setTimeout(() => {
                        const modal = bootstrap.Modal.getInstance(document.getElementById('changePasswordModal'));
                        if (modal) modal.hide();
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

    // Xử lý sự kiện mở modal
    document.addEventListener('click', (e) => {
        if (e.target.matches('[data-bs-target="#login"]') || 
            e.target.matches('[data-bs-target="#logup"]') || 
            e.target.matches('[data-bs-target="#changePasswordModal"]')) {
            isOpeningModal = true;
        }
    });

    // Xử lý sự kiện đóng modal
    document.addEventListener('hidden.bs.modal', () => {
        if (isOpeningModal) {
            loginMessage.textContent = '';
            loginMessage.className = '';
            if (signupMessage) {
                signupMessage.textContent = '';
                signupMessage.className = '';
            }
            if (changePasswordMessage) {
                changePasswordMessage.textContent = '';
                changePasswordMessage.className = '';
            }
            isOpeningModal = false;
        }
    });
});

// Hàm kiểm tra trạng thái đăng nhập và cập nhật giao diện navbar
function checkLoginStatus() {
    console.log('Checking login status...');
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const roleId = localStorage.getItem('roleId');
    console.log('Token:', token, 'Username:', username, 'RoleId:', roleId);

    const userActions = document.getElementById('userActions');
    const userDropdown = document.querySelector('.nav-item.dropdown');

    if (token && username) {
        // Người dùng đã đăng nhập
        updateNavbarForLoggedInUser(username, roleId);
    } else {
        // Người dùng chưa đăng nhập
        if (userActions) {
            userActions.classList.add('d-none'); // Ẩn các nút Tin nhắn và Thông báo
        } else {
            console.error('Không tìm thấy #userActions');
        }

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
        } else {
            console.error('Không tìm thấy .nav-item.dropdown');
        }
    }
}

// Hàm cập nhật giao diện navbar khi người dùng đã đăng nhập
function updateNavbarForLoggedInUser(username, roleId) {
    const userActions = document.getElementById('userActions');
    const userDropdown = document.querySelector('.nav-item.dropdown');

    if (userActions) {
        userActions.classList.remove('d-none'); // Hiển thị các nút Tin nhắn và Thông báo
    } else {
        console.error('Không tìm thấy #userActions');
    }

    if (userDropdown) {
        userDropdown.innerHTML = `
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                </svg>
                ${username}
            </a>
            <ul class="dropdown-menu">
                ${roleId === '1' ? '<li><a class="dropdown-item" href="/admin-web">Admin Dashboard</a></li><li><hr class="dropdown-divider"></li>' : ''}
                <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#changePasswordModal">Đổi mật khẩu</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" id="logoutButton">Đăng xuất</a></li>
            </ul>
        `;

        // Thêm sự kiện cho nút Đăng xuất
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                localStorage.removeItem('roleId');
                checkLoginStatus();
                window.location.href = '/';
            });
        }
    } else {
        console.error('Không tìm thấy .nav-item.dropdown');
    }
}