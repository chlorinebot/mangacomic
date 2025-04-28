document.addEventListener('DOMContentLoaded', function () {
    // Sidebar Toggle Functionality
    const sidebarToggle = document.getElementById('sidebarToggle');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function(e) {
            e.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }
    
    // Mobile responsive handling
    function handleResponsive() {
        if (window.innerWidth < 768) {
            // Always hide sidebar on mobile by default
            document.body.classList.add('sb-sidenav-toggled');
        } else {
            // On larger screens, respect user preference
            if (localStorage.getItem('sb|sidebar-toggle') !== 'true') {
                document.body.classList.remove('sb-sidenav-toggled');
            }
        }
    }
    
    // Initialize responsive state
    handleResponsive();
    
    // Listen for window resize
    window.addEventListener('resize', handleResponsive);
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        const isSmallScreen = window.innerWidth < 768;
        const isClickOutsideSidebar = !event.target.closest('#layoutSidenav_nav');
        const isClickToggleButton = event.target.closest('#sidebarToggle');
        const isSidebarVisible = !document.body.classList.contains('sb-sidenav-toggled');
        
        if (isSmallScreen && isClickOutsideSidebar && !isClickToggleButton && isSidebarVisible) {
            document.body.classList.add('sb-sidenav-toggled');
        }
    });

    // Đảm bảo các modal hoạt động đúng với sidebar
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('shown.bs.modal', function() {
            if (window.innerWidth < 768) {
                document.body.classList.add('sb-sidenav-toggled');
            }
        });
    });

    // Đồng bộ theme toggle giữa sidebar và navbar
    const sidebarThemeToggle = document.getElementById('sidebar-theme-toggle');
    const sidebarLightIcon = document.getElementById('sidebar-light-icon');
    const sidebarDarkIcon = document.getElementById('sidebar-dark-icon');
    
    if (sidebarThemeToggle && sidebarLightIcon && sidebarDarkIcon) {
        sidebarThemeToggle.addEventListener('click', function() {
            const htmlElement = document.documentElement;
            const currentTheme = htmlElement.getAttribute('data-bs-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-bs-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            if (newTheme === 'dark') {
                sidebarLightIcon.style.display = 'none';
                sidebarDarkIcon.style.display = 'inline-block';
            } else {
                sidebarLightIcon.style.display = 'inline-block';
                sidebarDarkIcon.style.display = 'none';
            }
        });
        
        // Đồng bộ trạng thái icon khi tải trang
        const currentTheme = localStorage.getItem('theme') || 'light';
        if (currentTheme === 'dark') {
            sidebarLightIcon.style.display = 'none';
            sidebarDarkIcon.style.display = 'inline-block';
        } else {
            sidebarLightIcon.style.display = 'inline-block';
            sidebarDarkIcon.style.display = 'none';
        }
    }
});