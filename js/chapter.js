// chapter.js

// Dữ liệu chương truyện mẫu cho các truyện (dựa trên id từ cardData trong card_title.js)
const chapterData = {
  1: [ // id: 1 - "7 Viên Ngọc Rồng – Dragon Ball"
    {
      chapterNumber: 1,
      chapterTitle: "Cuộc gặp gỡ với Bulma",
      content: "Son Goku gặp Bulma và bắt đầu hành trình tìm ngọc rồng.",
      imageFolder: "images/dragonball/chapter1", // Thư mục chứa ảnh
      imageCount: 3, // Số lượng ảnh trong chương (page1.jpg, page2.jpg, page3.jpg)
      rating: 4.5, // Đánh giá trung bình (thang 5 sao)
      commentCount: 24 // Số lượng bình luận
    },
    {
      chapterNumber: 2,
      chapterTitle: "Hành trình đầu tiên",
      content: "Son Goku và Bulma đối mặt với những thử thách đầu tiên.",
      imageFolder: "images/dragonball/chapter2",
      imageCount: 2,
      rating: 4.2,
      commentCount: 18
    }
  ],
  2: [ // id: 2 - "Sản phẩm 2"
    {
      chapterNumber: 1,
      chapterTitle: "Đến giờ, đã 2000 năm.",
      content: "Mô tả nội dung chương 1 của sản phẩm 2.",
      imageFolder: "./images/attackontitan/chapter1", // Thư mục chứa ảnh
      imageCount: 55, // Giả sử có 4 trang ảnh
      rating: 4.8,
      commentCount: 42
    },
    {
      chapterNumber: 2,
      chapterTitle: "Ngày hôm đó",
      content: "Nội dung chương 2 của sản phẩm 2.",
      imageFolder: "./images/attackontitan/chapter2",
      imageCount: 45,
      rating: 4.6,
      commentCount: 35
    }
  ],
  3: [
    {
      chapterNumber: 1,
      chapterTitle: "Viên thuốc độc",
      content: "BLA BLA.",
      imageFolder: "./images/conan/conan_v1/chapter1", // Thư mục chứa ảnh
      imageCount: 35, // Số lượng ảnh trong chương (page1.jpg, page2.jpg, page3.jpg)
      rating: 4.7,
      commentCount: 31
    },
    {
      chapterNumber: 2,
      chapterTitle: "Thám tử thu nhỏ",
      content: "ABC.",
      imageFolder: "./images/conan/conan_v1/chapter2",
      imageCount: 28,
      rating: 4.5,
      commentCount: 27
    },
    {
      chapterNumber: 3,
      chapterTitle: "Thám tử bị cô lập",
      content: "ABC.",
      imageFolder: "./images/conan/conan_v1/chapter3",
      imageCount: 16,
      rating: 4.3,
      commentCount: 19
    },
    {
      chapterNumber: 4,
      chapterTitle: "Ống khói thứ sáu",
      content: "ABC.",
      imageFolder: "./images/conan/conan_v1/chapter4",
      imageCount: 16,
      rating: 4.4,
      commentCount: 22
    },
    {
      chapterNumber: 5,
      chapterTitle: "Thêm một trọng tội",
      content: "ABC.",
      imageFolder: "./images/conan/conan_v1/chapter5",
      imageCount: 16,
      rating: 4.6,
      commentCount: 25
    },
    {
      chapterNumber: 6,
      chapterTitle: "Từ thám tử gà mờ thành thám thử tài ba",
      content: "ABC.",
      imageFolder: "./images/conan/conan_v1/chapter6",
      imageCount: 17,
      rating: 4.8,
      commentCount: 36
    },
    {
      chapterNumber: 7,
      chapterTitle: "Thần tượng đẫm máu",
      content: "ABC.",
      imageFolder: "./images/conan/conan_v1/chapter7",
      imageCount: 18,
      rating: 4.9,
      commentCount: 43
    }
  ]
};

// Biến lưu trữ dữ liệu chương hiện tại và id truyện
let currentChapterData = null;
let currentCardId = null;

document.addEventListener('DOMContentLoaded', function() {
  if (window.chapterInitialized) return;
  window.chapterInitialized = true;

  const cardModal = document.getElementById('card');
  if (cardModal) {
    cardModal.addEventListener('show.bs.modal', function() {
      if (currentCardData && currentCardData.id) {
        currentCardId = currentCardData.id;
        displayChapters(currentCardData.id);
      }
    });
  }

  setupChapterModalBehavior();
});

function setupChapterModalBehavior() {
  const readModal = document.getElementById('doctruyen');
  if (readModal && !readModal.hasChapterListener) {
    readModal.hasChapterListener = true;
    readModal.addEventListener('hidden.bs.modal', function() {
      const cardModal = document.getElementById('card');
      if (currentCardData) {
        const cardBsModal = new bootstrap.Modal(cardModal);
        cardBsModal.show();
      }
    });
  }
}

function displayChapters(cardId) {
  const chapters = chapterData[cardId] || [];
  const accordion = document.querySelector('#accordionExample');
  if (!accordion) {
    console.error('Không tìm thấy accordion!');
    return;
  }

  accordion.innerHTML = '';

  chapters.forEach((chapter, index) => {
    const accordionItem = document.createElement('div');
    accordionItem.className = 'accordion-item';

    const accordionHeader = document.createElement('h2');
    accordionHeader.className = 'accordion-header';

    const accordionButton = document.createElement('button');
    accordionButton.className = `accordion-button ${index === 0 ? '' : 'collapsed'}`;
    accordionButton.type = 'button';
    accordionButton.setAttribute('data-bs-toggle', 'collapse');
    accordionButton.setAttribute('data-bs-target', `#collapseChapter${chapter.chapterNumber}`);
    accordionButton.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
    accordionButton.setAttribute('aria-controls', `collapseChapter${chapter.chapterNumber}`);
    accordionButton.textContent = `Chương ${chapter.chapterNumber}`;

    const accordionCollapse = document.createElement('div');
    accordionCollapse.id = `collapseChapter${chapter.chapterNumber}`;
    accordionCollapse.className = `accordion-collapse collapse ${index === 0 ? 'show' : ''}`;
    accordionCollapse.setAttribute('data-bs-parent', '#accordionExample');

    const accordionBody = document.createElement('div');
    accordionBody.className = 'accordion-body';

    const readButton = document.createElement('button');
    readButton.type = 'button';
    readButton.className = 'btn btn-primary';
    readButton.textContent = 'Đọc truyện';
    readButton.addEventListener('click', function() {
      openReadModal(chapter);
    });

    const chapterContent = document.createElement('p');
    chapterContent.innerHTML = `<strong>${chapter.chapterTitle}</strong> ${chapter.content}`;

    accordionBody.appendChild(readButton);
    accordionBody.appendChild(chapterContent);
    accordionCollapse.appendChild(accordionBody);
    accordionHeader.appendChild(accordionButton);
    accordionItem.appendChild(accordionHeader);
    accordionItem.appendChild(accordionCollapse);
    accordion.appendChild(accordionItem);
  });
}

function openReadModal(chapter) {
  currentChapterData = chapter;

  const modal = document.getElementById('doctruyen');
  const modalTitle = modal.querySelector('.modal-title');
  const modalBody = modal.querySelector('.modal-body');
  const modalFooter = modal.querySelector('.modal-footer');

  modalTitle.textContent = `Chương ${chapter.chapterNumber} - ${chapter.chapterTitle}`;
  modalBody.innerHTML = '';

  // Hiển thị ảnh từ thư mục
  if (chapter.imageFolder && chapter.imageCount > 0) {
    for (let i = 1; i <= chapter.imageCount; i++) {
      const img = document.createElement('img');
      img.src = `${chapter.imageFolder}/page (${i}).jpg`; // Tạo URL động: images/product2/chapter1/page1.jpg
      img.className = 'd-block mx-auto mb-3';
      img.alt = `Trang ${i} - Chương ${chapter.chapterNumber}`;
      img.style.maxWidth = '100%';
      modalBody.appendChild(img);
    }
  } else {
    modalBody.textContent = chapter.content;
  }

  // Cập nhật footer với nút điều hướng và container đánh giá
  modalFooter.innerHTML = '';
  
  // Tạo container cho đánh giá và nút bình luận (bên trái)
  const ratingCommentContainer = document.createElement('div');
  ratingCommentContainer.className = 'd-flex align-items-center me-auto';
  
  // Tạo hiển thị đánh giá
  const ratingDisplay = document.createElement('div');
  ratingDisplay.className = 'd-flex align-items-center me-3';
  
  // Hiển thị các ngôi sao
  const ratingStars = document.createElement('div');
  ratingStars.className = 'me-1';
  
  // Tạo 5 ngôi sao với màu phù hợp dựa trên đánh giá
  const rating = chapter.rating || 0;
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('i');
    if (i <= Math.floor(rating)) {
      // Sao đầy đủ
      star.className = 'fas fa-star text-warning';
    } else if (i - 0.5 <= rating) {
      // Nửa sao
      star.className = 'fas fa-star-half-alt text-warning';
    } else {
      // Sao rỗng
      star.className = 'far fa-star text-warning';
    }
    ratingStars.appendChild(star);
  }
  
  // Hiển thị số điểm đánh giá
  const ratingNumber = document.createElement('span');
  ratingNumber.className = 'ms-1';
  ratingNumber.textContent = `${rating}/5`;
  
  ratingDisplay.appendChild(ratingStars);
  ratingDisplay.appendChild(ratingNumber);
  
  // Tạo nút bình luận
  const commentButton = document.createElement('button');
  commentButton.type = 'button';
  commentButton.className = 'btn btn-outline-secondary btn-sm';
  commentButton.innerHTML = `<i class="far fa-comment"></i> Bình luận (${chapter.commentCount || 0})`;
  commentButton.addEventListener('click', function() {
    showComments(chapter);
  });
  
  // Thêm rating và comment button vào container
  ratingCommentContainer.appendChild(ratingDisplay);
  ratingCommentContainer.appendChild(commentButton);
  
  // Nút điều hướng (bên phải)
  const navigationContainer = document.createElement('div');
  navigationContainer.className = 'd-flex';
  
  const prevButton = document.createElement('button');
  prevButton.type = 'button';
  prevButton.className = 'btn btn-secondary me-2';
  prevButton.textContent = 'Chương trước';
  prevButton.addEventListener('click', goToPreviousChapter);
  
  const nextButton = document.createElement('button');
  nextButton.type = 'button';
  nextButton.className = 'btn btn-primary';
  nextButton.textContent = 'Chương tiếp theo';
  nextButton.addEventListener('click', goToNextChapter);
  
  navigationContainer.appendChild(prevButton);
  navigationContainer.appendChild(nextButton);
  
  // Thêm các phần tử vào footer
  modalFooter.appendChild(ratingCommentContainer);
  modalFooter.appendChild(navigationContainer);
  
  updateNavigationButtons(prevButton, nextButton);
  
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();
}

function showComments(chapter) {
  // Tạo và hiển thị modal bình luận
  let commentModal = document.getElementById('commentModal');
  
  // Tạo modal nếu chưa tồn tại
  if (!commentModal) {
    commentModal = document.createElement('div');
    commentModal.className = 'modal fade';
    commentModal.id = 'commentModal';
    commentModal.setAttribute('tabindex', '-1');
    commentModal.setAttribute('aria-labelledby', 'commentModalLabel');
    commentModal.setAttribute('aria-hidden', 'true');
    
    const modalHTML = `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="commentModalLabel">Bình luận</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="comments-container">
              <!-- Bình luận sẽ được thêm vào đây -->
            </div>
            <hr>
            <div class="comment-form mt-3">
              <h6>Thêm bình luận</h6>
              <div class="mb-3">
                <label for="ratingInput" class="form-label">Đánh giá</label>
                <div class="rating-input">
                  <i class="far fa-star" data-rating="1"></i>
                  <i class="far fa-star" data-rating="2"></i>
                  <i class="far fa-star" data-rating="3"></i>
                  <i class="far fa-star" data-rating="4"></i>
                  <i class="far fa-star" data-rating="5"></i>
                </div>
              </div>
              <div class="mb-3">
                <label for="commentInput" class="form-label">Nội dung</label>
                <textarea class="form-control" id="commentInput" rows="3"></textarea>
              </div>
              <button type="button" class="btn btn-primary" id="submitComment">Gửi bình luận</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    commentModal.innerHTML = modalHTML;
    document.body.appendChild(commentModal);
    
    // Xử lý chọn sao đánh giá
    const stars = commentModal.querySelectorAll('.rating-input i');
    stars.forEach(star => {
      star.addEventListener('click', function() {
        const rating = this.getAttribute('data-rating');
        // Reset tất cả các sao
        stars.forEach(s => s.className = 'far fa-star');
        // Đặt sao đã chọn và các sao trước đó
        for (let i = 0; i < rating; i++) {
          stars[i].className = 'fas fa-star text-warning';
        }
      });
      
      star.addEventListener('mouseover', function() {
        const rating = this.getAttribute('data-rating');
        // Hiển thị preview khi hover
        for (let i = 0; i < rating; i++) {
          stars[i].className = 'fas fa-star text-warning';
        }
      });
      
      star.addEventListener('mouseout', function() {
        // Khi không hover nữa, khôi phục trạng thái đã chọn hoặc mặc định
        stars.forEach(s => {
          if (s.classList.contains('selected')) {
            s.className = 'fas fa-star text-warning selected';
          } else {
            s.className = 'far fa-star';
          }
        });
      });
    });
    
    // Xử lý nút gửi bình luận
    const submitButton = commentModal.querySelector('#submitComment');
    submitButton.addEventListener('click', function() {
      const commentInput = commentModal.querySelector('#commentInput');
      const comment = commentInput.value.trim();
      
      // Kiểm tra nội dung bình luận không rỗng
      if (comment) {
        // Giả lập thêm bình luận mới vào container
        const commentsContainer = commentModal.querySelector('.comments-container');
        const newComment = document.createElement('div');
        newComment.className = 'comment border-bottom pb-3 mb-3';
        newComment.innerHTML = `
          <div class="d-flex align-items-center mb-2">
            <strong>Người dùng</strong>
            <span class="ms-2 text-warning">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
            </span>
            <small class="ms-auto text-muted">Vừa xong</small>
          </div>
          <p>${comment}</p>
        `;
        
        // Thêm bình luận mới lên đầu danh sách
        if (commentsContainer.firstChild) {
          commentsContainer.insertBefore(newComment, commentsContainer.firstChild);
        } else {
          commentsContainer.appendChild(newComment);
        }
        
        // Xóa nội dung sau khi gửi
        commentInput.value = '';
        stars.forEach(s => s.className = 'far fa-star');
      }
    });
  }
  
  // Cập nhật tiêu đề modal với tên chương
  const modalTitle = commentModal.querySelector('.modal-title');
  modalTitle.textContent = `Bình luận - Chương ${chapter.chapterNumber}: ${chapter.chapterTitle}`;
  
  // Hiển thị các bình luận mẫu
  const commentsContainer = commentModal.querySelector('.comments-container');
  commentsContainer.innerHTML = '';
  
  // Tạo một số bình luận mẫu dựa trên số lượng bình luận
  const sampleComments = [
    {
      username: "MangaFan123",
      rating: 5,
      content: "Chương này thật tuyệt vời! Tôi rất thích cách tác giả phát triển nhân vật.",
      time: "1 ngày trước"
    },
    {
      username: "OtakuMaster",
      rating: 4,
      content: "Cốt truyện đang rất hay, nhưng tôi nghĩ một số hình ảnh hành động hơi khó theo dõi.",
      time: "3 ngày trước"
    },
    {
      username: "TruyenTranh2024",
      rating: 5,
      content: "Không thể đợi đến chương tiếp theo! Cảm ơn vì đã dịch nhanh chóng.",
      time: "1 tuần trước"
    }
  ];
  
  // Tạo số lượng bình luận tương ứng
  const commentCount = Math.min(chapter.commentCount || 0, 10); // Giới hạn hiển thị tối đa 10 bình luận
  for (let i = 0; i < commentCount; i++) {
    const commentSample = sampleComments[i % sampleComments.length];
    const commentRating = Math.floor(Math.random() * 2) + 4; // Random 4-5 sao
    
    const commentElement = document.createElement('div');
    commentElement.className = 'comment border-bottom pb-3 mb-3';
    
    // Tạo nội dung HTML cho bình luận
    let starsHTML = '';
    for (let j = 1; j <= 5; j++) {
      starsHTML += `<i class="${j <= commentRating ? 'fas' : 'far'} fa-star"></i>`;
    }
    
    commentElement.innerHTML = `
      <div class="d-flex align-items-center mb-2">
        <strong>${commentSample.username}</strong>
        <span class="ms-2 text-warning">
          ${starsHTML}
        </span>
        <small class="ms-auto text-muted">${commentSample.time}</small>
      </div>
      <p>${commentSample.content}</p>
    `;
    
    commentsContainer.appendChild(commentElement);
  }
  
  // Hiển thị modal
  const bsCommentModal = new bootstrap.Modal(commentModal);
  bsCommentModal.show();
}

function goToPreviousChapter() {
  if (!currentCardId || !currentChapterData) return;

  const chapters = chapterData[currentCardId];
  const currentIndex = chapters.findIndex(ch => ch.chapterNumber === currentChapterData.chapterNumber);
  if (currentIndex > 0) {
    currentChapterData = chapters[currentIndex - 1];
    openReadModal(currentChapterData);
  }
}

function goToNextChapter() {
  if (!currentCardId || !currentChapterData) return;

  const chapters = chapterData[currentCardId];
  const currentIndex = chapters.findIndex(ch => ch.chapterNumber === currentChapterData.chapterNumber);
  if (currentIndex < chapters.length - 1) {
    currentChapterData = chapters[currentIndex + 1];
    openReadModal(currentChapterData);
  }
}

function updateNavigationButtons(prevButton, nextButton) {
  if (!currentCardId || !currentChapterData) return;

  const chapters = chapterData[currentCardId];
  const currentIndex = chapters.findIndex(ch => ch.chapterNumber === currentChapterData.chapterNumber);

  if (currentIndex <= 0) {
    prevButton.disabled = true;
    prevButton.classList.add('disabled');
  } else {
    prevButton.disabled = false;
    prevButton.classList.remove('disabled');
  }

  if (currentIndex >= chapters.length - 1) {
    nextButton.disabled = true;
    nextButton.classList.add('disabled');
  } else {
    nextButton.disabled = false;
    nextButton.classList.remove('disabled');
  }
}