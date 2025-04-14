/**
 * Mobile Optimization JavaScript
 * Tối ưu hóa trải nghiệm người dùng trên thiết bị di động
 */

document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra nếu đang sử dụng thiết bị di động
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Thêm class cho body để áp dụng CSS đặc biệt cho mobile
        document.body.classList.add('mobile-device');
        
        // Tối ưu hóa sự kiện touch cho các phần tử tương tác
        optimizeTouchEvents();
        
        // Tối ưu hóa hình ảnh cho thiết bị di động
        lazyLoadImages();
        
        // Tối ưu hóa bảng cho thiết bị di động
        optimizeTablesForMobile();
        
        // Tối ưu hóa menu điều hướng
        optimizeMobileNavigation();
        
        // Xử lý notch và safe areas trên iPhone X trở lên
        handleSafeAreas();
    }
    
    // Xử lý orientation change (xoay màn hình)
    window.addEventListener('orientationchange', function() {
        // Đợi một chút để màn hình cập nhật kích thước
        setTimeout(function() {
            // Cập nhật lại UI sau khi xoay màn hình
            updateUIAfterOrientationChange();
        }, 200);
    });
    
    // Thêm pull-to-refresh cho mobile nếu cần
    setupPullToRefresh();
});

/**
 * Tối ưu hóa sự kiện touch cho các phần tử tương tác
 */
function optimizeTouchEvents() {
    // Tăng kích thước vùng tap cho các nút và liên kết
    const interactiveElements = document.querySelectorAll('a, button, .chapter-item, .genre-tag');
    
    interactiveElements.forEach(element => {
        // Thêm class để tăng kích thước vùng tap
        element.classList.add('touch-target');
        
        // Thêm sự kiện touchstart để phản hồi nhanh hơn
        element.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        }, { passive: true });
        
        element.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        }, { passive: true });
    });
    
    // Tối ưu hóa scrolling
    const scrollableAreas = document.querySelectorAll('.scrollable-area, .chapter-list, .comment-list');
    scrollableAreas.forEach(area => {
        area.classList.add('momentum-scroll');
    });
}

/**
 * Lazy load hình ảnh để tăng tốc độ tải trang
 */
function lazyLoadImages() {
    // Kiểm tra nếu trình duyệt hỗ trợ Intersection Observer
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        // Áp dụng lazy loading cho tất cả hình ảnh có thuộc tính data-src
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback cho trình duyệt không hỗ trợ Intersection Observer
        // Tải tất cả hình ảnh ngay lập tức
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.getAttribute('data-src');
        });
    }
}

/**
 * Tối ưu hóa bảng cho thiết bị di động
 */
function optimizeTablesForMobile() {
    const tables = document.querySelectorAll('table:not(.responsive-table)');
    
    tables.forEach(table => {
        // Thêm class responsive
        table.classList.add('responsive-table');
        
        // Wrap bảng trong container để hỗ trợ scroll ngang
        const wrapper = document.createElement('div');
        wrapper.className = 'table-responsive';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
        
        // Thêm data-label cho các ô dữ liệu dựa trên tiêu đề cột
        const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());
        
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, index) => {
                if (headers[index]) {
                    cell.setAttribute('data-label', headers[index]);
                }
            });
        });
    });
}

/**
 * Tối ưu hóa menu điều hướng cho thiết bị di động
 */
function optimizeMobileNavigation() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        // Thêm class để áp dụng CSS đặc biệt
        navbar.classList.add('mobile-optimized');
        
        // Xử lý menu dropdown trên mobile
        const dropdowns = navbar.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (toggle && menu) {
                // Chuyển đổi từ hover sang click cho mobile
                toggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Đóng tất cả các dropdown khác
                    dropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            otherDropdown.querySelector('.dropdown-menu')?.classList.remove('show');
                        }
                    });
                    
                    // Toggle dropdown hiện tại
                    menu.classList.toggle('show');
                });
            }
        });
        
        // Đóng dropdown khi click ra ngoài
        document.addEventListener('click', function() {
            dropdowns.forEach(dropdown => {
                dropdown.querySelector('.dropdown-menu')?.classList.remove('show');
            });
        });
    }
}

/**
 * Xử lý notch và safe areas trên iPhone X trở lên
 */
function handleSafeAreas() {
    // Kiểm tra nếu là iPhone với notch
    const isIPhoneWithNotch = /iPhone/.test(navigator.userAgent) && 
                              (window.screen.height >= 812 || window.screen.width >= 812);
    
    if (isIPhoneWithNotch) {
        // Thêm class để áp dụng CSS đặc biệt
        document.body.classList.add('iphone-notch');
        
        // Thêm padding cho các phần tử cố định ở dưới cùng
        const bottomFixedElements = document.querySelectorAll('.fixed-bottom, .sticky-bottom');
        bottomFixedElements.forEach(element => {
            element.classList.add('safe-area-bottom');
        });
    }
}

/**
 * Cập nhật UI sau khi xoay màn hình
 */
function updateUIAfterOrientationChange() {
    // Cập nhật chiều cao của các phần tử scrollable
    const scrollableElements = document.querySelectorAll('.scrollable-area, .chapter-list');
    
    scrollableElements.forEach(element => {
        // Tính toán lại chiều cao dựa trên viewport mới
        const viewportHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const newHeight = viewportHeight - elementTop - 20; // Trừ đi padding
        
        // Áp dụng chiều cao mới
        element.style.maxHeight = `${newHeight}px`;
    });
    
    // Cập nhật vị trí của modal
    const openModals = document.querySelectorAll('.modal.show');
    openModals.forEach(modal => {
        // Trigger reflow để cập nhật vị trí modal
        modal.style.display = 'none';
        setTimeout(() => {
            modal.style.display = 'block';
        }, 10);
    });
}

/**
 * Thiết lập pull-to-refresh cho mobile
 */
function setupPullToRefresh() {
    // Chỉ áp dụng cho trang chính
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        let touchStartY = 0;
        let touchEndY = 0;
        const minSwipeDistance = 100;
        const refreshThreshold = 150;
        let isPulling = false;
        
        // Tạo indicator pull-to-refresh
        const indicator = document.createElement('div');
        indicator.className = 'pull-refresh-indicator';
        indicator.innerHTML = '<i class="bi bi-arrow-clockwise"></i>';
        indicator.style.display = 'none';
        document.body.appendChild(indicator);
        
        // Xử lý sự kiện touch
        document.addEventListener('touchstart', function(e) {
            // Chỉ áp dụng khi ở đầu trang
            if (window.scrollY === 0) {
                touchStartY = e.touches[0].clientY;
                isPulling = true;
            }
        }, { passive: true });
        
        document.addEventListener('touchmove', function(e) {
            if (!isPulling) return;
            
            touchEndY = e.touches[0].clientY;
            const distance = touchEndY - touchStartY;
            
            // Nếu kéo xuống (giá trị dương) và đủ xa
            if (distance > 0 && distance < refreshThreshold) {
                // Hiển thị indicator với opacity tỷ lệ với khoảng cách kéo
                indicator.style.display = 'flex';
                indicator.style.opacity = distance / refreshThreshold;
                indicator.style.transform = `translateY(${Math.min(distance / 2, 50)}px)`;
            }
        }, { passive: true });
        
        document.addEventListener('touchend', function() {
            if (!isPulling) return;
            
            const distance = touchEndY - touchStartY;
            
            // Nếu kéo đủ xa, thực hiện refresh
            if (distance > refreshThreshold) {
                // Hiệu ứng quay
                indicator.querySelector('i').classList.add('rotating');
                
                // Reload trang sau hiệu ứng
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                // Ẩn indicator
                indicator.style.display = 'none';
            }
            
            isPulling = false;
        }, { passive: true });
    }
}
