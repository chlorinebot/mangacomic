// auth.js
export function checkLoginStatus() {
    console.log("Đang kiểm tra trạng thái đăng nhập trang admin");
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const roleId = localStorage.getItem('roleId');
    
    console.log("Thông tin từ localStorage:", { 
        token: token ? 'exists' : 'not found', 
        username, 
        roleId 
    });

    if (!token || !username) {
        console.log("Không có thông tin đăng nhập, chuyển hướng đến trang đăng nhập");
        redirectToLogin();
        return false;
    }

    try {
        // Giải mã token để kiểm tra
        const decoded = jwt_decode(token);
        console.log("Token đã giải mã:", decoded);
        
        // Kiểm tra vai trò người dùng
        const tokenRoleId = decoded.role_id ? decoded.role_id.toString() : '0';
        
        // Đảm bảo roleId trong localStorage khớp với token
        if (roleId !== tokenRoleId) {
            console.log(`Cập nhật roleId từ ${roleId} thành ${tokenRoleId}`);
            localStorage.setItem('roleId', tokenRoleId);
        }
        
        // Chỉ cho phép admin (role 1) truy cập trang admin
        if (tokenRoleId !== '1') {
            console.log("Người dùng không phải admin (roleId không phải 1), chuyển hướng về trang chủ");
            redirectToHome();
            return false;
        }
        
        console.log("Xác thực thành công, người dùng có quyền admin");
        setupAjaxHeaders(token);
        return true;
    } catch (error) {
        console.error("Lỗi giải mã token:", error);
        redirectToLogin();
        return false;
    }
}

// JWT decode function
function jwt_decode(token) {
    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('Token không hợp lệ');
    }
    
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    try {
        return JSON.parse(atob(base64));
    } catch (error) {
        console.error("Lỗi khi giải mã base64:", error);
        throw new Error('Lỗi giải mã token');
    }
}

// Redirect to login page
function redirectToLogin() {
    console.log("Chuyển hướng đến trang chủ (để đăng nhập)");
    window.location.href = '/';
}

// Redirect to home page
function redirectToHome() {
    console.log("Chuyển hướng từ trang admin về trang chủ");
    window.location.href = '/';
}

// Set up AJAX headers with the auth token
function setupAjaxHeaders(token) {
    console.log("Thiết lập headers cho AJAX và Fetch");
    
    // Set up headers for jQuery AJAX
    if (typeof $ !== 'undefined') {
        $.ajaxSetup({
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        console.log("Đã thiết lập headers cho jQuery AJAX");
    }
    
    // Override fetch to include the token
    const originalFetch = window.fetch;
    window.fetch = function(url, options = {}) {
        if (!options) options = {};
        if (!options.headers) {
            options.headers = {};
        }
        
        options.headers['Authorization'] = 'Bearer ' + token;
        console.log(`Fetch request to ${url} with Authorization header`);
        
        return originalFetch(url, options);
    };
    console.log("Đã thiết lập headers cho Fetch API");
    
    // Thêm cookie cho các request khác
    document.cookie = `token=${token}; path=/; max-age=3600`;
    console.log("Đã thiết lập cookie token");
}

// Logout function
function logout() {
    console.log("Đăng xuất khỏi trang admin");
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('roleId');
    localStorage.removeItem('avatar_url');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    redirectToLogin();
}

// Debug current environment
console.log('Current environment:', { 
    pathname: window.location.pathname,
    hostname: window.location.hostname,
    token: localStorage.getItem('token') ? 'exists' : 'not found',
    roleId: localStorage.getItem('roleId')
});

// Run the login check when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("Trang admin đã tải, kiểm tra đăng nhập");
    
    // Chạy kiểm tra đăng nhập
    const isAuthenticated = checkLoginStatus();
    
    // Nếu đã xác thực, thiết lập sự kiện đăng xuất
    if (isAuthenticated) {
        const logoutButtons = document.querySelectorAll('.logout-button, #logoutButton');
        logoutButtons.forEach(button => {
            if (button) {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    logout();
                });
                console.log("Đã thiết lập sự kiện cho nút đăng xuất:", button);
            }
        });
    }
});