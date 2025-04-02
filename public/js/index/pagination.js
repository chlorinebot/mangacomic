document.addEventListener('DOMContentLoaded', function() {
  // Lấy phần tử pagination
  const paginationContainer = document.querySelector('.pagination');
  if (!paginationContainer) {
    console.error('Không tìm thấy phần tử pagination!');
    return;
  }
  
  // Số lượng card trên mỗi trang
  const itemsPerPage = 12; // Số lượng 12 cho mỗi trang
  
  // Số trang tối đa (từ số lượng nút phân trang hoặc tính toán từ dữ liệu)
  const totalPages = Math.ceil(cardData.length / itemsPerPage); 
  
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
  
  // Tạo mới phần tử phân trang giống với mẫu trong ảnh
  function createPagination(currentPage) {
    paginationContainer.innerHTML = '';
    
    // Tạo phần tử nút Previous
    const prevItem = document.createElement('li');
    prevItem.className = `page-item ${currentPage <= 1 ? 'disabled' : ''}`;
    
    const prevLink = document.createElement('a');
    prevLink.className = 'page-link';
    prevLink.href = '#';
    prevLink.textContent = 'Previous';
    
    prevItem.appendChild(prevLink);
    paginationContainer.appendChild(prevItem);
    
    // Xác định số lượng trang hiển thị
    const maxVisiblePages = 3; // Hiển thị tối đa 3 trang số
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Điều chỉnh nếu không đủ số trang hiển thị
    if (endPage - startPage + 1 < maxVisiblePages && startPage > 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Tạo các nút số trang
    for (let i = startPage; i <= endPage; i++) {
      const pageItem = document.createElement('li');
      pageItem.className = `page-item ${i === currentPage ? 'active' : ''}`;
      
      const pageLink = document.createElement('a');
      pageLink.className = 'page-link';
      pageLink.href = '#';
      pageLink.textContent = i;
      
      pageItem.appendChild(pageLink);
      paginationContainer.appendChild(pageItem);
      
      // Thêm sự kiện click
      pageItem.addEventListener('click', function(e) {
        e.preventDefault();
        goToPage(i);
      });
    }
    
    // Tạo nút Next
    const nextItem = document.createElement('li');
    nextItem.className = `page-item ${currentPage >= totalPages ? 'disabled' : ''}`;
    
    const nextLink = document.createElement('a');
    nextLink.className = 'page-link';
    nextLink.href = '#';
    nextLink.textContent = 'Next';
    
    nextItem.appendChild(nextLink);
    paginationContainer.appendChild(nextItem);
    
    // Thêm sự kiện click cho nút Previous
    prevItem.addEventListener('click', function(e) {
      e.preventDefault();
      if (currentPage > 1) {
        goToPage(currentPage - 1);
      }
    });
    
    // Thêm sự kiện click cho nút Next
    nextItem.addEventListener('click', function(e) {
      e.preventDefault();
      if (currentPage < totalPages) {
        goToPage(currentPage + 1);
      }
    });
  }
  
  // Hàm chuyển đến trang được chọn
  function goToPage(pageNumber) {
    displayCardsForPage(pageNumber);
    createPagination(pageNumber);
    sessionStorage.setItem('currentPage', pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // Cập nhật style cho các nút phân trang hiện có
  function updatePaginationStyles() {
    const allPageLinks = document.querySelectorAll('.page-link');
    allPageLinks.forEach(link => {
      if (!link.style.backgroundColor) {
        if (link.parentElement.classList.contains('active')) {
          link.style.backgroundColor = '#0d6efd';
        } else if (link.parentElement.classList.contains('disabled')) {
          link.style.backgroundColor = '#343a40';
          link.style.color = '#6c757d';
        } else {
          link.style.backgroundColor = '#343a40';
        }
        link.style.color = '#fff';
        link.style.border = 'none';
      }
    });
  }
  
  // Lắng nghe sự kiện thay đổi theme
  const darkModeToggle = document.getElementById('darkmode-toggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('change', function() {
      setTimeout(() => {
        // Cho darkmode thời gian để áp dụng, sau đó cập nhật lại style
        updatePaginationStyles();
      }, 100);
    });
  }
  
  // Áp dụng style ngay khi trang tải xong
  updatePaginationStyles();
});