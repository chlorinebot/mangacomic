document.addEventListener('DOMContentLoaded', function() {
    // Lấy các phần tử DOM cần thiết
    const searchForm = document.querySelector('form[role="search"]');
    const searchInput = searchForm.querySelector('input[type="search"]');
    const searchButton = searchForm.querySelector('button[data-bs-toggle="offcanvas"]');
    const offcanvasTitle = document.getElementById('offcanvasRightLabel');
    const offcanvasBody = document.querySelector('.offcanvas-body');
  
    // Xử lý sự kiện khi người dùng nhấn nút tìm kiếm
    searchButton.addEventListener('click', function(event) {
      // Lấy giá trị từ ô input
      const searchValue = searchInput.value.trim();
      
      // Cập nhật tiêu đề của offcanvas
      offcanvasTitle.textContent = 'Bạn đang tìm kiếm: ' + searchValue;
      
      // Bạn có thể thêm code ở đây để xử lý tìm kiếm và hiển thị kết quả vào offcanvasBody
      // Ví dụ:
      // offcanvasBody.innerHTML = 'Kết quả tìm kiếm cho: ' + searchValue;
    });
  
    // Ngăn chặn form submit mặc định
    searchForm.addEventListener('submit', function(event) {
      event.preventDefault();
      searchButton.click(); // Kích hoạt sự kiện click trên nút tìm kiếm
    });
  });