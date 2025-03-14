// Dữ liệu cho các card
const cardData = [
  {
    id: 1,
    title: "7 Viên Ngọc Rồng – Dragon Ball",
    image: "https://nhasachmienphi.com/images/thumbnail/nhasachmienphi-7-vien-ngoc-rong-dragon-ball.jpg",
    content: "Tác giả: Akira Toriyama",
    link: "#product1"
  },
  {
    id: 2,
    title: "Đại Chiến Người Khổng Lồ - Attack On Titan - Mùa 1",
    image: "https://resizing.flixster.com/SEKqvD_3s-g47nWx0tsZykurPvQ=/206x305/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p10873160_b_v8_aa.jpg",
    content: "Tác giả: Isayama Hajime.",
    link: "#product2"
  },
  {
    id: 3,
    title: "Conan Volume 1",
    image: "./banner_img/conan_v1.png",
    content: "Tác giả: Aoyama Gōshō.",
    link: "#product3"
  },
  {
    id: 4,
    title: "Lạc Trôi",
    image: "https://pops-images-vn.akamaized.net/api/v2/containers/file2/cms_thumbnails/lactroi-01355878da52-1685600629917-s7qYv1Wa.png?v=0&maxW=420&format=webp",
    content: "Tác giả: Nguyễn Huỳnh Bảo Châu.",
    link: "#product4"
  },
  // Các card khác được giữ nguyên
];

// Biến lưu trữ dữ liệu card hiện tại
let currentCardData = null;

document.addEventListener('DOMContentLoaded', function() {
  // Kiểm tra xem có bị trùng với sự kiện DOMContentLoaded của chapter.js không
  if (window.cardInitialized) return;
  window.cardInitialized = true;
  
  const cardContainer = document.querySelector('.row.row-cols-1.row-cols-md-6.g-4');
  if (!cardContainer) {
      console.error('Không tìm thấy container cho cards!');
      return;
  }
  
  const itemsPerPage = 12; // Số lượng card mỗi trang
  const totalPages = Math.ceil(cardData.length / itemsPerPage); // Tính tổng số trang
  
  // Kiểm tra nếu có phân trang thì thiết lập
  if (document.querySelector('.pagination')) {
      setupCardPagination();
      displayCardsForPage(1); // Hiển thị trang đầu tiên
  } else {
      displayAllCards(); // Nếu không có phân trang thì hiển thị tất cả
  }
  
  // Sử dụng setupCardModalBehavior thay vì setupModalBehavior để tránh xung đột
  setupCardModalBehavior();
});

// Đổi tên hàm để tránh xung đột với chapter.js
function setupCardModalBehavior() {
  const docTruyenModal = document.getElementById('doctruyen');
  const cardModal = document.getElementById('card');
  
  // Nếu tồn tại modal đọc truyện và chưa có sự kiện lắng nghe
  if (docTruyenModal && !docTruyenModal.hasCardModalListener) {
      // Đánh dấu là đã gắn sự kiện để tránh gắn nhiều lần
      docTruyenModal.hasCardModalListener = true;
      
      // Lắng nghe sự kiện khi modal đọc truyện bị ẩn
      docTruyenModal.addEventListener('hidden.bs.modal', function() {
          // Hiển thị lại modal card
          if (currentCardData) {
              const cardBsModal = new bootstrap.Modal(cardModal);
              cardBsModal.show();
          }
      });
  }
  
  // Thêm sự kiện khi đóng modal card
  if (cardModal && !cardModal.hasCardCloseListener) {
      // Đánh dấu là đã gắn sự kiện để tránh gắn nhiều lần
      cardModal.hasCardCloseListener = true;
      
      // Thêm sự kiện lắng nghe khi modal card bị đóng
      cardModal.addEventListener('hidden.bs.modal', function() {
          // Modal card đã đóng và trở về trang chủ
          // Không cần làm gì thêm vì mặc định đã trở về trang chủ
          
          // Đảm bảo tất cả các modal khác cũng đóng
          const modalBackdrops = document.querySelectorAll('.modal-backdrop');
          modalBackdrops.forEach(backdrop => {
              backdrop.remove();
          });
          
          // Loại bỏ class 'modal-open' từ body nếu còn
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
      });
  }
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
      
      // Thêm sự kiện click để mở modal
      cardDiv.style.cursor = 'pointer';
      cardDiv.addEventListener('click', function() {
          openCardModal(data);
      });
      
      colDiv.appendChild(cardDiv);
      cardContainer.appendChild(colDiv);
  });
}

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
      
      // Thêm sự kiện click để mở modal
      cardDiv.style.cursor = 'pointer';
      cardDiv.addEventListener('click', function() {
          openCardModal(data);
      });
      
      colDiv.appendChild(cardDiv);
      cardContainer.appendChild(colDiv);
  });
}

// Hàm mở modal và hiển thị thông tin card
function openCardModal(data) {
  // Lưu dữ liệu card hiện tại để sử dụng khi quay lại từ modal đọc truyện
  currentCardData = data;
  
  // Lấy các phần tử modal
  const modal = document.getElementById('card');
  const modalTitle = modal.querySelector('.modal-title');
  const modalBody = modal.querySelector('.modal-body');
  
  // Đặt tiêu đề modal là tiêu đề card
  modalTitle.textContent = data.title;
  
  // Cập nhật hình ảnh và thông tin trong card bên trong modal
  const cardImg = modalBody.querySelector('.img-fluid') || modalBody.querySelector('.card img');
  if (cardImg) {
      cardImg.src = data.image;
      cardImg.alt = data.title;
  }
  
  // Cập nhật tiêu đề và nội dung trong card
  const cardTitle = modalBody.querySelector('.card-title');
  if (cardTitle) {
      cardTitle.textContent = data.title;
  }
  
  // Tìm và cập nhật các phần tử card-text
  const cardTexts = modalBody.querySelectorAll('.card-text');
  if (cardTexts.length > 0) {
      cardTexts[0].textContent = data.content; // Tác giả hoặc nội dung chính
      
      // Các thông tin khác nếu có
      if (cardTexts.length > 1) {
          cardTexts[1].textContent = "Thể loại: Truyện tranh";
      }
      if (cardTexts.length > 2) {
          cardTexts[2].textContent = `Nội dung truyện: ${data.content}`;
      }
  }
  
  // Mở modal sử dụng Bootstrap
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();
}

// Đổi tên hàm để tránh xung đột với chapter.js
function setupCardPagination() {
  const paginationContainer = document.querySelector('.pagination');
  if (!paginationContainer) {
      console.error('Không tìm thấy phần tử pagination!');
      return;
  }
  
  // Nếu đã thiết lập sự kiện cho phân trang, thoát để tránh trùng lặp
  if (paginationContainer.hasCardPaginationSetup) return;
  paginationContainer.hasCardPaginationSetup = true;
  
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
      if (pageLink && !pageLink.hasCardClickEvent) {
          pageLink.hasCardClickEvent = true;
          pageLink.addEventListener('click', function(event) {
              event.preventDefault();
              pageLinks.forEach(pageItem => pageItem.classList.remove('active'));
              item.classList.add('active');
              displayCardsForPage(index + 1);
              updateCardPrevNextState();
          });
      }
  });
  
  if (prevButton && !prevButton.hasCardClickEvent) {
      prevButton.hasCardClickEvent = true;
      prevButton.addEventListener('click', function(event) {
          event.preventDefault();
          if (!this.classList.contains('disabled')) {
              const activeIndex = pageLinks.findIndex(item => item.classList.contains('active'));
              if (activeIndex > 0) {
                  pageLinks[activeIndex].classList.remove('active');
                  pageLinks[activeIndex - 1].classList.add('active');
                  displayCardsForPage(activeIndex); // activeIndex bắt đầu từ 0 nên trừ 1
                  updateCardPrevNextState();
              }
          }
      });
  }
  
  if (nextButton && !nextButton.hasCardClickEvent) {
      nextButton.hasCardClickEvent = true;
      nextButton.addEventListener('click', function(event) {
          event.preventDefault();
          if (!this.classList.contains('disabled')) {
              const activeIndex = pageLinks.findIndex(item => item.classList.contains('active'));
              if (activeIndex < pageLinks.length - 1) {
                  pageLinks[activeIndex].classList.remove('active');
                  pageLinks[activeIndex + 1].classList.add('active');
                  displayCardsForPage(activeIndex + 2); // +2 vì activeIndex bắt đầu từ 0
                  updateCardPrevNextState();
              }
          }
      });
  }
  
  // Đặt trạng thái ban đầu: trang 1 active
  if (pageLinks.length > 0) {
      pageLinks[0].classList.add('active');
      updateCardPrevNextState();
  }
  
  function updateCardPrevNextState() {
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
}

// Loại bỏ hàm openReadModal và khởi tạo sự kiện cho nút "Đọc truyện" trong accordion
// vì chúng được xử lý bởi chapter.js