document.addEventListener('DOMContentLoaded', function() {
  // Lấy phần tử pagination
  const paginationContainer = document.querySelector('.pagination');
  const paginationItems = paginationContainer.querySelectorAll('.page-item');
  const prevButton = paginationContainer.querySelector('.page-item:first-child');
  const nextButton = paginationContainer.querySelector('.page-item:last-child');
  const pageLinks = Array.from(paginationContainer.querySelectorAll('.page-item:not(:first-child):not(:last-child)'));
  
  // Số trang tối đa (có thể thay đổi theo nhu cầu)
  const totalPages = pageLinks.length;
  
  // Hàm cập nhật trạng thái active cho các nút
  function updatePaginationState(currentPage) {
    // Cập nhật trạng thái cho các nút số trang
    pageLinks.forEach((item, index) => {
      if (index + 1 === currentPage) {
        item.classList.add('active');
        item.setAttribute('aria-current', 'page');
      } else {
        item.classList.remove('active');
        item.removeAttribute('aria-current');
      }
    });
    
    // Cập nhật trạng thái cho nút Previous
    if (currentPage === 1) {
      prevButton.classList.add('disabled');
      prevButton.querySelector('a').setAttribute('tabindex', '-1');
    } else {
      prevButton.classList.remove('disabled');
      prevButton.querySelector('a').removeAttribute('tabindex');
    }
    
    // Cập nhật trạng thái cho nút Next
    if (currentPage === totalPages) {
      nextButton.classList.add('disabled');
      nextButton.querySelector('a').setAttribute('tabindex', '-1');
    } else {
      nextButton.classList.remove('disabled');
      nextButton.querySelector('a').removeAttribute('tabindex');
    }
    
    // Kiểm tra và áp dụng lại chế độ tối nếu đã được bật
    applyCurrentTheme();
  }
  
  // Hàm áp dụng theme hiện tại (sáng/tối) cho phân trang
  function applyCurrentTheme() {
    const currentTheme = localStorage.getItem('darkMode');
    const allPageLinks = document.querySelectorAll('.page-link');
    const allPageItems = document.querySelectorAll('.page-item');
    
    if (currentTheme === 'enabled') {
      // Áp dụng kiểu phân trang tối cho tất cả các liên kết trang
      allPageLinks.forEach(link => {
        link.style.backgroundColor = '#333';
        link.style.color = '#fff';
        link.style.borderColor = '#444';
      });
      
      // Kiểu dáng đặc biệt cho nút trang hiện tại (active)
      allPageItems.forEach(item => {
        if (item.classList.contains('active')) {
          const activeLink = item.querySelector('.page-link');
          if (activeLink) {
            activeLink.style.backgroundColor = '#0d6efd';
            activeLink.style.borderColor = '#0d6efd';
            activeLink.style.color = '#fff';
          }
        }
        
        // Kiểu dáng cho nút bị vô hiệu hóa (disabled)
        if (item.classList.contains('disabled')) {
          const disabledLink = item.querySelector('.page-link');
          if (disabledLink) {
            disabledLink.style.backgroundColor = '#222';
            disabledLink.style.color = '#666';
            disabledLink.style.borderColor = '#333';
          }
        }
      });
    } else {
      // Khôi phục tất cả các liên kết trang về mặc định cho chế độ sáng
      allPageLinks.forEach(link => {
        link.style.backgroundColor = '';
        link.style.color = '';
        link.style.borderColor = '';
      });
    }
  }
  
  // Hàm chuyển đến trang được chọn
  function goToPage(pageNumber) {
    // Cập nhật UI - Ở đây bạn có thể thêm logic để tải nội dung trang mới
    updatePaginationState(pageNumber);
    
    // Giả lập việc tải nội dung trang mới - Trong ứng dụng thực tế, bạn sẽ thay thế phần này
    console.log(`Đã chuyển đến trang ${pageNumber}`);
    
    // Lưu trang hiện tại vào sessionStorage để duy trì trạng thái khi load lại trang
    sessionStorage.setItem('currentPage', pageNumber);
  }
  
  // Xử lý sự kiện click cho các nút số trang
  pageLinks.forEach((item, index) => {
    item.addEventListener('click', function(event) {
      event.preventDefault();
      goToPage(index + 1);
    });
  });
  
  // Xử lý sự kiện click cho nút Previous
  prevButton.addEventListener('click', function(event) {
    event.preventDefault();
    if (!this.classList.contains('disabled')) {
      const currentPage = parseInt(sessionStorage.getItem('currentPage') || 
                                  document.querySelector('.page-item.active').textContent);
      goToPage(currentPage - 1);
    }
  });
  
  // Xử lý sự kiện click cho nút Next
  nextButton.addEventListener('click', function(event) {
    event.preventDefault();
    if (!this.classList.contains('disabled')) {
      const currentPage = parseInt(sessionStorage.getItem('currentPage') || 
                                  document.querySelector('.page-item.active').textContent);
      goToPage(currentPage + 1);
    }
  });
  
  // Khởi tạo trạng thái ban đầu dựa trên sessionStorage hoặc mặc định là trang 1
  const initialPage = parseInt(sessionStorage.getItem('currentPage')) || 1;
  goToPage(initialPage);
});