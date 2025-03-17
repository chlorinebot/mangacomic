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

  // Thêm nội dung truyện
  const contentContainer = document.createElement('div');
  contentContainer.id = 'chapter-content';
  if (chapter.imageFolder && chapter.imageCount > 0) {
    for (let i = 1; i <= chapter.imageCount; i++) {
      const img = document.createElement('img');
      img.src = `${chapter.imageFolder}/page (${i}).jpg`;
      img.className = 'd-block mx-auto mb-3';
      img.alt = `Trang ${i} - Chương ${chapter.chapterNumber}`;
      img.style.maxWidth = '100%';
      contentContainer.appendChild(img);
    }
  } else {
    contentContainer.textContent = chapter.content;
  }

  // Thêm phần bình luận (ẩn mặc định)
  const commentSection = document.createElement('div');
  commentSection.id = 'comment-section';
  commentSection.className = 'mt-3';
  commentSection.style.display = 'none';

  modalBody.appendChild(contentContainer);
  modalBody.appendChild(commentSection);

  modalFooter.innerHTML = '';
  modalFooter.className = 'modal-footer d-flex justify-content-between';

  const leftGroup = document.createElement('div');
  leftGroup.className = 'd-flex align-items-center';

  const ratingContainer = document.createElement('div');
  ratingContainer.className = 'd-flex align-items-center me-3';
  ratingContainer.innerHTML = `${generateStarRating(chapter.rating)} <span class="ms-2">${chapter.rating}/5</span>`;

  const commentButton = document.createElement('button');
  commentButton.type = 'button';
  commentButton.className = 'btn btn-outline-primary';
  commentButton.innerHTML = `<i class="bi bi-chat"></i> Bình luận (${chapter.commentCount || 0})`;
  commentButton.addEventListener('click', function() {
    if (commentSection.style.display === 'none') {
      displayComments(commentSection, chapter);
      commentSection.style.display = 'block';
      contentContainer.style.display = 'none';
      commentButton.textContent = 'Quay lại truyện';
    } else {
      commentSection.style.display = 'none';
      contentContainer.style.display = 'block';
      commentButton.innerHTML = `<i class="bi bi-chat"></i> Bình luận (${chapter.commentCount || 0})`;
    }
  });

  leftGroup.appendChild(ratingContainer);
  leftGroup.appendChild(commentButton);

  const rightGroup = document.createElement('div');
  rightGroup.className = 'd-flex align-items-center';

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

  rightGroup.appendChild(prevButton);
  rightGroup.appendChild(nextButton);

  modalFooter.appendChild(leftGroup);
  modalFooter.appendChild(rightGroup);

  updateNavigationButtons(prevButton, nextButton);

  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();
}

function displayComments(commentSection, chapter) {
  const comments = (commentData[currentCardId] && commentData[currentCardId][chapter.chapterNumber]) || [];
  commentSection.innerHTML = `
    <div class="position-sticky top-0 bg-white p-2" style="z-index: 10;">
      <h5>Bình luận (${chapter.commentCount || 0})</h5>
    </div>
    <div class="comment-list" style="max-height: 50vh; overflow-y: auto;">
      ${comments.length === 0 ? '<p>Chưa có bình luận nào.</p>' : ''}
    </div>
    <div class="comment-form p-3 bg-light position-sticky bottom-0" style="z-index: 10;">
      <form>
        <div class="mb-3">
          <label for="new-comment" class="form-label">Bình luận của bạn:</label>
          <textarea class="form-control" id="new-comment" rows="3" placeholder="Nhập bình luận..."></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label">Đánh giá:</label>
          <select class="form-select w-auto d-inline-block" id="new-rating">
            <option value="5">5 sao</option>
            <option value="4.5">4.5 sao</option>
            <option value="4">4 sao</option>
            <option value="3.5">3.5 sao</option>
            <option value="3">3 sao</option>
            <option value="2.5">2.5 sao</option>
            <option value="2">2 sao</option>
            <option value="1.5">1.5 sao</option>
            <option value="1">1 sao</option>
            <option value="0.5">0.5 sao</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary">Gửi bình luận</button>
      </form>
    </div>
  `;

  const commentList = commentSection.querySelector('.comment-list');
  comments.forEach(comment => {
    const toast = document.createElement('div');
    toast.className = 'toast show mb-3';
    toast.innerHTML = `
      <div class="toast-header">
        <strong class="me-auto">${comment.username}</strong>
        <div class="d-flex align-items-center">
          ${generateStarRating(comment.rating)}
          <span class="ms-2">${comment.rating}</span>
        </div>
      </div>
      <div class="toast-body">
        <p>${comment.comment}</p>
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <button class="btn btn-sm btn-outline-success me-2 like-btn" data-comment-id="${comment.id}">
              <i class="bi bi-hand-thumbs-up"></i> ${comment.likes}
            </button>
            <button class="btn btn-sm btn-outline-danger dislike-btn" data-comment-id="${comment.id}">
              <i class="bi bi-hand-thumbs-down"></i> ${comment.dislikes}
            </button>
          </div>
          <button class="btn btn-sm btn-outline-primary reply-btn" data-comment-id="${comment.id}">Trả lời</button>
        </div>
        <div class="replies mt-2" id="replies-${comment.id}"></div>
      </div>
    `;
    commentList.appendChild(toast);

    const repliesContainer = toast.querySelector(`#replies-${comment.id}`);
    comment.replies.forEach(reply => {
      const replyToast = document.createElement('div');
      replyToast.className = 'toast show ms-3 mb-2';
      replyToast.innerHTML = `
        <div class="toast-header">
          <strong class="me-auto">${reply.username}</strong>
        </div>
        <div class="toast-body">${reply.comment}</div>
      `;
      repliesContainer.appendChild(replyToast);
    });
  });

  // Sự kiện cho các nút
  commentList.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const commentId = parseInt(this.getAttribute('data-comment-id'));
      const comment = comments.find(c => c.id === commentId);
      comment.likes++;
      this.innerHTML = `<i class="bi bi-hand-thumbs-up"></i> ${comment.likes}`;
    });
  });

  commentList.querySelectorAll('.dislike-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const commentId = parseInt(this.getAttribute('data-comment-id'));
      const comment = comments.find(c => c.id === commentId);
      comment.dislikes++;
      this.innerHTML = `<i class="bi bi-hand-thumbs-down"></i> ${comment.dislikes}`;
    });
  });

  commentList.querySelectorAll('.reply-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const commentId = parseInt(this.getAttribute('data-comment-id'));
      const replyText = prompt('Nhập câu trả lời của bạn:');
      if (replyText) {
        const comment = comments.find(c => c.id === commentId);
        const newReply = {
          id: comment.replies.length + 1,
          username: "Bạn",
          comment: replyText
        };
        comment.replies.push(newReply);
        displayComments(commentSection, chapter);
      }
    });
  });

  const form = commentSection.querySelector('form');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const commentText = form.querySelector('#new-comment').value;
    const rating = parseFloat(form.querySelector('#new-rating').value);

    if (commentText) {
      const newComment = {
        id: comments.length + 1,
        username: "Bạn",
        rating: rating,
        comment: commentText,
        likes: 0,
        dislikes: 0,
        replies: []
      };
      if (!commentData[currentCardId]) commentData[currentCardId] = {};
      if (!commentData[currentCardId][chapter.chapterNumber]) commentData[currentCardId][chapter.chapterNumber] = [];
      commentData[currentCardId][chapter.chapterNumber].push(newComment);
      chapter.commentCount++;
      commentButton.innerHTML = `<i class="bi bi-chat"></i> Bình luận (${chapter.commentCount})`;
      displayComments(commentSection, chapter);
      form.querySelector('#new-comment').value = '';
    }
  });
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