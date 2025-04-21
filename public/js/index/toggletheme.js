// Thêm script để xử lý toggle theme
document.addEventListener('DOMContentLoaded', function() {
    const navbarThemeToggler = document.getElementById('navbar-theme-toggle');
    const navbarLightIcon = document.getElementById('navbar-light-icon');
    const navbarDarkIcon = document.getElementById('navbar-dark-icon');
    const htmlElement = document.documentElement;
    
    // Kiểm tra theme hiện tại và cập nhật trạng thái ban đầu
    const updateIcons = () => {
        const currentTheme = htmlElement.getAttribute('data-bs-theme');
        if (currentTheme === 'dark') {
            navbarLightIcon.style.display = 'none';
            navbarDarkIcon.style.display = 'block';
        } else {
            navbarLightIcon.style.display = 'block';
            navbarDarkIcon.style.display = 'none';
        }
    };
    
    // Khởi tạo
    updateIcons();
    
    // Toggle theme
    navbarThemeToggler.addEventListener('click', function(e) {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ a
        const currentTheme = htmlElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Cập nhật giao diện
        htmlElement.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcons();
        
        console.log('Theme changed to:', newTheme);
    });

    // Kiểm tra nếu URL có tham số reportSuccess=true thì hiển thị toast
    const urlParams = new URLSearchParams(window.location.search);
    const reportSuccess = urlParams.get('reportSuccess');
    
    if (reportSuccess === 'true') {
        const toast = new bootstrap.Toast(document.getElementById('reportSuccessToast'));
        toast.show();
    }
});