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
    const searchValue = searchInput.value.trim().toLowerCase();
    
    // Cập nhật tiêu đề của offcanvas
    offcanvasTitle.textContent = 'Bạn đang tìm kiếm: ' + searchValue;
    
    if (searchValue === '') {
      offcanvasBody.innerHTML = '<p>Vui lòng nhập từ khóa tìm kiếm</p>';
      return;
    }
    
    // Tìm kiếm trong dữ liệu cardData
    const searchResults = cardData.filter(card => 
      card.title.toLowerCase().includes(searchValue) || 
      card.content.toLowerCase().includes(searchValue)
    );
    
    // Hiển thị kết quả
    displaySearchResults(searchResults);
  });

  // Ngăn chặn form submit mặc định
  searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    searchButton.click(); // Kích hoạt sự kiện click trên nút tìm kiếm
  });
  
  // Hàm hiển thị kết quả tìm kiếm
  function displaySearchResults(results) {
    // Xóa nội dung cũ
    offcanvasBody.innerHTML = '';
    
    if (results.length === 0) {
      offcanvasBody.innerHTML = '<p>Không tìm thấy kết quả phù hợp</p>';
      return;
    }
    
    // Tạo phần tử để hiển thị số lượng kết quả
    const resultCount = document.createElement('p');
    resultCount.className = 'mb-3';
    resultCount.textContent = `Tìm thấy ${results.length} kết quả:`;
    offcanvasBody.appendChild(resultCount);
    
    // Kiểm tra nếu đang ở chế độ tối dựa trên localStorage
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
    
    // Tạo các card kết quả
    results.forEach(item => {
      // Tạo card element
      const cardDiv = document.createElement('div');
      cardDiv.className = 'card mb-3';
      
      // Tạo nội dung bên trong
      cardDiv.innerHTML = `
        <div class="row g-0">
          <div class="col-md-4">
            <img src="${item.image}" class="img-fluid rounded-start" alt="${item.title}">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
              <p class="card-text">${item.content}</p>
              <a href="${item.link}" class="btn btn-primary btn-sm">Xem chi tiết</a>
            </div>
          </div>
        </div>
      `;
      
      // Áp dụng kiểu dark mode nếu cần
      if (isDarkMode) {
        // Card
        cardDiv.style.backgroundColor = '#212529';
        cardDiv.style.borderColor = '#343a40';
        cardDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        
        // Card body
        const cardBody = cardDiv.querySelector('.card-body');
        if (cardBody) {
          cardBody.style.backgroundColor = '#212529';
        }
        
        // Card title
        const cardTitle = cardDiv.querySelector('.card-title');
        if (cardTitle) {
          cardTitle.style.color = '#fff';
        }
        
        // Card text
        const cardText = cardDiv.querySelector('.card-text');
        if (cardText) {
          cardText.style.color = '#adb5bd';
        }
      }
      
      // Thêm card vào offcanvas
      offcanvasBody.appendChild(cardDiv);
    });
    
    // Lắng nghe sự kiện thay đổi chế độ và cập nhật lại giao diện kết quả
    const darkModeSwitch = document.getElementById('flexSwitchCheckDefault');
    if (darkModeSwitch) {
      darkModeSwitch.addEventListener('change', function() {
        // Kiểm tra lại trạng thái hiện tại và cập nhật lại kết quả hiển thị
        if (results.length > 0) {
          displaySearchResults(results);
        }
      });
    }
  }
});