document.addEventListener('DOMContentLoaded', function() {
  // Lấy các phần tử DOM cần thiết
  const searchForm = document.querySelector('nav.sb-topnav form[role="search"]'); // Chọn form trong navbar
  const searchInput = searchForm?.querySelector('input[type="search"]');
  const searchButton = searchForm?.querySelector('button[data-bs-toggle="offcanvas"]');
  const offcanvasElement = document.getElementById('offcanvasRight'); // Lấy chính offcanvas
  const offcanvasTitle = offcanvasElement?.querySelector('#offcanvasRightLabel'); // Lấy title bên trong offcanvas
  const offcanvasBody = offcanvasElement?.querySelector('.offcanvas-body'); // Lấy body bên trong offcanvas
  
  // Lấy các phần tử tìm kiếm trên mobile
  const mobileSearchForm = document.getElementById('mobileSearchForm');
  const mobileSearchInput = document.getElementById('mobileSearchInput');
  const mobileSearchButton = document.getElementById('mobileSearchButton');

  // Kiểm tra nếu các phần tử không tồn tại
  if (!searchForm || !searchInput || !searchButton || !offcanvasElement || !offcanvasTitle || !offcanvasBody) {
    console.error('Không tìm thấy các phần tử DOM cần thiết cho chức năng tìm kiếm');
    return;
  }

  // Dữ liệu mẫu cho truyện nếu API không hoạt động
  const sampleCardData = [
    {
      id: 1,
      title: 'Thám Tử Lừng Danh Conan',
      content: 'Truyện trinh thám nổi tiếng của tác giả Gosho Aoyama',
      image: '/images/cards/conan.jpg',
      author: 'Gosho Aoyama',
      genre: 'Trinh thám, Hành động',
      link: '#'
    },
    {
      id: 2,
      title: 'One Piece',
      content: 'Cuộc phiêu lưu tìm kiếm kho báu One Piece của Luffy và đồng đội',
      image: '/images/cards/onepiece.jpg',
      author: 'Eiichiro Oda',
      genre: 'Phiêu lưu, Hành động',
      link: '#'
    },
    {
      id: 3,
      title: 'Naruto',
      content: 'Hành trình trở thành Hokage của Naruto Uzumaki',
      image: '/images/cards/naruto.jpg',
      author: 'Masashi Kishimoto',
      genre: 'Hành động, Phiêu lưu',
      link: '#'
    },
    {
      id: 4,
      title: 'Dragon Ball',
      content: 'Cuộc phiêu lưu của Son Goku và những người bạn',
      image: '/images/cards/dragonball.jpg',
      author: 'Akira Toriyama',
      genre: 'Hành động, Phiêu lưu',
      link: '#'
    },
    {
      id: 5,
      title: 'Attack on Titan',
      content: 'Cuộc chiến sinh tồn của nhân loại trước những người khổng lồ',
      image: '/images/cards/aot.jpg',
      author: 'Hajime Isayama',
      genre: 'Hành động, Kinh dị',
      link: '#'
    }
  ];

  // Hàm tải dữ liệu truyện từ API hoặc sử dụng dữ liệu mẫu
  async function loadCardData() {
    // Kiểm tra xem biến cardData đã tồn tại chưa
    if (typeof window.cardData !== 'undefined' && window.cardData.length > 0) {
      return window.cardData;
    }
    
    // Thử tải dữ liệu từ API
    try {
      const response = await fetch('https://gardentoon.up.railway.app/api/cards');
      if (!response.ok) throw new Error('Lỗi khi lấy dữ liệu từ API');
      const data = await response.json();
      window.cardData = data; // Lưu vào biến toàn cục
      return data;
    } catch (error) {
      console.warn('Không thể tải dữ liệu từ API, sử dụng dữ liệu mẫu:', error);
      window.cardData = sampleCardData; // Sử dụng dữ liệu mẫu
      return sampleCardData;
    }
  }

  // Xử lý sự kiện khi người dùng nhấn nút tìm kiếm
  async function handleSearch(searchValue, fromMobile = false) {
    // Cập nhật tiêu đề của offcanvas
    if (offcanvasTitle) {
      offcanvasTitle.textContent = 'Bạn đang tìm kiếm: ' + (searchValue || '...');
    }

    if (!searchValue) {
      if (offcanvasBody) {
        offcanvasBody.innerHTML = '<p>Vui lòng nhập từ khóa tìm kiếm</p>';
      }
      return;
    }

    // Hiển thị thông báo đang tải
    if (offcanvasBody) {
      offcanvasBody.innerHTML = '<div class="d-flex justify-content-center my-3"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Đang tải...</span></div></div><p class="text-center">Đang tìm kiếm...</p>';
    }

    // Tải dữ liệu truyện
    const cardData = await loadCardData();

    // Tìm kiếm trong dữ liệu
    const searchResults = cardData.filter(card =>
      (card.title && card.title.toLowerCase().includes(searchValue.toLowerCase())) ||
      (card.content && card.content.toLowerCase().includes(searchValue.toLowerCase())) ||
      (card.author && card.author.toLowerCase().includes(searchValue.toLowerCase())) ||
      (card.genre && card.genre.toLowerCase().includes(searchValue.toLowerCase()))
    );

    // Hiển thị kết quả
    if (offcanvasBody) {
      displaySearchResults(searchResults);
    }

    // Nếu tìm kiếm từ mobile, đóng form tìm kiếm
    if (fromMobile) {
      const mobileSearchContainer = document.querySelector('.mobile-search-form-container');
      if (mobileSearchContainer && mobileSearchContainer.classList.contains('show')) {
        setTimeout(() => {
          mobileSearchContainer.classList.remove('show');
          setTimeout(() => {
            mobileSearchContainer.classList.add('d-none');
          }, 300);
        }, 300);
      }
    }
  }

  // Xử lý sự kiện khi người dùng nhấn nút tìm kiếm trên desktop
  searchButton.addEventListener('click', function(event) {
    const searchValue = searchInput.value.trim();
    handleSearch(searchValue);
  });

  // Ngăn chặn form submit mặc định trên desktop và xử lý tìm kiếm
  searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const searchValue = searchInput.value.trim();
    handleSearch(searchValue);
  });

  // Thêm event listener cho phím Enter trên input desktop
  searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const searchValue = searchInput.value.trim();
      handleSearch(searchValue);
    }
  });

  // Xử lý sự kiện tìm kiếm trên mobile
  if (mobileSearchForm && mobileSearchInput && mobileSearchButton) {
    // Xử lý form submit trên mobile
    mobileSearchForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const searchValue = mobileSearchInput.value.trim();
      handleSearch(searchValue, true);
    });

    // Thêm event listener cho phím Enter trên input mobile
    mobileSearchInput.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        const searchValue = mobileSearchInput.value.trim();
        handleSearch(searchValue, true);
      }
    });

    mobileSearchButton.addEventListener('click', function(event) {
      const searchValue = mobileSearchInput.value.trim();
      handleSearch(searchValue, true);
    });
  }

  // Hàm hiển thị kết quả tìm kiếm
  function displaySearchResults(results) {
    // Xóa nội dung cũ
    offcanvasBody.innerHTML = '';

    if (results.length === 0) {
      offcanvasBody.innerHTML = '<div class="alert alert-warning" role="alert"><i class="bi bi-exclamation-triangle-fill me-2"></i>Không tìm thấy kết quả phù hợp</div>';
      return;
    }

    // Tạo phần tử để hiển thị số lượng kết quả
    const resultCount = document.createElement('p');
    resultCount.className = 'mb-3';
    resultCount.innerHTML = `<i class="bi bi-search me-2"></i>Tìm thấy <strong>${results.length}</strong> kết quả:`;
    offcanvasBody.appendChild(resultCount);

    // Tạo các card kết quả
    results.forEach(item => {
      // Tạo card element
      const cardDiv = document.createElement('div');
      // Sử dụng class của Bootstrap, không cần thêm style inline cho dark mode
      cardDiv.className = 'card mb-3';
      cardDiv.style.maxWidth = '540px';
      cardDiv.style.cursor = 'pointer';

      // Xử lý hình ảnh mặc định nếu không có
      const imageUrl = item.image && item.image.trim() ? item.image : '/images/placeholder.jpg';

      // Tạo nội dung bên trong
      cardDiv.innerHTML = `
        <div class="row g-0">
          <div class="col-4">
            <img src="${imageUrl}" class="img-fluid rounded-start h-100" alt="${item.title || 'Hình ảnh truyện'}" style="object-fit: cover;">
          </div>
          <div class="col-8">
            <div class="card-body">
              <h5 class="card-title">${item.title || 'Không có tiêu đề'}</h5>
              <p class="card-text small">${item.content || 'Không có mô tả'}</p>
              <p class="card-text"><small class="text-muted">${item.author || 'Chưa có tác giả'}</small></p>
              ${item.link ? `<a href="${item.link}" class="btn btn-primary btn-sm">Xem thông tin truyện</a>` : '<button class="btn btn-primary btn-sm">Xem truyện</button>'}
            </div>
          </div>
        </div>
      `;

      // Thêm sự kiện click để mở modal chi tiết
      cardDiv.addEventListener('click', function(event) {
        // Ngăn sự kiện click từ nút "Xem chi tiết" kích hoạt modal
        if (event.target.tagName === 'A' || event.target.tagName === 'BUTTON') return;
        
        // Kiểm tra xem hàm openCardModal có tồn tại không
        if (typeof openCardModal === 'function') {
          openCardModal(item);
        } else {
          console.warn('Hàm openCardModal chưa được định nghĩa');
          // Tạo một modal đơn giản nếu không có hàm openCardModal
          alert(`Thông tin truyện: ${item.title || 'Không có tiêu đề'}`);
        }
      });

      // Thêm card vào offcanvas
      offcanvasBody.appendChild(cardDiv);
    });
  }
});