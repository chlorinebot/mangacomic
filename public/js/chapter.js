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

// Biến toàn cục
let currentChapterData = null;
let currentCardId = null;

document.addEventListener('DOMContentLoaded', function() {
  if (window.chapterInitialized) return;
  window.chapterInitialized = true;

  console.log("chapter.js đã được tải");

  const cardModal = document.getElementById('card');
  if (cardModal) {
    cardModal.addEventListener('show.bs.modal', function() {
      if (currentCardData && currentCardData.id) {
        currentCardId = currentCardData.id;
        displayChapters(currentCardId);
      }
    });
    cardModal.addEventListener('hidden.bs.modal', function() {
      console.log("Modal #card đã đóng");
      resetModalState();
    });
  }
  setupChapterModalBehavior();
});

function setupChapterModalBehavior() {
  const readModal = document.getElementById('doctruyen');
  if (readModal && !readModal.hasChapterListener) {
    readModal.hasChapterListener = true;
    readModal.addEventListener('hidden.bs.modal', function() {
      console.log("Modal #doctruyen đã đóng");
      const cardModal = document.getElementById('card');
      if (currentCardData) {
        const cardBsModal = new bootstrap.Modal(cardModal);
        cardBsModal.show();
      }
      resetModalState();
    });
  }
}

function resetModalState() {
  console.log("Reset trạng thái modal");
  document.body.classList.remove('modal-open');
  const backdrops = document.querySelectorAll('.modal-backdrop');
  backdrops.forEach(backdrop => backdrop.remove());
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
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
      console.log(`Chuẩn bị mở chương ${chapter.chapterNumber}`);
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
  currentCardId = currentCardData ? currentCardData.id : currentCardId;

  const modal = document.getElementById('doctruyen');
  if (!modal) {
    console.error('Không tìm thấy modal #doctruyen trong DOM!');
    return;
  }

  console.log("Modal #doctruyen tồn tại trong DOM");

  const modalTitle = modal.querySelector('.modal-title');
  const modalBody = modal.querySelector('.modal-body');
  const modalFooter = modal.querySelector('.modal-footer');

  modalTitle.textContent = `Chương ${chapter.chapterNumber} - ${chapter.chapterTitle}`;
  modalBody.innerHTML = '';

  // Nội dung truyện
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

  // Phần bình luận (ẩn mặc định)
  const commentSection = document.createElement('div');
  commentSection.id = 'comment-section';
  commentSection.className = 'mt-3';
  commentSection.style.display = 'none';
  commentSection.innerHTML = `
    <h5>Bình luận (${chapter.commentCount || 0})</h5>
    <p>Chưa có bình luận nào.</p>
    <form class="mt-3">
      <textarea class="form-control mb-2" rows="3" placeholder="Viết bình luận..."></textarea>
      <button type="submit" class="btn btn-primary">Gửi</button>
    </form>
  `;

  modalBody.appendChild(contentContainer);
  modalBody.appendChild(commentSection);

  // Footer: Nút điều hướng, danh sách chương, và bình luận
  modalFooter.innerHTML = '';
  modalFooter.className = 'modal-footer d-flex justify-content-between align-items-center';

  // Nhóm nút bên trái (bình luận)
  const leftGroup = document.createElement('div');
  const commentButton = document.createElement('button');
  commentButton.type = 'button';
  commentButton.className = 'btn btn-outline-primary';
  commentButton.innerHTML = `<i class="bi bi-chat"></i> Bình luận (${chapter.commentCount || 0})`;
  commentButton.addEventListener('click', function() {
    if (commentSection.style.display === 'none') {
      commentSection.style.display = 'block';
      contentContainer.style.display = 'none';
      this.textContent = 'Quay lại truyện';
    } else {
      commentSection.style.display = 'none';
      contentContainer.style.display = 'block';
      this.innerHTML = `<i class="bi bi-chat"></i> Bình luận (${chapter.commentCount || 0})`;
    }
  });
  leftGroup.appendChild(commentButton);

  // Nhóm giữa (điều hướng và danh sách chương)
  const centerGroup = document.createElement('div');
  centerGroup.className = 'd-flex align-items-center';

  const prevButton = document.createElement('button');
  prevButton.type = 'button';
  prevButton.className = 'btn btn-secondary me-2';
  prevButton.textContent = 'Chương trước';
  prevButton.addEventListener('click', goToPreviousChapter);

  // List chương truyện (dropdown)
  const chapterListContainer = document.createElement('div');
  chapterListContainer.className = 'dropdown mx-2';
  const chapterListButton = document.createElement('button');
  chapterListButton.className = 'btn btn-secondary dropdown-toggle';
  chapterListButton.type = 'button';
  chapterListButton.setAttribute('data-bs-toggle', 'dropdown');
  chapterListButton.textContent = 'Danh sách chương';
  const chapterListMenu = document.createElement('ul');
  chapterListMenu.className = 'dropdown-menu';
  const chapters = chapterData[currentCardId] || [];
  chapters.forEach(ch => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = 'dropdown-item';
    a.href = '#';
    a.textContent = `Chương ${ch.chapterNumber} - ${ch.chapterTitle}`;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      openReadModal(ch);
    });
    li.appendChild(a);
    chapterListMenu.appendChild(li);
  });
  chapterListContainer.appendChild(chapterListButton);
  chapterListContainer.appendChild(chapterListMenu);

  const nextButton = document.createElement('button');
  nextButton.type = 'button';
  nextButton.className = 'btn btn-primary ms-2';
  nextButton.textContent = 'Chương tiếp theo';
  nextButton.addEventListener('click', goToNextChapter);

  centerGroup.appendChild(prevButton);
  centerGroup.appendChild(chapterListContainer);
  centerGroup.appendChild(nextButton);

  // Gắn các nhóm vào footer
  modalFooter.appendChild(leftGroup);
  modalFooter.appendChild(centerGroup);

  updateNavigationButtons(prevButton, nextButton);

  // Mở modal
  showModal(modal);
}

function showModal(modalElement) {
  console.log("Thử mở modal #doctruyen");
  if (!modalElement) {
    console.error("Modal element không tồn tại!");
    return;
  }

  modalElement.style.display = 'block';
  modalElement.classList.remove('fade');

  try {
    const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement, { backdrop: 'static', keyboard: false });
    modalInstance.show();
    console.log("Modal #doctruyen đã được mở thành công");
  } catch (error) {
    console.error("Lỗi khi mở modal:", error);
  }

  setTimeout(() => modalElement.classList.add('fade'), 100);
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

  prevButton.disabled = currentIndex <= 0;
  prevButton.classList.toggle('disabled', currentIndex <= 0);

  nextButton.disabled = currentIndex >= chapters.length - 1;
  nextButton.classList.toggle('disabled', currentIndex >= chapters.length - 1);
}