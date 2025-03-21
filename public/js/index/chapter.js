let chapterData = {}; // Khởi tạo rỗng, sẽ được cập nhật từ API
let currentChapterData = null;
let currentCardId = null;

document.addEventListener('DOMContentLoaded', async function() {
    if (window.chapterInitialized) return;
    window.chapterInitialized = true;

    // Lấy dữ liệu chapters từ server
    try {
        const response = await fetch('https://truyencuatuan.up.railway.app/api/chapters');
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
        chapterContent.innerHTML = `<strong>${chapter.chapterTitle}</strong> ${chapter.content || ''}`;

        accordionBody.appendChild(readButton);
        accordionBody.appendChild(chapterContent);
        accordionCollapse.appendChild(accordionBody);
        accordionHeader.appendChild(accordionButton);
        accordionItem.appendChild(accordionHeader);
        accordionItem.appendChild(accordionCollapse);
        accordion.appendChild(accordionItem);
    });
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
        // Xử lý imageLink (URL raw GitHub)
        // Ví dụ: https://raw.githubusercontent.com/chlorinebot/image-comic/refs/heads/main/images/attackontitan/chapter1/page%20(1).jpg
        let baseImageLink = chapter.imageLink;

        // Nếu không phải raw URL, chuyển từ blob sang raw (nếu cần)
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
        // Xử lý imageFolder (đường dẫn thư mục GitHub)
        // Ví dụ: https://github.com/chlorinebot/image-comic/tree/main/images/attackontitan/chapter1
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
        // Nếu không có hình ảnh, hiển thị nội dung văn bản
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