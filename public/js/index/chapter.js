let chapterData = {}; // Khởi tạo rỗng, sẽ được cập nhật từ API
let currentChapterData = null;
let currentCardId = null;
let originalChapters = []; // Lưu trữ danh sách chương gốc để tìm kiếm

document.addEventListener('DOMContentLoaded', async function() {
    if (window.chapterInitialized) return;
    window.chapterInitialized = true;

    // Lấy dữ liệu chapters từ server
    try {
        // Sử dụng ApiService thay vì gọi fetch trực tiếp
        chapterData = await ApiService.getChapters();
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

                // Thêm sự kiện cho nút "Đọc từ đầu"
                const readFromStartBtn = document.getElementById('readFromStartBtn');
                if (readFromStartBtn) {
                    readFromStartBtn.addEventListener('click', function() {
                        if (originalChapters.length > 0) {
                            const firstChapter = originalChapters[0]; // Chương đầu tiên
                            openReadModal(firstChapter);
                        } else {
                            alert('Không có chương nào để đọc!');
                        }
                    });
                }

                // Thêm sự kiện cho nút "Đọc chương mới nhất"
                const readLatestChapterBtn = document.getElementById('readLatestChapterBtn');
                if (readLatestChapterBtn) {
                    readLatestChapterBtn.addEventListener('click', function() {
                        if (originalChapters.length > 0) {
                            const latestChapter = originalChapters[originalChapters.length - 1]; // Chương cuối cùng
                            openReadModal(latestChapter);
                        } else {
                            alert('Không có chương nào để đọc!');
                        }
                    });
                }
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

                // Cập nhật URL quay lại chỉ chứa comicId
                const comicUrl = `${window.location.origin}/?comicId=${currentCardData.id}`;
                window.history.pushState({ comicId: currentCardData.id }, '', comicUrl);
            }
            resetModalState();
        });
    }
}

// Hàm reset trạng thái modal
function resetModalState() {
    console.log("Reset trạng thái modal");
    // Đếm số lượng modal hiển thị
    const visibleModals = document.querySelectorAll('.modal.show').length;
    
    // Đảm bảo không có nhiều nút yêu thích bị trùng lặp
    if (visibleModals === 0) {
        // Không có modal nào đang hiển thị, có thể xóa nút yêu thích
        const favoriteButton = document.getElementById('favoriteComicBtn');
        if (favoriteButton) {
            favoriteButton.remove();
        }
    }
    
    // Xử lý các vấn đề khác của modal
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';

    // Xóa backdrop nếu còn sót lại
    const modalBackdrops = document.querySelectorAll('.modal-backdrop');
    modalBackdrops.forEach(backdrop => backdrop.remove());
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

    // Cập nhật URL với comicId và chapterId
    const newUrl = `${window.location.origin}/?comicId=${currentCardId}&chapterId=${chapter.chapterNumber}`;
    window.history.pushState({ comicId: currentCardId, chapterId: chapter.chapterNumber }, '', newUrl);

    console.log("Modal #doctruyen tồn tại và đang chuẩn bị mở");
    
    // Xóa nút yêu thích cũ trước khi mở modal đọc truyện
    const favoriteButton = document.getElementById('favoriteComicBtn');
    if (favoriteButton) {
        console.log("Xóa nút yêu thích trước khi mở modal đọc truyện");
        favoriteButton.remove();
    }
    
    // Lưu lịch sử đọc truyện nếu đã đăng nhập
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decoded = jwt_decode(token);
            const userId = decoded.id;
            saveReadingHistory(userId, currentCardId, chapter.chapterNumber);
        } catch (error) {
            console.error('Lỗi khi giải mã token:', error);
        }
    } else {
        console.log('Người dùng chưa đăng nhập, không lưu lịch sử đọc');
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
        // Thiết lập backdrop: false để không tạo backdrop cho modal đọc truyện
        const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement, { backdrop: false, keyboard: true });
        modalInstance.show();
        console.log("Modal #doctruyen đã được mở thành công");
        
        // Xóa backdrop của modal đọc truyện nếu có
        setTimeout(() => {
            const doctruyenZIndex = parseInt(modalElement.style.zIndex || '1050');
            const doctruyenBackdropZIndex = doctruyenZIndex - 1;
            
            document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
                const backdropZIndex = parseInt(backdrop.style.zIndex || '1040');
                if (backdropZIndex === doctruyenBackdropZIndex) {
                    backdrop.remove();
                }
            });
        }, 10);
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

// Hàm lưu lịch sử đọc truyện
async function saveReadingHistory(userId, cardId, chapterId) {
    if (!userId) {
        console.log('Người dùng chưa đăng nhập, không lưu lịch sử đọc');
        return;
    }

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('Không tìm thấy token, không lưu lịch sử đọc');
            return;
        }

        // Tìm chapter_id thực tế (id trong bảng chapters) dựa vào chapter_number
        const chapterResponse = await fetch(`/api/chapters/${cardId}/${chapterId}`);
        if (!chapterResponse.ok) {
            throw new Error('Không thể lấy thông tin chapter');
        }
        
        const chapterData = await chapterResponse.json();
        const actualChapterId = chapterData.id; // Lấy ID thực tế của chapter từ database
        
        // Gọi API để lưu lịch sử đọc
        const response = await fetch('/api/reading-history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                user_id: userId,
                card_id: cardId,
                chapter_id: actualChapterId
            })
        });

        if (!response.ok) {
            throw new Error('Không thể lưu lịch sử đọc');
        }

        console.log('Đã lưu lịch sử đọc truyện');
    } catch (error) {
        console.error('Lỗi khi lưu lịch sử đọc truyện:', error);
    }
}

// Hàm tải và hiển thị chapter
async function loadChapter(cardId, chapterId) {
    console.log(`Đang tải chương ${chapterId} của truyện ${cardId}`);
    
    try {
        // Cập nhật URL để có thể F5 tải lại đúng trang
        const newUrl = `/?comicId=${cardId}&chapterId=${chapterId}`;
        window.history.pushState({ cardId, chapterId }, "", newUrl);
        
        // Lấy thông tin userId từ token nếu đã đăng nhập
        let userId = null;
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwt_decode(token);
            userId = decoded.id;
        }
        
        // Hiển thị loading spinner
        document.getElementById('chapterContentContainer').innerHTML = `
            <div class="text-center my-5 py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-3">Đang tải nội dung chương...</p>
            </div>
        `;
        
        // Lưu lịch sử đọc nếu người dùng đã đăng nhập
        if (userId) {
            saveReadingHistory(userId, cardId, chapterId);
        }
        
        // Tiếp tục tải nội dung chapter...
    } catch (error) {
        console.error('Lỗi khi tải chương:', error);
    }
}