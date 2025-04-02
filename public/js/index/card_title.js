// card_title.js
let cardData = []; // Danh sách truyện
let originalCardData = []; // Lưu trữ dữ liệu gốc để lọc
let genres = []; // Danh sách thể loại
let currentCardData = null;

document.addEventListener('DOMContentLoaded', async function() {
    if (window.cardInitialized) return;
    window.cardInitialized = true;

    // Lấy danh sách thể loại từ API
    try {
        const genreResponse = await fetch('http://localhost:3000/api/genres');
        if (!genreResponse.ok) throw new Error('Lỗi khi lấy danh sách thể loại');
        genres = await genreResponse.json();
        console.log('Genres loaded:', genres);
        populateGenreDropdown(); // Đổ danh sách thể loại vào dropdown
    } catch (error) {
        console.error('Lỗi khi lấy danh sách thể loại:', error);
        genres = [];
    }

    // Lấy danh sách truyện từ API
    try {
        const cardResponse = await fetch('http://localhost:3000/api/cards');
        if (!cardResponse.ok) throw new Error('Lỗi khi lấy danh sách truyện');
        cardData = await cardResponse.json();
        originalCardData = [...cardData]; // Lưu trữ dữ liệu gốc
        console.log('Card data loaded:', cardData);
        if (cardData.length === 0) console.warn('Không có dữ liệu truyện!');
    } catch (error) {
        console.error('Lỗi khi lấy cardData:', error);
        cardData = [];
        originalCardData = [];
    }

    const cardContainer = document.querySelector('.row.row-cols-1.row-cols-md-6.g-4');
    if (!cardContainer) {
        console.error('Không tìm thấy container cho cards!');
        return;
    }

    const itemsPerPage = 12;
    const totalPages = Math.ceil(cardData.length / itemsPerPage);

    setupCardPagination();
    displayCardsForPage(1);

    setupCardModalBehavior();

    // Xử lý URL chia sẻ khi trang được tải
    handleShareLink();
});

// Hàm đổ danh sách thể loại vào dropdown
function populateGenreDropdown() {
    const genreDropdownMenu = document.getElementById('genreDropdownMenu');
    if (!genreDropdownMenu) {
        console.error('Không tìm thấy dropdown menu thể loại!');
        return;
    }

    // Thêm tùy chọn "Thể loại" để hiển thị toàn bộ truyện
    const defaultItem = document.createElement('li');
    defaultItem.innerHTML = '<a class="dropdown-item" href="#" data-genre-id="all">Tất cả</a>';
    genreDropdownMenu.appendChild(defaultItem);

    // Thêm các thể loại từ API
    genres.forEach(genre => {
        const li = document.createElement('li');
        li.innerHTML = `<a class="dropdown-item" href="#" data-genre-id="${genre.genre_id}">${genre.genre_name}</a>`;
        genreDropdownMenu.appendChild(li);
    });

    // Thêm sự kiện cho các mục trong dropdown
    genreDropdownMenu.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target;
        if (target.classList.contains('dropdown-item')) {
            const genreId = target.getAttribute('data-genre-id');
            filterCardsByGenre(genreId);
        }
    });
}

// Hàm lọc truyện theo thể loại
function filterCardsByGenre(genreId) {
    if (genreId === 'all') {
        cardData = [...originalCardData]; // Hiển thị tất cả truyện
    } else {
        cardData = originalCardData.filter(card => {
            const genreNames = card.genre_names ? card.genre_names.split(',') : [];
            const genre = genres.find(g => g.genre_id == genreId);
            return genre && genreNames.includes(genre.genre_name);
        });
    }

    // Cập nhật giao diện
    const itemsPerPage = 12;
    const totalPages = Math.ceil(cardData.length / itemsPerPage);
    setupCardPagination();
    displayCardsForPage(1);
}

// Hàm hiển thị card cho trang cụ thể
function displayCardsForPage(pageNumber) {
    const itemsPerPage = 12;
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
        img.src = data.image || 'https://via.placeholder.com/150?text=No+Image';
        img.alt = data.title;

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const cardTitle = document.createElement('h5');
        cardTitle.className = 'card-title';
        cardTitle.textContent = data.title;

        const cardText = document.createElement('p');
        cardText.className = 'card-text';
        cardText.textContent = data.content || 'Chưa có nội dung.';

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);

        cardDiv.appendChild(img);
        cardDiv.appendChild(cardBody);

        cardDiv.style.cursor = 'pointer';
        cardDiv.setAttribute('data-comic-id', data.id);
        cardDiv.addEventListener('click', function() {
            openCardModal(data);
        });

        colDiv.appendChild(cardDiv);
        cardContainer.appendChild(colDiv);
    });
}

// Hàm hiển thị tất cả card
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
        img.src = data.image || 'https://via.placeholder.com/150?text=No+Image';
        img.alt = data.title;

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const cardTitle = document.createElement('h5');
        cardTitle.className = 'card-title';
        cardTitle.textContent = data.title;

        const cardText = document.createElement('p');
        cardText.className = 'card-text';
        cardText.textContent = data.content || 'Chưa có nội dung.';

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);

        cardDiv.appendChild(img);
        cardDiv.appendChild(cardBody);

        cardDiv.style.cursor = 'pointer';
        cardDiv.setAttribute('data-comic-id', data.id);
        cardDiv.addEventListener('click', function() {
            openCardModal(data);
        });

        colDiv.appendChild(cardDiv);
        cardContainer.appendChild(colDiv);
    });
}

// Hàm mở modal và hiển thị thông tin card
function openCardModal(data) {
    currentCardData = data;

    const newUrl = `${window.location.origin}/?comicId=${data.id}`;
    window.history.pushState({ comicId: data.id }, '', newUrl);

    console.log('Data passed to modal:', data);

    const modal = document.getElementById('card');
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');

    modalTitle.textContent = data.title;

    const cardImg = modalBody.querySelector('#comicImage');
    if (cardImg) {
        cardImg.src = data.image || 'https://via.placeholder.com/150?text=No+Image';
        cardImg.alt = data.title;
    }

    const cardTitle = modalBody.querySelector('#comicTitle');
    if (cardTitle) {
        cardTitle.textContent = data.title;
    }

    const cardAuthor = modalBody.querySelector('#comicAuthor');
    if (cardAuthor) {
        cardAuthor.textContent = `Tác giả: ${data.author || data.content || 'Isayama Hajime'}`;
    }

    const cardGenre = modalBody.querySelector('#comicGenre');
    if (cardGenre) {
        const genreNames = data.genre_names && data.genre_names.trim() !== '' ? data.genre_names : 'Chưa có thể loại';
        cardGenre.textContent = `Thể loại: ${genreNames}`;
    } else {
        console.error('Không tìm thấy phần tử #comicGenre trong modal!');
    }

    const cardHashtags = modalBody.querySelector('#comicHashtagsContent');
    if (cardHashtags) {
        cardHashtags.textContent = data.hashtags || 'Chưa có hashtag';
    }

    const cardContent = modalBody.querySelector('#comicContent');
    if (cardContent) {
        cardContent.textContent = `Nội dung truyện: ${data.content || 'Chưa có nội dung.'}`;
    }

    modal.setAttribute('data-comic-id', data.id);

    const shareButton = modalBody.querySelector('#shareComicBtn');
    if (shareButton) {
        shareButton.onclick = function() {
            const shareUrl = `${window.location.origin}/?comicId=${data.id}`;
            navigator.clipboard.writeText(shareUrl).then(() => {
                alert('Link chia sẻ đã được sao chép: ' + shareUrl);
            }).catch(err => {
                console.error('Lỗi khi sao chép link:', err);
                alert('Không thể sao chép link. Vui lòng thử lại!');
            });
        };
    }

    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

// Hàm thiết lập phân trang
function setupCardPagination() {
    const paginationContainer = document.getElementById('paginationContainer');
    if (!paginationContainer) {
        console.error('Không tìm thấy phần tử paginationContainer!');
        return;
    }

    // Xóa phân trang cũ
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(cardData.length / 24);

    const ul = document.createElement('ul');
    ul.className = 'pagination';

    // Nút Previous
    const prevLi = document.createElement('li');
    prevLi.className = 'page-item';
    prevLi.innerHTML = '<a class="page-link" href="#">Previous</a>';
    ul.appendChild(prevLi);

    // Các trang số
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === 1 ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        ul.appendChild(li);
    }

    // Nút Next
    const nextLi = document.createElement('li');
    nextLi.className = 'page-item';
    nextLi.innerHTML = '<a class="page-link" href="#">Next</a>';
    ul.appendChild(nextLi);

    paginationContainer.appendChild(ul);

    // Thêm sự kiện cho các nút phân trang
    const pageLinks = Array.from(paginationContainer.querySelectorAll('.page-item:not(:first-child):not(:last-child)'));
    const prevButton = paginationContainer.querySelector('.page-item:first-child');
    const nextButton = paginationContainer.querySelector('.page-item:last-child');

    pageLinks.forEach((item, index) => {
        const pageLink = item.querySelector('.page-link');
        pageLink.addEventListener('click', function(event) {
            event.preventDefault();
            pageLinks.forEach(pageItem => pageItem.classList.remove('active'));
            item.classList.add('active');
            displayCardsForPage(index + 1);
            updateCardPrevNextState();
        });
    });

    prevButton.addEventListener('click', function(event) {
        event.preventDefault();
        if (!this.classList.contains('disabled')) {
            const activeIndex = pageLinks.findIndex(item => item.classList.contains('active'));
            if (activeIndex > 0) {
                pageLinks[activeIndex].classList.remove('active');
                pageLinks[activeIndex - 1].classList.add('active');
                displayCardsForPage(activeIndex);
                updateCardPrevNextState();
            }
        }
    });

    nextButton.addEventListener('click', function(event) {
        event.preventDefault();
        if (!this.classList.contains('disabled')) {
            const activeIndex = pageLinks.findIndex(item => item.classList.contains('active'));
            if (activeIndex < pageLinks.length - 1) {
                pageLinks[activeIndex].classList.remove('active');
                pageLinks[activeIndex + 1].classList.add('active');
                displayCardsForPage(activeIndex + 2);
                updateCardPrevNextState();
            }
        }
    });

    updateCardPrevNextState();

    function updateCardPrevNextState() {
        const activeIndex = pageLinks.findIndex(item => item.classList.contains('active'));
        prevButton.classList.toggle('disabled', activeIndex <= 0);
        nextButton.classList.toggle('disabled', activeIndex >= pageLinks.length - 1);
    }
}

// Hàm thiết lập hành vi modal
function setupCardModalBehavior() {
    const docTruyenModal = document.getElementById('doctruyen');
    const cardModal = document.getElementById('card');

    if (docTruyenModal && !docTruyenModal.hasCardModalListener) {
        docTruyenModal.hasCardModalListener = true;
        docTruyenModal.addEventListener('hidden.bs.modal', function() {
            if (currentCardData) {
                const cardBsModal = new bootstrap.Modal(cardModal);
                cardBsModal.show();
            }
        });
    }

    if (cardModal && !cardModal.hasCardCloseListener) {
        cardModal.hasCardCloseListener = true;
        cardModal.addEventListener('hidden.bs.modal', function() {
            const homeUrl = `${window.location.origin}/`;
            window.history.pushState({}, '', homeUrl);

            document.body.classList.remove('modal-open');
            const modalBackdrops = document.querySelectorAll('.modal-backdrop');
            modalBackdrops.forEach(backdrop => backdrop.remove());
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        });
    }
}

// Hàm xử lý URL chia sẻ
function handleShareLink() {
    const urlParams = new URLSearchParams(window.location.search);
    const comicId = urlParams.get('comicId');
    const chapterId = urlParams.get('chapterId');

    if (comicId) {
        const comic = cardData.find(data => data.id == comicId);
        if (comic) {
            openCardModal(comic);

            if (chapterId && window.chapterData && chapterData[comicId]) {
                const chapter = chapterData[comicId].find(ch => ch.chapterNumber == chapterId);
                if (chapter) {
                    currentCardData = comic;
                    openReadModal(chapter);
                } else {
                    console.error('Không tìm thấy chương với chapterId:', chapterId);
                    alert('Không tìm thấy chương với ID này!');
                }
            }
        } else {
            console.error('Không tìm thấy truyện với ID:', comicId);
            window.location.href = '/404';
        }
    }
}