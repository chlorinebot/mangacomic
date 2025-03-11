// Dữ liệu cho các card
const cardData = [
    {
      id: 1,
      title: "Sản phẩm 1",
      image: "https://example.com/images/product1.jpg",
      content: "Đây là mô tả chi tiết về sản phẩm 1. Sản phẩm có nhiều tính năng hữu ích.",
      link: "#product1"
    },
    {
      id: 2,
      title: "Sản phẩm 2",
      image: "https://example.com/images/product2.jpg",
      content: "Đây là mô tả chi tiết về sản phẩm 2. Sản phẩm có thiết kế hiện đại.",
      link: "#product2"
    },
    {
      id: 3,
      title: "Sản phẩm 3",
      image: "https://example.com/images/product3.jpg",
      content: "Đây là mô tả chi tiết về sản phẩm 3. Sản phẩm này rất đáng tin cậy.",
      link: "#product3"
    },
    {
      id: 4,
      title: "Sản phẩm 4",
      image: "https://example.com/images/product4.jpg",
      content: "Đây là mô tả chi tiết về sản phẩm 4. Sản phẩm này có giá trị tốt.",
      link: "#product4"
    },
    {
      id: 5,
      title: "Sản phẩm 5",
      image: "https://example.com/images/product5.jpg",
      content: "Đây là mô tả chi tiết về sản phẩm 5. Sản phẩm này rất phổ biến.",
      link: "#product5"
    },
    {
      id: 6,
      title: "Sản phẩm 6",
      image: "https://example.com/images/product6.jpg",
      content: "Đây là mô tả chi tiết về sản phẩm 6. Sản phẩm này rất đa năng.",
      link: "#product6"
    },
    {
      id: 7,
      title: "Sản phẩm 7",
      image: "https://example.com/images/product7.jpg",
      content: "Đây là mô tả chi tiết về sản phẩm 7. Sản phẩm này có chất lượng cao.",
      link: "#product7"
    },
    {
      id: 8,
      title: "Sản phẩm 8",
      image: "https://example.com/images/product8.jpg",
      content: "Đây là mô tả chi tiết về sản phẩm 8. Sản phẩm này tiết kiệm năng lượng.",
      link: "#product8"
    },
    {
      id: 9,
      title: "Sản phẩm 9",
      image: "https://example.com/images/product9.jpg",
      content: "Đây là mô tả chi tiết về sản phẩm 9. Sản phẩm này có công nghệ tiên tiến.",
      link: "#product9"
    },
    {
      id: 10,
      title: "Sản phẩm 10",
      image: "https://example.com/images/product10.jpg",
      content: "Đây là mô tả chi tiết về sản phẩm 10. Sản phẩm này thân thiện với môi trường.",
      link: "#product10"
    },
    {
      id: 11,
      title: "Sản phẩm 11",
      image: "https://example.com/images/product11.jpg",
      content: "Đây là mô tả chi tiết về sản phẩm 11. Sản phẩm này có thiết kế nhỏ gọn.",
      link: "#product11"
    },
    {
      id: 12,
      title: "Sản phẩm 12",
      image: "https://example.com/images/product12.jpg",
      content: "Đây là mô tả chi tiết về sản phẩm 12. Sản phẩm này dễ sử dụng.",
      link: "#product12"
    },
    {
      id: 13,
      title: "Sản phẩm 13",
      image: "https://example.com/images/product13.jpg",
      content: "Đây là mô tả chi tiết về sản phẩm 13. Sản phẩm này có độ bền cao.",
      link: "#product13"
    },
    {
      id: 14,
      title: "Sản phẩm 14",
      image: "https://example.com/images/product14.jpg",
      content: "Đây là mô tả chi tiết về sản phẩm 14. Sản phẩm này phù hợp cho mọi lứa tuổi.",
      link: "#product14"
    },
    {
      id: 15,
      title: "Sản phẩm 15",
      image: "https://example.com/images/product15.jpg",
      content: "Đây là mô tả chi tiết về sản phẩm 15. Sản phẩm này có giá cả phải chăng.",
      link: "#product15"
    },
    {
      id: 16,
      title: "Sản phẩm 16",
      image: "https://example.com/images/product16.jpg",
      content: "Đây là mô tả chi tiết về sản phẩm 16. Sản phẩm này rất được ưa chuộng.",
      link: "#product16"
    },
    {
      id: 17,
      title: "Sản phẩm 17",
      image: "https://example.com/images/product17.jpg",
      content: "Đây là mô tả chi tiết về sản phẩm 17. Sản phẩm này có thiết kế độc đáo.",
      link: "#product17"
    },
    {
      id: 18,
      title: "Sản phẩm 18",
      image: "https://example.com/images/product18.jpg",
      content: "Đây là mô tả chi tiết về sản phẩm 18. Sản phẩm này có khả năng tích hợp cao.",
      link: "#product18"
    },
    {
      id: 19,
      title: "Sản phẩm 19",
      image: "https://example.com/images/product19.jpg",
      content: "Đây là mô tả chi tiết về sản phẩm 19. Sản phẩm này thích hợp cho các doanh nghiệp.",
      link: "#product19"
    },
    {
      id: 20,
      title: "Sản phẩm 20",
      image: "https://example.com/images/product20.jpg",
      content: "Đây là mô tả chi tiết về sản phẩm 20. Sản phẩm này dễ bảo trì.",
      link: "#product20"
    },
    {
      id: 21,
      title: "Sản phẩm 21",
      image: "https://example.com/images/product21.jpg",
      content: "Đây là mô tả chi tiết về sản phẩm 21. Sản phẩm này có nhiều màu sắc.",
      link: "#product21"
    },
    {
      id: 22,
      title: "Sản phẩm 22",
      image: "https://example.com/images/product22.jpg",
      content: "Đây là mô tả chi tiết về sản phẩm 22. Sản phẩm này được bảo hành dài hạn.",
      link: "#product22"
    },
    {
      id: 23,
      title: "Sản phẩm 23",
      image: "https://example.com/images/product23.jpg",
      content: "Đây là mô tả chi tiết về sản phẩm 23. Sản phẩm này có nhiều phụ kiện đi kèm.",
      link: "#product23"
    },
    {
      id: 24,
      title: "Sản phẩm 24",
      image: "https://example.com/images/product24.jpg",
      content: "Đây là mô tả chi tiết về sản phẩm 24. Sản phẩm này được khách hàng đánh giá cao.",
      link: "#product24"
    },
    {
        id: 25,
        title: "Sản phẩm 25",
        image: "https://example.com/images/product25.jpg",
        content: "Đây là mô tả chi tiết về sản phẩm 25. Sản phẩm này có giá cả phải chăng.",
        link: "#product25"
    }
];

// Dữ liệu cho các card (giữ nguyên cardData)

document.addEventListener('DOMContentLoaded', function() {
    const itemsPerPage = 24; // Số lượng card mỗi trang
    const totalPages = Math.ceil(cardData.length / itemsPerPage); // Tính tổng số trang
    
    // Kiểm tra nếu có phân trang thì thiết lập
    if (document.querySelector('.pagination')) {
      setupPagination();
      displayCardsForPage(1); // Hiển thị trang đầu tiên
    } else {
      displayAllCards(); // Nếu không có phân trang thì hiển thị tất cả
    }
  });
  
  // Hàm hiển thị tất cả card (dùng khi không có phân trang)
  function displayAllCards() {
    const cardContainer = document.querySelector('.row.row-cols-1.row-cols-md-6.g-4');
    if (!cardContainer) {
      console.error('Không tìm thấy container cho cards!');
      return;
    }
    
    cardContainer.innerHTML = '';
    
    cardData.forEach(data => {
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
  
  // Hàm hiển thị card cho trang cụ thể
  function displayCardsForPage(pageNumber) {
    const itemsPerPage = 24;
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageData = cardData.slice(startIndex, endIndex);
    
    const cardContainer = document.querySelector('.row.row-cols-1.row-cols-md-6.g-4');
    if (!cardContainer) {
      console.error('Không tìm thấy container cho cards!');
      return;
    }
    
    cardContainer.innerHTML = '';
    
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
  
  // Thiết lập phân trang
  function setupPagination() {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) {
      console.error('Không tìm thấy phần tử pagination!');
      return;
    }
    
    const paginationItems = paginationContainer.querySelectorAll('.page-item');
    const prevButton = paginationContainer.querySelector('.page-item:first-child');
    const nextButton = paginationContainer.querySelector('.page-item:last-child');
    const pageLinks = Array.from(paginationContainer.querySelectorAll('.page-item:not(:first-child):not(:last-child)'));
    const totalPages = Math.ceil(cardData.length / 24);
    
    // Đảm bảo số lượng pageLinks khớp với totalPages
    if (pageLinks.length !== totalPages) {
      console.warn('Số lượng nút phân trang không khớp với tổng số trang!');
      // Có thể thêm logic để tự động tạo các nút phân trang nếu cần
    }
    
    pageLinks.forEach((item, index) => {
      const pageLink = item.querySelector('.page-link');
      if (pageLink) {
        pageLink.addEventListener('click', function(event) {
          event.preventDefault();
          pageLinks.forEach(pageItem => pageItem.classList.remove('active'));
          item.classList.add('active');
          displayCardsForPage(index + 1);
          updatePrevNextState();
        });
      }
    });
    
    if (prevButton) {
      prevButton.addEventListener('click', function(event) {
        event.preventDefault();
        if (!this.classList.contains('disabled')) {
          const activeIndex = pageLinks.findIndex(item => item.classList.contains('active'));
          if (activeIndex > 0) {
            pageLinks[activeIndex].classList.remove('active');
            pageLinks[activeIndex - 1].classList.add('active');
            displayCardsForPage(activeIndex); // activeIndex bắt đầu từ 0 nên trừ 1
            updatePrevNextState();
          }
        }
      });
    }
    
    if (nextButton) {
      nextButton.addEventListener('click', function(event) {
        event.preventDefault();
        if (!this.classList.contains('disabled')) {
          const activeIndex = pageLinks.findIndex(item => item.classList.contains('active'));
          if (activeIndex < pageLinks.length - 1) {
            pageLinks[activeIndex].classList.remove('active');
            pageLinks[activeIndex + 1].classList.add('active');
            displayCardsForPage(activeIndex + 2); // +2 vì activeIndex bắt đầu từ 0
            updatePrevNextState();
          }
        }
      });
    }
    
    // Đặt trạng thái ban đầu: trang 1 active
    if (pageLinks.length > 0) {
      pageLinks[0].classList.add('active');
      updatePrevNextState();
    }
    
    function updatePrevNextState() {
      const activeIndex = pageLinks.findIndex(item => item.classList.contains('active'));
      if (activeIndex <= 0) {
        prevButton.classList.add('disabled');
      } else {
        prevButton.classList.remove('disabled');
      }
      if (activeIndex >= pageLinks.length - 1) {
        nextButton.classList.add('disabled');
      } else {
        nextButton.classList.remove('disabled');
      }
      if (typeof applyCurrentTheme === 'function') {
        applyCurrentTheme();
      }
    }
    
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
  }
  
  // Hàm thêm và cập nhật card
  function addCard(cardInfo) {
    cardData.push(cardInfo);
    if (document.querySelector('.pagination')) {
      const currentPage = pageLinks.findIndex(item => item.classList.contains('active')) + 1;
      displayCardsForPage(currentPage || 1);
      setupPagination(); // Cập nhật lại phân trang nếu cần
    } else {
      displayAllCards();
    }
  }
  
  function updateCardById(id, newData) {
    const index = cardData.findIndex(card => card.id === id);
    if (index !== -1) {
      cardData[index] = { ...cardData[index], ...newData };
      if (document.querySelector('.pagination')) {
        const currentPage = pageLinks.findIndex(item => item.classList.contains('active')) + 1;
        displayCardsForPage(currentPage || 1);
      } else {
        displayAllCards();
      }
    } else {
      console.error(`Không tìm thấy card có id: ${id}`);
    }
  }