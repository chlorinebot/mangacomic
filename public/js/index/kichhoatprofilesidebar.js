// Xử lý mở modal profile và kích hoạt tab từ sidebar
document.addEventListener('DOMContentLoaded', function() {
    const sidebarHistoryLink = document.getElementById('sidebarHistoryLink');
    const profileModalElement = document.getElementById('userProfileModal');
    
    if (sidebarHistoryLink && profileModalElement) {
        sidebarHistoryLink.addEventListener('click', function(event) {
            event.preventDefault(); // Ngăn hành vi mặc định (mở modal ngay lập tức)

            // 1. Kiểm tra đăng nhập
            const token = localStorage.getItem('token');
            if (!token) {
                // Nếu chưa đăng nhập, mở modal đăng nhập thay thế
                const loginModal = new bootstrap.Modal(document.getElementById('login'));
                loginModal.show();
                return; // Dừng thực thi
            }

            // 2. Lấy ID tab cần hiển thị từ thuộc tính data
            const tabTargetId = this.getAttribute('data-show-tab');
            if (!tabTargetId) return;

            // 3. Lấy instance của modal profile
            const profileModal = bootstrap.Modal.getOrCreateInstance(profileModalElement);

            // 4. Tìm nút tab tương ứng
            const targetTabButton = profileModalElement.querySelector(`.nav-link[data-bs-target="#${tabTargetId}-pane"]`);
            
            if (targetTabButton) {
                // 5. Kích hoạt tab bằng Bootstrap API
                const tab = new bootstrap.Tab(targetTabButton);
                tab.show();
            } else {
                console.warn('Không tìm thấy nút tab cho:', tabTargetId);
                // Nếu không tìm thấy tab, vẫn mở modal nhưng ở tab mặc định
            }

            // 6. Hiển thị modal profile
            profileModal.show();
        });
    }
});