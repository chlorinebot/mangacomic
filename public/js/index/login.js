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
                const loginData = await ApiService.login({ username, password });

                loginMessage.textContent = loginData.message;
                loginMessage.className = 'mt-2 text-success';

                const token = loginData.token;
                localStorage.setItem('token', token);
                localStorage.setItem('username', username);
                localStorage.setItem('roleId', loginData.role_id);

                // Lưu token vào cookie
                document.cookie = `token=${token}; path=/; max-age=3600`;

                const decodedToken = jwt_decode(token);
                const userId = decodedToken.id;
                const roleId = decodedToken.role_id;
                console.log('Decoded token:', decodedToken);

                // Lấy thông tin profile để lấy avatar_url
                try {
                    const userProfile = await ApiService.getUserProfile(userId);
                    if (userProfile && userProfile.avatar_url) {
                        localStorage.setItem('avatar_url', userProfile.avatar_url);
                        console.log('Avatar URL saved to localStorage:', userProfile.avatar_url);
                    } else {
                        localStorage.removeItem('avatar_url');
                    }
                    // Cập nhật navbar với thông tin mới nhất (bao gồm avatar)
                    updateNavbarForLoggedInUser(username, roleId, userProfile.avatar_url);
                } catch (profileError) {
                    console.error('Error fetching profile after login:', profileError);
                    // Vẫn cập nhật navbar nhưng không có avatar
                    updateNavbarForLoggedInUser(username, roleId, null);
                }

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
        const currentPasswordInput = document.getElementById('currentPassword');
        const newPasswordInput = document.getElementById('newPassword');
        const confirmNewPasswordInput = document.getElementById('confirmNewPassword');
        const passwordRequirements = document.getElementById('passwordRequirements');
        const changePasswordMessage = document.getElementById('changePasswordMessage');

        // Kiểm tra yêu cầu mật khẩu mới khi người dùng nhập
        newPasswordInput.addEventListener('input', validateNewPassword);
        confirmNewPasswordInput.addEventListener('input', validatePasswordMatch);

        // Hàm kiểm tra mật khẩu mới
        function validateNewPassword() {
            const password = newPasswordInput.value;
            const requirements = [];
            
            // Kiểm tra độ dài
            if (password.length < 8 || password.length > 20) {
                requirements.push('<span class="text-danger">• Độ dài phải từ 8-20 ký tự</span>');
            } else {
                requirements.push('<span class="text-success">• Độ dài hợp lệ</span>');
            }
            
            // Kiểm tra chữ hoa
            if (!/[A-Z]/.test(password)) {
                requirements.push('<span class="text-danger">• Cần ít nhất 1 chữ hoa</span>');
            } else {
                requirements.push('<span class="text-success">• Có chữ hoa</span>');
            }
            
            // Kiểm tra chữ thường
            if (!/[a-z]/.test(password)) {
                requirements.push('<span class="text-danger">• Cần ít nhất 1 chữ thường</span>');
            } else {
                requirements.push('<span class="text-success">• Có chữ thường</span>');
            }
            
            // Kiểm tra số
            if (!/[0-9]/.test(password)) {
                requirements.push('<span class="text-danger">• Cần ít nhất 1 số</span>');
            } else {
                requirements.push('<span class="text-success">• Có số</span>');
            }
            
            // Kiểm tra ký tự đặc biệt
            if (!/[!@#$%^&*]/.test(password)) {
                requirements.push('<span class="text-danger">• Cần ít nhất 1 ký tự đặc biệt (!@#$%^&*)</span>');
            } else {
                requirements.push('<span class="text-success">• Có ký tự đặc biệt</span>');
            }
            
            // Hiển thị kết quả
            passwordRequirements.innerHTML = requirements.join('<br>');
            
            // Nếu có giá trị ở trường xác nhận mật khẩu, kiểm tra lại
            if (confirmNewPasswordInput.value) {
                validatePasswordMatch();
            }
            
            return password.length >= 8 && password.length <= 20 && 
                   /[A-Z]/.test(password) && /[a-z]/.test(password) && 
                   /[0-9]/.test(password) && /[!@#$%^&*]/.test(password);
        }

        // Hàm kiểm tra xác nhận mật khẩu
        function validatePasswordMatch() {
            const match = newPasswordInput.value === confirmNewPasswordInput.value;
            if (confirmNewPasswordInput.value) {
                if (!match) {
                    confirmNewPasswordInput.classList.add('is-invalid');
                } else {
                    confirmNewPasswordInput.classList.remove('is-invalid');
                    confirmNewPasswordInput.classList.add('is-valid');
                }
            }
            return match;
        }

        changePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const currentPassword = currentPasswordInput.value;
            const newPassword = newPasswordInput.value;
            const confirmNewPassword = confirmNewPasswordInput.value;
            const username = localStorage.getItem('username');

            // Xóa thông báo cũ
            changePasswordMessage.textContent = '';
            changePasswordMessage.className = 'mt-2';

            // Kiểm tra các trường đầu vào
            if (!currentPassword || !newPassword || !confirmNewPassword) {
                changePasswordMessage.textContent = 'Vui lòng điền đầy đủ thông tin';
                changePasswordMessage.className = 'mt-2 text-danger';
                return;
            }

            if (!validateNewPassword()) {
                changePasswordMessage.textContent = 'Mật khẩu mới không đáp ứng các yêu cầu';
                changePasswordMessage.className = 'mt-2 text-danger';
                return;
            }

            if (!validatePasswordMatch()) {
                changePasswordMessage.textContent = 'Mật khẩu mới và xác nhận mật khẩu không khớp!';
                changePasswordMessage.className = 'mt-2 text-danger';
                return;
            }

            try {
                // Hiển thị thông báo đang xử lý
                changePasswordMessage.textContent = 'Đang xử lý...';
                changePasswordMessage.className = 'mt-2 text-info';
                
                // Log dữ liệu trước khi gửi
                console.log('Đang gửi yêu cầu đổi mật khẩu với username:', username);
                
                // Gọi API đổi mật khẩu
                const data = await ApiService.changePassword({
                    username,
                    currentPassword,
                    newPassword,
                });

                console.log('Kết quả từ API đổi mật khẩu:', data);

                // Hiển thị thông báo thành công
                changePasswordMessage.textContent = 'Đổi mật khẩu thành công!';
                changePasswordMessage.className = 'mt-2 text-success';
                
                // Đóng modal sau 2 giây
                setTimeout(() => {
                    const changePasswordModal = bootstrap.Modal.getInstance(document.getElementById('changePasswordModal'));
                    if (changePasswordModal) changePasswordModal.hide();
                    changePasswordForm.reset();
                    passwordRequirements.innerHTML = '';
                    changePasswordMessage.textContent = '';
                    
                    // Xóa các class validation
                    newPasswordInput.classList.remove('is-valid', 'is-invalid');
                    confirmNewPasswordInput.classList.remove('is-valid', 'is-invalid');
                }, 2000);
            } catch (error) {
                // Hiển thị thông báo lỗi
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
    console.log("--- Running checkLoginStatus ---");
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const roleId = localStorage.getItem('roleId');
    const avatar_url = localStorage.getItem('avatar_url');
    
    console.log("Read from localStorage:", { 
        token: token ? 'exists' : 'not found',
        username,
        roleId,
        avatar_url
    });

    if (token && username) {
        // Kiểm tra token có hợp lệ không
        try {
            const decoded = jwt_decode(token);
            const userId = decoded.id;
            
            // Lấy thông tin profile để đảm bảo có avatar_url mới nhất
            ApiService.getUserProfile(userId)
                .then(userProfile => {
                    console.log("Fetched user profile:", userProfile);
                    if (userProfile && userProfile.avatar_url) {
                        localStorage.setItem('avatar_url', userProfile.avatar_url);
                        console.log("Updated avatar_url in localStorage:", userProfile.avatar_url);
                        updateNavbarForLoggedInUser(username, roleId, userProfile.avatar_url);
                    } else {
                        console.log("No avatar_url in user profile, using stored value:", avatar_url);
                        updateNavbarForLoggedInUser(username, roleId, avatar_url);
                    }
                })
                .catch(error => {
                    console.error("Error fetching user profile:", error);
                    updateNavbarForLoggedInUser(username, roleId, avatar_url);
                });

            if (roleId == '1') {
                if (window.location.pathname === '/') {
                    console.log('User is admin, redirecting from index to /admin-web');
                    window.location.href = '/admin-web';
                } else if (window.location.pathname === '/admin-web') {
                    console.log('User is admin, already on /admin-web, no redirect needed');
                }
            }
        } catch (error) {
            console.error("Invalid token:", error);
            logout();
        }
    } else {
        console.log("User is not logged in. Calling updateNavbarForLoggedOutUser.");
        updateNavbarForLoggedOutUser();
    }
}

function updateNavbarForLoggedOutUser() {
    const userDropdown = document.querySelector('.nav-item.dropdown');
    const userActions = document.getElementById('userActions');
    if (userDropdown) {
        userDropdown.innerHTML = `
            <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                </svg>
                <span class="ms-2">Đăng nhập/Đăng ký</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end py-2" style="min-width: 200px;">
                <li class="px-3 mb-2">
                    <button type="button" class="btn btn-success w-100" data-bs-toggle="modal" data-bs-target="#login">Đăng nhập</button>
                </li>
                <li><hr class="dropdown-divider mx-2"></li>
                <li class="px-3">
                    <button type="button" class="btn btn-outline-success w-100" data-bs-toggle="modal" data-bs-target="#logup">Đăng ký</button>
                </li>
            </ul>
        `;
    }
    if (userActions) {
        userActions.classList.add('d-none');
    }
}

function updateNavbarForLoggedInUser(username, roleId, avatar_url = null) {
    console.log("[updateNavbar] Called with arguments:", { username, roleId, avatar_url });
    const userDropdown = document.querySelector('.nav-item.dropdown');
    const userActions = document.getElementById('userActions');

    if (!userDropdown) {
        console.error("[updateNavbar] Error: Could not find user dropdown element.");
        return;
    }

    let avatarDisplay = '';
    if (avatar_url && typeof avatar_url === 'string' && avatar_url.trim() !== '' && avatar_url !== 'null' && avatar_url !== 'undefined') {
        console.log(`[updateNavbar] Using avatar URL: ${avatar_url}`);
        const imageUrlWithTimestamp = `${avatar_url}?t=${new Date().getTime()}`;
        avatarDisplay = `
            <div class="avatar-container" style="width: 35px; height: 35px; overflow: hidden; border-radius: 50%; margin-right: 8px; display: inline-flex; align-items: center; justify-content: center; background-color: #f8f9fa;">
                <img src="${imageUrlWithTimestamp}" 
                     alt="Avatar" 
                     style="width: 100%; height: 100%; object-fit: cover;"
                     onerror="this.onerror=null; this.parentElement.innerHTML='<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'35\\' height=\\'35\\' fill=\\'currentColor\\' class=\\'bi bi-person-circle\\'><path d=\\'M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z\\'/><path fill-rule=\\'evenodd\\' d=\\'M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z\\'/></svg>';">
            </div>`;
    } else {
        console.log(`[updateNavbar] No valid avatar URL found. Using default icon.`);
        avatarDisplay = `
            <div class="avatar-container" style="width: 35px; height: 35px; overflow: hidden; border-radius: 50%; margin-right: 8px; display: inline-flex; align-items: center; justify-content: center; background-color: #f8f9fa;">
                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                </svg>
            </div>`;
    }

    // Cập nhật nội dung dropdown với flexbox để căn chỉnh avatar và tên người dùng
    const finalHTML = `
        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" style="display: flex; align-items: center;">
            ${avatarDisplay}
            <span>${username}${roleId == '1' ? ' (Admin)' : ''}</span>
        </a>
        ${roleId == '1' ? `
            <ul class="dropdown-menu dropdown-menu-end py-2" style="min-width: 200px;">
                <li class="px-3"><a class="dropdown-item" href="/admin-web"><i class="bi bi-speedometer2 me-2"></i>Bảng điều khiển</a></li>
                <li class="px-3"><a class="dropdown-item" href="#" id="settingsButton"><i class="bi bi-gear me-2"></i>Cài đặt</a></li>
                <li><hr class="dropdown-divider mx-2"></li>
                <li class="px-3"><a class="dropdown-item text-danger" href="#" id="logoutButton"><i class="bi bi-box-arrow-right me-2"></i>Đăng xuất</a></li>
            </ul>
        ` : `
            <ul class="dropdown-menu dropdown-menu-end py-2" style="min-width: 200px;">
                <li class="px-3"><a class="dropdown-item" href="#" id="userProfileLink" data-bs-toggle="modal" data-bs-target="#userProfileModal"><i class="bi bi-person me-2"></i>Thông tin tài khoản</a></li>
                <li class="px-3"><a class="dropdown-item" href="#" id="settingsButton"><i class="bi bi-gear me-2"></i>Cài đặt</a></li>
                <li><hr class="dropdown-divider mx-2"></li>
                <li class="px-3"><a class="dropdown-item text-danger" href="#" id="logoutButton"><i class="bi bi-box-arrow-right me-2"></i>Đăng xuất</a></li>
            </ul>
        `}
    `;

    console.log("[updateNavbar] Updating dropdown innerHTML.");
    userDropdown.innerHTML = finalHTML;
    
    // Hiển thị các nút hành động (tin nhắn, thông báo)
    if (userActions) {
        userActions.classList.remove('d-none');
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

// Xử lý khi modal Thông tin tài khoản được mở
const userProfileModal = document.getElementById('userProfileModal');
if (userProfileModal) {
    userProfileModal.addEventListener('show.bs.modal', async () => {
        try {
            // Lấy token và giải mã để lấy userId
            const token = localStorage.getItem('token');
            if (!token) {
                await showAlert('Thông báo', 'Vui lòng đăng nhập để xem thông tin tài khoản!', 'warning');
                const loginModal = new bootstrap.Modal(document.getElementById('login'));
                loginModal.show();
                const profileModalInstance = bootstrap.Modal.getInstance(userProfileModal);
                if (profileModalInstance) profileModalInstance.hide();
                return;
            }

            const decoded = jwt_decode(token);
            const userId = decoded.id;

            // Lấy thông tin người dùng
            const userData = await ApiService.getUserProfile(userId);
            const roleId = localStorage.getItem('roleId');
            console.log("[Profile Modal] User Data Received:", userData);

            // Hiển thị thông tin người dùng
            document.getElementById('profileUsername').textContent = userData.username || 'Không có dữ liệu';
            document.getElementById('profileEmail').textContent = userData.email || 'Không có dữ liệu';
            document.getElementById('profileJoinDate').textContent = userData.created_at
                ? new Date(userData.created_at).toLocaleDateString('vi-VN')
                : 'Không có dữ liệu';
            
            // Cập nhật vai trò với badge
            const profileRole = document.getElementById('profileRole');
            profileRole.textContent = roleId == '1' ? 'Admin' : 'Thành viên';
            profileRole.className = roleId == '1' ? 'badge bg-danger' : 'badge bg-success';
            
            // Hiển thị avatar hoặc chữ cái đầu
            const avatarPreview = document.getElementById('profileAvatarPreview');
            const initials = document.getElementById('profileInitials');
            
            if (userData && userData.avatar_url) {
                console.log("[Profile Modal] Displaying avatar from URL:", userData.avatar_url);
                avatarPreview.style.backgroundImage = `url('${userData.avatar_url}')`;
                initials.textContent = '';
                initials.style.display = 'none';
            } else if (userData && userData.username) {
                console.log("[Profile Modal] Displaying initials for:", userData.username);
                avatarPreview.style.backgroundImage = '';
                initials.textContent = userData.username.charAt(0).toUpperCase();
                initials.style.display = '';
            } else {
                console.log("[Profile Modal] Displaying default initial 'U'");
                avatarPreview.style.backgroundImage = '';
                initials.textContent = 'U';
                initials.style.display = '';
            }

            // Lấy danh sách truyện yêu thích
            const favorites = await ApiService.getUserFavorites(userId);
            const favoriteComicsList = document.getElementById('favoriteComicsList');
            const noFavoritesMessage = document.getElementById('noFavoritesMessage');

            // Xóa nội dung cũ
            favoriteComicsList.innerHTML = '';

            // Kiểm tra dữ liệu favorites
            if (!Array.isArray(favorites) || favorites.length === 0) {
                noFavoritesMessage.classList.remove('d-none');
                favoriteComicsList.classList.add('d-none');
                document.getElementById('favoritesCount').textContent = '0';
            } else {
                noFavoritesMessage.classList.add('d-none');
                favoriteComicsList.classList.remove('d-none');
                document.getElementById('favoritesCount').textContent = favorites.length;

                // Hiển thị danh sách truyện yêu thích
                favorites.forEach(comic => {
                    if (!comic.id || !comic.title || !comic.image) {
                        console.warn('Dữ liệu truyện không đầy đủ:', comic);
                        return;
                    }

                    const comicCard = `
                        <div class="col">
                            <div class="card h-100 shadow-sm border-0 hover-shadow">
                                <div class="position-relative">
                                    <img src="${comic.image}" class="card-img-top" alt="${comic.title}" style="height: 160px; object-fit: cover;">
                                    <button class="btn btn-sm position-absolute top-0 end-0 m-2 btn-danger remove-favorite-btn" data-comic-id="${comic.id}">
                                        <i class="bi bi-x-lg"></i>
                                    </button>
                                </div>
                                <div class="card-body">
                                    <h6 class="card-title text-truncate">${comic.title}</h6>
                                    <div class="d-grid gap-2">
                                        <a href="#" class="btn btn-sm btn-primary view-comic-btn" data-comic-id="${comic.id}">
                                            <i class="bi bi-eye me-1"></i>Xem chi tiết
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    favoriteComicsList.insertAdjacentHTML('beforeend', comicCard);
                });

                // Thêm sự kiện cho các nút
                document.querySelectorAll('.view-comic-btn').forEach(button => {
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        const comicId = button.getAttribute('data-comic-id');
                        const cardModalEl = document.getElementById('card');
                        cardModalEl.setAttribute('data-comic-id', comicId);
                        const cardModal = new bootstrap.Modal(cardModalEl);
                        cardModal.show();
                    });
                });
                
                document.querySelectorAll('.remove-favorite-btn').forEach(button => {
                    button.addEventListener('click', async (e) => {
                        e.preventDefault();
                        const result = await showConfirm(
                            'Xác nhận xóa',
                            'Bạn có chắc muốn xóa truyện này khỏi danh sách yêu thích?',
                            'warning'
                        );

                        if (result.isConfirmed) {
                            const comicId = button.getAttribute('data-comic-id');
                            try {
                                await ApiService.removeFromFavorites(userId, comicId);
                                button.closest('.col').remove();
                                
                                const newCount = favoriteComicsList.querySelectorAll('.col').length;
                                document.getElementById('favoritesCount').textContent = newCount;
                                
                                if (newCount === 0) {
                                    noFavoritesMessage.classList.remove('d-none');
                                    favoriteComicsList.classList.add('d-none');
                                }

                                await showAlert('Thành công', 'Đã xóa truyện khỏi danh sách yêu thích!', 'success');
                            } catch (error) {
                                console.error('Lỗi khi xóa khỏi danh sách yêu thích:', error);
                                await showAlert('Lỗi', 'Không thể xóa khỏi danh sách yêu thích. Vui lòng thử lại!', 'error');
                            }
                        }
                    });
                });
            }
            
            // Thiết lập tìm kiếm truyện yêu thích
            const searchFavorites = document.getElementById('searchFavorites');
            if (searchFavorites) {
                searchFavorites.addEventListener('input', (e) => {
                    const searchTerm = e.target.value.toLowerCase().trim();
                    const comicCards = favoriteComicsList.querySelectorAll('.col');
                    
                    comicCards.forEach(card => {
                        const title = card.querySelector('.card-title').textContent.toLowerCase();
                        if (title.includes(searchTerm)) {
                            card.style.display = '';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                });
            }

            // Lấy thống kê người dùng
            try {
                console.log('Đang lấy thống kê cho userId:', userId);
                const statsResponse = await fetch(`/api/users/${userId}/stats`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!statsResponse.ok) {
                    throw new Error(`HTTP error! status: ${statsResponse.status}`);
                }
                
                const stats = await statsResponse.json();
                console.log('Nhận được thống kê:', stats);
                
                // Cập nhật UI với thống kê
                document.getElementById('commentCount').textContent = stats.comment_count || '0';
                document.getElementById('shareCount').textContent = stats.share_count || '0';
            } catch (error) {
                console.error('Lỗi khi lấy thống kê:', error);
                document.getElementById('commentCount').textContent = '0';
                document.getElementById('shareCount').textContent = '0';
            }
            
            // Lấy thông tin lịch sử đọc
            try {
                const historyResponse = await fetch(`/api/reading-history/${userId}`);
                if (historyResponse.ok) {
                    const historyData = await historyResponse.json();
                    const uniqueComics = new Set();
                    historyData.forEach(item => {
                        uniqueComics.add(item.card_id);
                    });
                    document.getElementById('readCount').textContent = uniqueComics.size;
                } else {
                    document.getElementById('readCount').textContent = '0';
                }
            } catch (error) {
                console.error('Lỗi khi lấy lịch sử đọc:', error);
                document.getElementById('readCount').textContent = '0';
            }
            
        } catch (error) {
            console.error('Lỗi khi lấy thông tin tài khoản:', error);
            await showAlert(
                'Lỗi',
                `Không thể tải thông tin tài khoản: ${error.message || 'Lỗi không xác định'}`,
                'error'
            );
        }
    });

    // Reset modal khi đóng
    userProfileModal.addEventListener('hidden.bs.modal', () => {
        const profileTab = document.getElementById('profile-tab');
        if (profileTab) {
            const tabInstance = new bootstrap.Tab(profileTab);
            tabInstance.show();
        }
        const avatarInput = document.getElementById('avatarInput');
        if (avatarInput) {
            avatarInput.value = '';
        }
    });
}

function showAlert(title, text, icon = 'info') {
    return Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: 'Đồng ý',
        confirmButtonColor: '#28a745',
        showCloseButton: true,
        customClass: {
            popup: 'swal-wide',
            title: 'swal-title',
            content: 'swal-text'
        }
    });
}

function showConfirm(title, text, icon = 'warning') {
    return Swal.fire({
        title: title,
        text: text,
        icon: icon,
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy',
        customClass: {
            popup: 'swal-wide',
            title: 'swal-title',
            content: 'swal-text'
        }
    });
}