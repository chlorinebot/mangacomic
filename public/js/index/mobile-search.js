/**
 * Mobile Search Functionality
 * Xử lý hiển thị/ẩn thanh tìm kiếm trên điện thoại
 */
document.addEventListener('DOMContentLoaded', function() {
    // Lấy các phần tử cần thiết
    const mobileSearchToggle = document.querySelector('.mobile-search-toggle');
    const mobileSearchContainer = document.querySelector('.mobile-search-form-container');
    const mobileSearchClose = document.querySelector('.mobile-search-close');
    const mobileSearchInput = mobileSearchContainer?.querySelector('input[type="search"]');
    
    // Kiểm tra xem các phần tử có tồn tại không
    if (!mobileSearchToggle || !mobileSearchContainer || !mobileSearchClose) {
        console.warn('Mobile search elements not found');
        return;
    }
    
    // Hàm hiển thị form tìm kiếm
    function showMobileSearch() {
        mobileSearchContainer.classList.add('show');
        mobileSearchContainer.classList.remove('d-none');
        mobileSearchToggle.setAttribute('aria-expanded', 'true');
        
        // Focus vào ô input sau khi hiển thị form
        setTimeout(() => {
            if (mobileSearchInput) {
                mobileSearchInput.focus();
            }
        }, 300);
    }
    
    // Hàm ẩn form tìm kiếm
    function hideMobileSearch() {
        mobileSearchContainer.classList.remove('show');
        setTimeout(() => {
            mobileSearchContainer.classList.add('d-none');
        }, 300);
        mobileSearchToggle.setAttribute('aria-expanded', 'false');
    }
    
    // Xử lý sự kiện khi nhấn vào nút tìm kiếm
    mobileSearchToggle.addEventListener('click', function(e) {
        e.preventDefault();
        showMobileSearch();
    });
    
    // Xử lý sự kiện khi nhấn vào nút đóng
    mobileSearchClose.addEventListener('click', function(e) {
        e.preventDefault();
        hideMobileSearch();
    });
    
    // Xử lý sự kiện khi nhấn phím Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !mobileSearchContainer.classList.contains('d-none')) {
            hideMobileSearch();
        }
    });
    
    // Xử lý sự kiện khi nhấn bên ngoài form tìm kiếm
    document.addEventListener('click', function(e) {
        if (!mobileSearchContainer.contains(e.target) && 
            e.target !== mobileSearchToggle && 
            !mobileSearchToggle.contains(e.target) && 
            !mobileSearchContainer.classList.contains('d-none')) {
            hideMobileSearch();
        }
    });
    
    // Xử lý sự kiện khi thay đổi kích thước màn hình
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768 && !mobileSearchContainer.classList.contains('d-none')) {
            hideMobileSearch();
        }
    });
});
