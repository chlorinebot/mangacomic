document.addEventListener('DOMContentLoaded', async function () {
    // Chỉ chạy nếu chưa được khởi tạo (để tránh xung đột với card_title.js)
    if (window.genreInitialized) {
        console.log('Genre.js: Đã được khởi tạo từ trước, bỏ qua');
        return;
    }
    window.genreInitialized = true;
    
    console.log('Genre.js: Đang khởi tạo dropdown thể loại...');
    
    // Lấy danh sách thể loại từ API
    try {
        // Sử dụng ApiService để lấy dữ liệu card nếu có
        let cards;
        if (typeof ApiService !== 'undefined' && typeof ApiService.getCards === 'function') {
            cards = await ApiService.getCards();
            console.log('Genre.js: Đã nhận được dữ liệu từ ApiService, có', cards.length, 'cards');
        } else {
            const response = await fetch('/api/cards');
            if (!response.ok) throw new Error('Lỗi khi lấy dữ liệu từ API');
            cards = await response.json();
            console.log('Genre.js: Đã nhận được dữ liệu từ API, có', cards.length, 'cards');
        }
        
        // Lưu dữ liệu card vào biến toàn cục để sử dụng sau này
        window.cardData = cards;

        // Lấy danh sách thể loại duy nhất (loại bỏ trùng lặp)
        // Xử lý cả trường hợp genre là mảng và trường hợp genre_names là chuỗi
        const allGenres = [];
        cards.forEach(card => {
            if (Array.isArray(card.genre)) {
                card.genre.forEach(g => {
                    if (g && !allGenres.includes(g)) {
                        allGenres.push(g);
                    }
                });
            } else if (card.genre_names) {
                // Xử lý trường hợp genre_names là chuỗi (phân tách bằng dấu phẩy)
                const genreArray = card.genre_names.split(',').map(g => g.trim());
                genreArray.forEach(g => {
                    if (g && !allGenres.includes(g)) {
                        allGenres.push(g);
                    }
                });
            } else if (card.genre_name) {
                if (card.genre_name && !allGenres.includes(card.genre_name)) {
                    allGenres.push(card.genre_name);
                }
            }
        });
        
        const genres = allGenres.sort(); // Sắp xếp theo bảng chữ cái
        console.log('Genre.js: Các thể loại đã tìm thấy:', genres);

        // Hiển thị thể loại trong dropdown
        const genreDropdown = document.getElementById('genreDropdownMenu');
        if (genreDropdown) {
            console.log('Genre.js: Đã tìm thấy genreDropdownMenu, bắt đầu thêm các mục');
            
            // Kiểm tra xem dropdown đã có mục nào chưa
            const existingItems = genreDropdown.querySelectorAll('.dropdown-item');
            if (existingItems.length > 0) {
                console.log('Genre.js: Dropdown đã có', existingItems.length, 'mục, bỏ qua để tránh trùng lặp');
                // Nếu đã có mục, có thể là card_title.js đã điền vào
                // Chỉ thêm sự kiện languageChanged để hỗ trợ đa ngôn ngữ
                addGenreTranslationSupport(genreDropdown);
                return;
            }
            
            // Xóa tất cả các mục cũ trước khi thêm mới (nếu đã có)
            genreDropdown.innerHTML = '';

            // Thêm mục "Tất cả" đầu tiên
            const allLi = document.createElement('li');
            const allA = document.createElement('a');
            allA.className = 'dropdown-item';
            allA.href = '#';
            allA.textContent = 'Tất cả';
            
            allA.setAttribute('data-original-genre', 'all');
            allA.addEventListener('click', function (e) {
                e.preventDefault();
                console.log('Genre.js: Đã chọn "Tất cả"');
                filterComicsByGenre('all');
            });
            allLi.appendChild(allA);
            genreDropdown.appendChild(allLi);

            // Thêm bản dịch cho các thể loại
            const genreTranslations = {
                'en': {
                    'Tất cả': 'All',
                    'Hành động': 'Action',
                    'Tình cảm': 'Romance',
                    'Hài hước': 'Comedy',
                    'Kinh dị': 'Horror',
                    'Viễn tưởng': 'Sci-Fi',
                    'Võ thuật': 'Martial Arts',
                    'Phiêu lưu': 'Adventure',
                    'Giả tưởng': 'Fantasy',
                    'Lịch sử': 'Historical',
                    'Học đường': 'School Life',
                    'Thể thao': 'Sports',
                    'Đời thường': 'Slice of Life',
                    'Trinh thám': 'Mystery',
                    'Siêu nhiên': 'Supernatural',
                    'Drama': 'Drama',
                    'Hậu tận thế': 'Post-Apocalyptic',
                    'Hành động viễn tưởng': 'Action Sci-Fi',
                    'Đam mỹ': 'Boys Love',
                    'Ẩm thực': 'Cooking',
                    'Khám phá': 'Exploration'
                    // Thêm các thể loại khác nếu cần
                },
                'zh': {
                    'Tất cả': '全部',
                    'Hành động': '动作',
                    'Tình cảm': '爱情',
                    'Hài hước': '喜剧',
                    'Kinh dị': '恐怖',
                    'Viễn tưởng': '科幻',
                    'Võ thuật': '武术',
                    'Phiêu lưu': '冒险',
                    'Giả tưởng': '奇幻',
                    'Lịch sử': '历史',
                    'Học đường': '校园',
                    'Thể thao': '体育',
                    'Đời thường': '日常',
                    'Trinh thám': '侦探',
                    'Siêu nhiên': '超自然',
                    'Drama': '戏剧',
                    'Hậu tận thế': '后末日',
                    'Hành động viễn tưởng': '动作科幻',
                    'Đam mỹ': '耽美',
                    'Ẩm thực': '美食',
                    'Khám phá': '探索'
                    // Thêm các thể loại khác nếu cần
                }
            };

            // Lấy ngôn ngữ hiện tại
            const currentLang = localStorage.getItem('language') || 'vi';

            // Thêm các thể loại từ API vào dropdown
            genres.forEach(genre => {
                if (!genre) return; // Bỏ qua nếu genre là null hoặc rỗng
                
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.className = 'dropdown-item';
                a.href = `#`;
                
                // Lưu trữ tên thể loại gốc (tiếng Việt) để sử dụng khi lọc
                a.setAttribute('data-original-genre', genre);
                
                // Hiển thị tên thể loại theo ngôn ngữ hiện tại
                if (currentLang === 'vi') {
                    a.textContent = genre;
                } else if (genreTranslations[currentLang] && genreTranslations[currentLang][genre]) {
                    a.textContent = genreTranslations[currentLang][genre];
                } else {
                    a.textContent = genre; // Mặc định nếu không có bản dịch
                }
                
                a.addEventListener('click', function (e) {
                    e.preventDefault();
                    // Sử dụng data-original-genre để lọc thay vì text hiển thị
                    const originalGenre = this.getAttribute('data-original-genre');
                    console.log('Genre.js: Đã chọn thể loại:', originalGenre);
                    filterComicsByGenre(originalGenre);
                });
                li.appendChild(a);
                genreDropdown.appendChild(li);
                console.log('Genre.js: Đã thêm thể loại:', genre);
            });

            addGenreTranslationSupport(genreDropdown);
            console.log('Genre.js: Đã thêm xong tất cả thể loại, tổng cộng', genreDropdown.querySelectorAll('.dropdown-item').length, 'mục');
        } else {
            console.error('Genre.js: Không tìm thấy phần tử #genreDropdownMenu');
        }
    } catch (error) {
        console.error('Genre.js: Lỗi khi lấy danh sách thể loại:', error);
    }
});

// Hàm thêm hỗ trợ dịch cho dropdown thể loại
function addGenreTranslationSupport(genreDropdown) {
    // Thêm bản dịch cho các thể loại
    const genreTranslations = {
        'en': {
            'Tất cả': 'All',
            'Hành động': 'Action',
            'Tình cảm': 'Romance',
            'Hài hước': 'Comedy',
            'Kinh dị': 'Horror',
            'Viễn tưởng': 'Sci-Fi',
            'Võ thuật': 'Martial Arts',
            'Phiêu lưu': 'Adventure',
            'Giả tưởng': 'Fantasy',
            'Lịch sử': 'Historical',
            'Học đường': 'School Life',
            'Thể thao': 'Sports',
            'Đời thường': 'Slice of Life',
            'Trinh thám': 'Mystery',
            'Siêu nhiên': 'Supernatural',
            'Drama': 'Drama',
            'Hậu tận thế': 'Post-Apocalyptic',
            'Hành động viễn tưởng': 'Action Sci-Fi',
            'Đam mỹ': 'Boys Love',
            'Ẩm thực': 'Cooking',
            'Khám phá': 'Exploration'
        },
        'zh': {
            'Tất cả': '全部',
            'Hành động': '动作',
            'Tình cảm': '爱情',
            'Hài hước': '喜剧',
            'Kinh dị': '恐怖',
            'Viễn tưởng': '科幻',
            'Võ thuật': '武术',
            'Phiêu lưu': '冒险',
            'Giả tưởng': '奇幻',
            'Lịch sử': '历史',
            'Học đường': '校园',
            'Thể thao': '体育',
            'Đời thường': '日常',
            'Trinh thám': '侦探',
            'Siêu nhiên': '超自然',
            'Drama': '戏剧',
            'Hậu tận thế': '后末日',
            'Hành động viễn tưởng': '动作科幻',
            'Đam mỹ': '耽美',
            'Ẩm thực': '美食',
            'Khám phá': '探索'
        }
    };
    
    // Đảm bảo các mục đã có đều có thuộc tính data-original-genre
    const items = genreDropdown.querySelectorAll('.dropdown-item');
    items.forEach(item => {
        if (!item.hasAttribute('data-original-genre')) {
            item.setAttribute('data-original-genre', item.textContent);
        }
    });
    
    // Thêm chức năng cập nhật ngôn ngữ cho dropdown khi chuyển đổi ngôn ngữ
    const languageChangedHandler = function(e) {
        // Lấy ngôn ngữ mới
        const newLang = e.detail.language;
        console.log('Genre.js: Ngôn ngữ đã thay đổi thành', newLang);
        
        // Cập nhật text cho tất cả các mục trong dropdown
        const items = genreDropdown.querySelectorAll('.dropdown-item');
        items.forEach(item => {
            const originalGenre = item.getAttribute('data-original-genre');
            if (originalGenre) {
                if (newLang === 'vi') {
                    item.textContent = originalGenre;
                } else if (genreTranslations[newLang] && genreTranslations[newLang][originalGenre]) {
                    item.textContent = genreTranslations[newLang][originalGenre];
                }
                // Nếu không có bản dịch, giữ nguyên
            }
        });
    };
    
    // Đăng ký sự kiện
    document.removeEventListener('languageChanged', languageChangedHandler); // Tránh đăng ký trùng lặp
    document.addEventListener('languageChanged', languageChangedHandler);
    
    console.log('Genre.js: Đã thêm hỗ trợ dịch cho dropdown thể loại');
}

// Hàm lọc truyện theo thể loại
function filterComicsByGenre(genre) {
    console.log('Genre.js: Đang lọc truyện theo thể loại:', genre);
    
    // Lấy dữ liệu card từ biến toàn cục
    const cardData = window.cardData;
    
    // Kiểm tra xem biến cardData có tồn tại không
    if (!cardData || !Array.isArray(cardData)) {
        console.error('Genre.js: Không có dữ liệu card hợp lệ!');
        return;
    }
    
    // Tìm container để hiển thị cards
    const cardContainer = document.querySelector('.row.row-cols-1.row-cols-md-6.g-4');
    if (!cardContainer) {
        console.error('Genre.js: Không tìm thấy container để hiển thị cards!');
        return;
    }
    
    if (genre === 'all') {
        // Nếu là "Tất cả", hiển thị lại toàn bộ
        displayCards(cardData);
        return;
    }
    
    // Lọc cards theo thể loại
    const filteredCards = cardData.filter(card => {
        // Xử lý trường hợp genre là mảng
        if (Array.isArray(card.genre)) {
            return card.genre.some(g => g.toLowerCase() === genre.toLowerCase());
        }
        // Xử lý trường hợp genre_names là chuỗi
        else if (card.genre_names) {
            const genreArray = card.genre_names.split(',').map(g => g.trim());
            return genreArray.some(g => g.toLowerCase() === genre.toLowerCase());
        }
        // Xử lý trường hợp genre_name là chuỗi
        else if (card.genre_name) {
            return card.genre_name.toLowerCase() === genre.toLowerCase();
        }
        return false;
    });
    
    console.log('Genre.js: Đã lọc được', filteredCards.length, 'truyện với thể loại', genre);
    
    // Hiển thị kết quả
    displayCards(filteredCards);
}

// Hàm hiển thị danh sách cards
function displayCards(cards) {
    const cardContainer = document.querySelector('.row.row-cols-1.row-cols-md-6.g-4');
    if (!cardContainer) {
        console.error('Genre.js: Không tìm thấy container để hiển thị cards!');
        return;
    }

    cardContainer.innerHTML = ''; // Xóa nội dung cũ

    // Kiểm tra nếu không có kết quả
    if (!cards || cards.length === 0) {
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'col-12 text-center py-5';
        noResultsDiv.innerHTML = `
            <div class="alert alert-info">
                <i class="bi bi-info-circle me-2"></i>
                Không tìm thấy truyện nào phù hợp với tiêu chí tìm kiếm.
            </div>
        `;
        cardContainer.appendChild(noResultsDiv);
        return;
    }

    // Hiển thị cards
    cards.forEach(data => {
        const colDiv = document.createElement('div');
        colDiv.className = 'col';

        const cardDiv = document.createElement('div');
        cardDiv.className = 'card h-100';

        const img = document.createElement('img');
        img.className = 'card-img-top';
        img.src = data.image || 'https://via.placeholder.com/150?text=No+Image';
        img.alt = data.title;

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body d-flex flex-column';

        const cardTitle = document.createElement('h5');
        cardTitle.className = 'card-title text-truncate';
        cardTitle.textContent = data.title;

        const cardText = document.createElement('p');
        cardText.className = 'card-text flex-grow-1';
        cardText.textContent = data.content || 'Chưa có nội dung.';
        if (cardText.textContent.length > 60) {
            cardText.textContent = cardText.textContent.substring(0, 60) + '...';
        }

        // Thêm thể loại nếu có
        if (Array.isArray(data.genre) && data.genre.length > 0) {
            const genreDiv = document.createElement('div');
            genreDiv.className = 'mb-2';
            
            data.genre.forEach(genre => {
                const badge = document.createElement('span');
                badge.className = 'badge bg-primary me-1';
                badge.textContent = genre;
                genreDiv.appendChild(badge);
            });
            
            cardBody.appendChild(cardTitle);
            cardBody.appendChild(genreDiv);
            cardBody.appendChild(cardText);
        } else if (data.genre_names) {
            const genreArray = data.genre_names.split(',').map(g => g.trim());
            if (genreArray.length > 0) {
                const genreDiv = document.createElement('div');
                genreDiv.className = 'mb-2';
                
                genreArray.forEach(genre => {
                    const badge = document.createElement('span');
                    badge.className = 'badge bg-primary me-1';
                    badge.textContent = genre;
                    genreDiv.appendChild(badge);
                });
                
                cardBody.appendChild(cardTitle);
                cardBody.appendChild(genreDiv);
                cardBody.appendChild(cardText);
            } else {
                cardBody.appendChild(cardTitle);
                cardBody.appendChild(cardText);
            }
        } else {
            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardText);
        }

        cardDiv.appendChild(img);
        cardDiv.appendChild(cardBody);

        cardDiv.style.cursor = 'pointer';
        cardDiv.setAttribute('data-comic-id', data.id);
        cardDiv.addEventListener('click', function () {
            // Kiểm tra nếu có hàm openCardModal
            if (typeof openCardModal === 'function') {
                openCardModal(data);
            } else if (typeof window.openCardModal === 'function') {
                window.openCardModal(data);
            } else {
                console.error('Genre.js: Không tìm thấy hàm openCardModal!');
            }
        });

        colDiv.appendChild(cardDiv);
        cardContainer.appendChild(colDiv);
    });
}