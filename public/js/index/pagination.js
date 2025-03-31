document.addEventListener('DOMContentLoaded', function() {
  // Lấy phần tử pagination
  const paginationContainer = document.querySelector('.pagination');
  const paginationItems = paginationContainer.querySelectorAll('.page-item');
  const prevButton = paginationContainer.querySelector('.page-item:first-child');
  const nextButton = paginationContainer.querySelector('.page-item:last-child');
  const pageLinks = Array.from(paginationContainer.querySelectorAll('.page-item:not(:first-child):not(:last-child)'));
  
  // Số trang tối đa (từ số lượng nút phân trang hoặc tính toán từ dữ liệu)
  const totalPages = Math.ceil(cardData.length / 24); // Tính số trang dựa trên 24 card/trang
  
  // Số lượng card trên mỗi trang
  const itemsPerPage = 8; // Số lượng 8 cho mỗi trangs
  
  // Hiển thị cards cho trang hiện tại
  function displayCardsForPage(pageNumber) {
    // Tính toán vị trí bắt đầu và kết thúc của dữ liệu cần hiển thị
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    // Lấy dữ liệu cho trang hiện tại
    const currentPageData = cardData.slice(startIndex, endIndex);
    
    // Xóa tất cả cards hiện tại
    const cardContainer = document.querySelector('.row');
    cardContainer.innerHTML = '';
    
    // Thêm cards mới cho trang hiện tại
    currentPageData.forEach(data => {
      const colDiv = document.createElement('div');
      colDiv.className = 'col';
      
      const cardDiv = document.createElement('div');
      cardDiv.className = 'card';
      
      const img = document.createElement('img');
      img.className = 'card-img-top';
      img.src = data.image;
      img.alt = data.title;
      
      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';
      
      const cardTitle = document.createElement('h5');
      cardTitle.className = 'card-title';
      cardTitle.textContent = data.title;
      
      const cardText = document.createElement('p');
      cardText.className = 'card-text';
      cardText.textContent = data.content;
      
      cardBody.appendChild(cardTitle);
      cardBody.appendChild(cardText);
      
      cardDiv.appendChild(img);
      cardDiv.appendChild(cardBody);
      
      const link = document.createElement('a');
      link.href = data.link;
      link.style.textDecoration = 'none';
      link.style.color = 'inherit';
      
      link.appendChild(cardDiv);
      colDiv.appendChild(link);
      
      cardContainer.appendChild(colDiv);
    });
  }
  
  // Hàm cập nhật trạng thái active cho các nút
  function updatePaginationState(currentPage) {
    pageLinks.forEach((item, index) => {
      if (index + 1 === currentPage) {
        item.classList.add('active');
        item.setAttribute('aria-current', 'page');
      } else {
        item.classList.remove('active');
        item.removeAttribute('aria-current');
      }
    });
    
    if (currentPage === 1) {
      prevButton.classList.add('disabled');
      prevButton.querySelector('a').setAttribute('tabindex', '-1');
    } else {
      prevButton.classList.remove('disabled');
      prevButton.querySelector('a').removeAttribute('tabindex');
    }
    
    if (currentPage === totalPages) {
      nextButton.classList.add('disabled');
      nextButton.querySelector('a').setAttribute('tabindex', '-1');
    } else {
      nextButton.classList.remove('disabled');
      nextButton.querySelector('a').removeAttribute('tabindex');
    }
    
    applyCurrentTheme();
  }
  
  // Hàm áp dụng theme hiện tại (sáng/tối) cho phân trang
  function applyCurrentTheme() {
    const currentTheme = localStorage.getItem('darkMode');
    const allPageLinks = document.querySelectorAll('.page-link');
    const allPageItems = document.querySelectorAll('.page-item');
    
    if (currentTheme === 'enabled') {
      allPageLinks.forEach(link => {
        link.style.backgroundColor = '#333';
        link.style.color = '#fff';
        link.style.borderColor = '#444';
      });
      
      allPageItems.forEach(item => {
        if (item.classList.contains('active')) {
          const activeLink = item.querySelector('.page-link');
          if (activeLink) {
            activeLink.style.backgroundColor = '#0d6efd';
            activeLink.style.borderColor = '#0d6efd';
            activeLink.style.color = '#fff';
          }
        }
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
      allPageLinks.forEach(link => {
        link.style.backgroundColor = '';
        link.style.color = '';
        link.style.borderColor = '';
      });
    }
  }
  
  // Hàm chuyển đến trang được chọn
  function goToPage(pageNumber) {
    updatePaginationState(pageNumber);
    displayCardsForPage(pageNumber);
    sessionStorage.setItem('currentPage', pageNumber);
    console.log(`Đã chuyển đến trang ${pageNumber}`);
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
      const currentPage = parseInt(sessionStorage.getItem('currentPage') || 1);
      goToPage(currentPage - 1);
    }
  });
  
  // Xử lý sự kiện click cho nút Next
  nextButton.addEventListener('click', function(event) {
    event.preventDefault();
    if (!this.classList.contains('disabled')) {
      const currentPage = parseInt(sessionStorage.getItem('currentPage') || 1);
      goToPage(currentPage + 1);
    }
  });
  
  // Khởi tạo trạng thái ban đầu
  const initialPage = parseInt(sessionStorage.getItem('currentPage')) || 1;
  goToPage(initialPage);
});