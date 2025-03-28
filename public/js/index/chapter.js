let chapterData = {}; // Khởi tạo rỗng, sẽ được cập nhật từ API
let currentChapterData = null;
let currentCardId = null;
let originalChapters = []; // Lưu trữ danh sách chương gốc để tìm kiếm

document.addEventListener('DOMContentLoaded', async function() {
    if (window.chapterInitialized) return;
    window.chapterInitialized = true;

    // Lấy dữ liệu chapters từ server
    try {
        const response = await fetch('http://localhost:3000/api/chapters');
        if (!response.ok) throw new Error('Lỗi khi lấy dữ liệu từ API');
        chapterData = await response.json();
        console.log('Chapter data loaded:', chapterData);
        if (Object.keys(chapterData).length === 0) console.warn('Không có dữ liệu chapters!');
    } catch (error) {
        console.error('Lỗi khi lấy chapterData:', error);
        chapterData = {}; // Đặt mặc định rỗng nếu lỗi
    }

    console.log("chapter.js đã được tải");

    const cardModal = document.getElementById('card');
    if (cardModal) {
        cardModal.addEventListener('show.bs.modal', function(event) {
            const comicId = currentCardData ? currentCardData.id : null;
            if (comicId) {
                currentCardId = comicId;
                originalChapters = chapterData[currentCardId] || [];
                displayChapters(originalChapters);
            }
        });
        cardModal.addEventListener('hidden.bs.modal', function() {
            console.log("Modal #card đã đóng");
            resetModalState();
            // Reset thanh tìm kiếm khi đóng modal
            const searchInput = document.getElementById('chapterSearchInput');
            if (searchInput) searchInput.value = '';
        });
    }

    // Gắn sự kiện tìm kiếm
    const chapterSearchForm = document.getElementById('chapterSearchForm');
    if (chapterSearchForm) {
        chapterSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            searchChapters();
        });

        // Tìm kiếm theo thời gian thực khi người dùng nhập
        document.getElementById('chapterSearchInput').addEventListener('input', searchChapters);
    }

    setupChapterModalBehavior();
});

// Hàm thiết lập hành vi modal
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

// Hàm reset trạng thái modal
function resetModalState() {
    console.log("Reset trạng thái modal");
    document.body.classList.remove('modal-open');
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
}

// Hàm hiển thị danh sách chapters
function displayChapters(chapters) {
    const accordion = document.getElementById('chapterAccordion');
    if (!accordion) {
        console.error('Không tìm thấy accordion!');
        return;
    }

    accordion.innerHTML = '';

    if (chapters.length === 0) {
        accordion.innerHTML = '<p class="text-center">Không có chương nào cho truyện này.</p>';
        return;
    }

    chapters.forEach((chapter, index) => {
        const chapterId = `collapseChapter${chapter.chapterNumber}`;
        const isFirst = index === 0 ? 'show' : ''; // Mở chương đầu tiên mặc định
        const row = `
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button ${isFirst ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#${chapterId}" aria-expanded="${isFirst ? 'true' : 'false'}" aria-controls="${chapterId}">
                        Chương ${chapter.chapterNumber}
                    </button>
                </h2>
                <div id="${chapterId}" class="accordion-collapse collapse ${isFirst}" data-bs-parent="#chapterAccordion">
                    <div class="accordion-body">
                        <button type="button" class="btn btn-primary read-chapter-btn" data-chapter-number="${chapter.chapterNumber}" data-card-id="${currentCardId}">Đọc truyện</button>
                        <strong>${chapter.chapterTitle || 'N/A'}</strong> ${chapter.content || 'N/A'}
                    </div>
                </div>
            </div>
        `;
        accordion.insertAdjacentHTML('beforeend', row);
    });

    // Gắn sự kiện cho các nút "Đọc truyện"
    document.querySelectorAll('.read-chapter-btn').forEach(button => {
        button.addEventListener('click', function() {
            const cardId = this.dataset.cardId;
            const chapterNumber = this.dataset.chapterNumber;
            openReadModal(chapterData[cardId].find(ch => ch.chapterNumber == chapterNumber));
        });
    });
}

// Hàm tìm kiếm chương
function searchChapters() {
    const searchTerm = document.getElementById('chapterSearchInput').value.trim().toLowerCase();
    let filteredChapters = [];

    if (searchTerm === '') {
        filteredChapters = originalChapters; // Hiển thị tất cả nếu không có từ khóa
    } else {
        // Lọc các chương khớp với từ khóa (theo chapterNumber hoặc chapterTitle)
        filteredChapters = originalChapters.filter(chapter => {
            const chapterNumber = chapter.chapterNumber.toString().toLowerCase();
            const chapterTitle = chapter.chapterTitle ? chapter.chapterTitle.toLowerCase() : '';
            return chapterNumber.includes(searchTerm) || chapterTitle.includes(searchTerm);
        });

        // Sắp xếp: các mục khớp với từ khóa lên đầu
        filteredChapters.sort((a, b) => {
            const aNumber = a.chapterNumber.toString().toLowerCase();
            const bNumber = b.chapterNumber.toString().toLowerCase();
            const aTitle = a.chapterTitle ? a.chapterTitle.toLowerCase() : '';
            const bTitle = b.chapterTitle ? b.chapterTitle.toLowerCase() : '';
            const aMatch = aNumber.includes(searchTerm) || aTitle.includes(searchTerm);
            const bMatch = bNumber.includes(searchTerm) || bTitle.includes(searchTerm);
            if (aMatch && !bMatch) return -1;
            if (!aMatch && bMatch) return 1;
            return 0;
        });
    }

    displayChapters(filteredChapters); // Hiển thị danh sách đã lọc
}

// Hàm mở modal đọc truyện
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

    const contentContainer = document.createElement('div');
    contentContainer.id = 'chapter-content';

    // Xử lý hiển thị ảnh từ imageLink hoặc imageFolder
    if (chapter.imageLink && chapter.imageCount > 0) {
        let baseImageLink = chapter.imageLink;
        if (!baseImageLink.includes('raw.githubusercontent.com') && baseImageLink.includes('github.com') && baseImageLink.includes('/blob/')) {
            baseImageLink = baseImageLink
                .replace('github.com', 'raw.githubusercontent.com')
                .replace('/blob/', '/');
        }

        for (let i = 1; i <= chapter.imageCount; i++) {
            const img = document.createElement('img');
            const imageUrl = baseImageLink.replace(/page%20\(\d+\)\.jpg/, `page%20(${i}).jpg`);
            img.src = imageUrl;
            img.className = 'd-block mx-auto mb-3';
            img.alt = `Trang ${i} - Chương ${chapter.chapterNumber}`;
            img.style.maxWidth = '100%';
            img.onerror = function() {
                this.src = 'https://via.placeholder.com/300x500?text=Image+Not+Found';
                this.alt = 'Hình ảnh không tải được';
            };
            contentContainer.appendChild(img);
        }
    } else if (chapter.imageFolder && chapter.imageCount > 0) {
        let baseFolderLink = chapter.imageFolder;
        if (baseFolderLink.includes('github.com') && baseFolderLink.includes('/tree/')) {
            baseFolderLink = baseFolderLink
                .replace('github.com', 'raw.githubusercontent.com')
                .replace('/tree/', '/');
        }

        for (let i = 1; i <= chapter.imageCount; i++) {
            const img = document.createElement('img');
            img.src = `${baseFolderLink}/page (${i}).jpg`;
            img.className = 'd-block mx-auto mb-3';
            img.alt = `Trang ${i} - Chương ${chapter.chapterNumber}`;
            img.style.maxWidth = '100%';
            img.onerror = function() {
                this.src = 'https://via.placeholder.com/300x500?text=Image+Not+Found';
                this.alt = 'Hình ảnh không tải được';
            };
            contentContainer.appendChild(img);
        }
    } else {
        contentContainer.textContent = chapter.content || 'Không có nội dung.';
    }

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

    modalFooter.innerHTML = '';
    modalFooter.className = 'modal-footer d-flex justify-content-between align-items-center';

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

    const centerGroup = document.createElement('div');
    centerGroup.className = 'd-flex align-items-center';

    const prevButton = document.createElement('button');
    prevButton.type = 'button';
    prevButton.className = 'btn btn-secondary me-2';
    prevButton.textContent = 'Chương trước';
    prevButton.addEventListener('click', goToPreviousChapter);

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

    modalFooter.appendChild(leftGroup);
    modalFooter.appendChild(centerGroup);

    updateNavigationButtons(prevButton, nextButton);

    showModal(modal);
}

// Hàm hiển thị modal
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

// Hàm chuyển đến chương trước
function goToPreviousChapter() {
    if (!currentCardId || !currentChapterData) return;

    const chapters = chapterData[currentCardId];
    const currentIndex = chapters.findIndex(ch => ch.chapterNumber === currentChapterData.chapterNumber);
    if (currentIndex > 0) {
        currentChapterData = chapters[currentIndex - 1];
        openReadModal(currentChapterData);
    }
}

// Hàm chuyển đến chương tiếp theo
function goToNextChapter() {
    if (!currentCardId || !currentChapterData) return;

    const chapters = chapterData[currentCardId];
    const currentIndex = chapters.findIndex(ch => ch.chapterNumber === currentChapterData.chapterNumber);
    if (currentIndex < chapters.length - 1) {
        currentChapterData = chapters[currentIndex + 1];
        openReadModal(currentChapterData);
    }
}

// Hàm cập nhật trạng thái nút điều hướng
function updateNavigationButtons(prevButton, nextButton) {
    if (!currentCardId || !currentChapterData) return;

    const chapters = chapterData[currentCardId];
    const currentIndex = chapters.findIndex(ch => ch.chapterNumber === currentChapterData.chapterNumber);

    prevButton.disabled = currentIndex <= 0;
    prevButton.classList.toggle('disabled', currentIndex <= 0);

    nextButton.disabled = currentIndex >= chapters.length - 1;
    nextButton.classList.toggle('disabled', currentIndex >= chapters.length - 1);
}