/**
 * Xử lý bảng xếp hạng truyện
 */
document.addEventListener('DOMContentLoaded', function() {
    // Các loại bảng xếp hạng và endpoint tương ứng
    const RANKING_TYPES = {
        'most-read': {
            title: 'Truyện đọc nhiều nhất',
            metric: 'Lượt xem',
            endpoint: '/api/rankings/most-read' // Sửa endpoint để phù hợp với API thực
        },
        'most-liked': {
            title: 'Truyện được yêu thích nhất',
            metric: 'Lượt thích',
            endpoint: '/api/rankings/most-liked' // Giữ nguyên vì đã đúng
        },
        'highest-rated': {
            title: 'Truyện đánh giá cao nhất',
            metric: 'Điểm đánh giá',
            endpoint: '/api/rankings/highest-rated' // Giữ nguyên vì đã đúng
        },
        'weekly-top': {
            title: 'Top xem tuần',
            metric: 'Lượt xem',
            endpoint: '/api/rankings/weekly-top' // Sửa endpoint để phù hợp với API thực
        },
        'daily-top': {
            title: 'Top xem ngày',
            metric: 'Lượt xem',
            endpoint: '/api/rankings/daily-top' // Sửa endpoint để phù hợp với API thực
        }
    };

    // Biến lưu trạng thái hiện tại
    let currentRankingType = 'most-read';
    let isLoading = false;
    let cachedData = {};

    // Cache DOM elements
    const rankingModal = document.getElementById('rankingModal');
    const rankingModalLabel = document.getElementById('rankingModalLabel');
    
    if (!rankingModal) {
        console.error('Không tìm thấy modal bảng xếp hạng');
        return;
    }
    
    // Thiết lập sự kiện cho các tab
    setupTabEvents();
    
    // Xử lý sự kiện khi modal mở
    rankingModal.addEventListener('show.bs.modal', function(event) {
        const relatedTarget = event.relatedTarget;
        if (relatedTarget && relatedTarget.dataset.rankingType) {
            currentRankingType = relatedTarget.dataset.rankingType;
        }
        
        // Hiển thị tab tương ứng và tải dữ liệu
        showTabAndLoadData(currentRankingType);
    });
    
    // Thiết lập sự kiện cho các tab
    function setupTabEvents() {
        const tabButtons = rankingModal.querySelectorAll('.nav-link[id$="-tab"]');
        tabButtons.forEach(tab => {
            tab.addEventListener('shown.bs.tab', function(event) {
                const targetId = event.target.id;
                const rankingType = targetId.replace('-tab', '');
                currentRankingType = rankingType;
                
                // Cập nhật tiêu đề modal
                updateModalTitle();
                
                // Tải dữ liệu cho tab
                loadRankingData();
            });
        });
    }
    
    // Hiển thị tab tương ứng và tải dữ liệu
    function showTabAndLoadData(rankingType) {
        // Kích hoạt tab tương ứng
        const tabToActivate = document.getElementById(`${rankingType}-tab`);
        if (tabToActivate) {
            const tabInstance = new bootstrap.Tab(tabToActivate);
            tabInstance.show();
        }
        
        // Cập nhật tiêu đề
        updateModalTitle();
        
        // Tải dữ liệu
        loadRankingData();
    }
    
    // Cập nhật tiêu đề modal
    function updateModalTitle() {
        if (!rankingModalLabel) return;
        
        const rankingInfo = RANKING_TYPES[currentRankingType];
        rankingModalLabel.textContent = rankingInfo.title;
    }
    
    // Tải dữ liệu bảng xếp hạng
    function loadRankingData() {
        if (isLoading) return;
        
        const contentContainer = document.getElementById(`${currentRankingType}-content`);
        if (!contentContainer) {
            console.error(`Không tìm thấy container cho ${currentRankingType}`);
            return;
        }
        
        // Kiểm tra cache (chỉ cache trong 5 phút)
        const now = new Date().getTime();
        if (cachedData[currentRankingType] && cachedData[currentRankingType].timestamp 
            && (now - cachedData[currentRankingType].timestamp < 5 * 60 * 1000)) {
            renderRankingItems(contentContainer, cachedData[currentRankingType].data);
            return;
        }
        
        isLoading = true;
        showLoadingState(contentContainer);
        
        // Gọi API để lấy dữ liệu thực từ database
        fetch(RANKING_TYPES[currentRankingType].endpoint)
            .then(response => {
                // Debug thông tin response
                console.log(`API response status for ${currentRankingType}:`, response.status);
                console.log(`API response headers for ${currentRankingType}:`, [...response.headers.entries()]);
                
                if (!response.ok) {
                    throw new Error(`Không thể tải dữ liệu bảng xếp hạng: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                // Debug chi tiết response data
                console.log(`API response data for ${currentRankingType}:`, data);
                console.log(`API data structure: ${Array.isArray(data) ? 'Array' : typeof data}`);
                console.log(`API data length: ${Array.isArray(data) ? data.length : 'N/A'}`);
                
                if (data && Array.isArray(data) && data.length > 0) {
                    console.log(`Sample data item:`, data[0]);
                    console.log(`Available fields:`, Object.keys(data[0]).join(', '));
                }
                
                // Kiểm tra xem data có đúng định dạng không
                if (!Array.isArray(data)) {
                    console.error('API trả về dữ liệu không phải dạng mảng:', data);
                    throw new Error('Dữ liệu không đúng định dạng');
                }
                
                // Lưu vào cache với timestamp
                cachedData[currentRankingType] = {
                    data: data,
                    timestamp: new Date().getTime()
                };
                
                renderRankingItems(contentContainer, data);
            })
            .catch(error => {
                console.error('Lỗi khi tải dữ liệu bảng xếp hạng:', error);
                showErrorState(contentContainer);
                
                // Nếu gặp lỗi, sử dụng dữ liệu giả tạm thời
                const fakeData = generateDummyData(currentRankingType);
                renderRankingItems(contentContainer, fakeData);
            })
            .finally(() => {
                isLoading = false;
            });
    }
    
    // Hiển thị dữ liệu bảng xếp hạng trong container
    function renderRankingItems(container, data) {
        if (!data || data.length === 0) {
            showEmptyState(container);
            return;
        }
        
        // Tạo container nếu chưa có
        let rankingContainer = container.querySelector('.ranking-container');
        if (!rankingContainer) {
            rankingContainer = document.createElement('div');
            rankingContainer.className = 'ranking-container';
            container.innerHTML = '';
            container.appendChild(rankingContainer);
        } else {
            rankingContainer.innerHTML = '';
        }
        
        // Tạo các mục bảng xếp hạng
        data.slice(0, 10).forEach((item, index) => {
            const rankingItem = createRankingItem(item, index + 1);
            rankingContainer.appendChild(rankingItem);
        });
    }
    
    // Tạo một mục trong bảng xếp hạng
    function createRankingItem(item, rank) {
        const div = document.createElement('div');
        div.className = 'ranking-item';
        div.setAttribute('data-comic-id', item.id);
        
        // Xác định màu nền cho số thứ tự
        let rankClass = '';
        if (rank === 1) rankClass = 'bg-primary';
        else if (rank === 2) rankClass = 'bg-info';
        else if (rank === 3) rankClass = 'bg-warning text-dark';
        
        // Định dạng giá trị thống kê
        let metricDisplay = formatMetric(item.metric, currentRankingType);
        
        div.innerHTML = `
            <div class="ranking-number ${rankClass}">${rank}</div>
            <div class="ranking-image">
                <img src="${item.coverImage || item.image}" alt="${item.title}">
            </div>
            <div class="ranking-info">
                <h5>${item.title}</h5>
                <p class="mb-1"><i class="bi bi-person-fill me-1"></i>${item.author}</p>
                <div class="ranking-stats">
                    <span><i class="bi bi-eye-fill me-1"></i>${metricDisplay}</span>
                    <span><i class="bi bi-star-fill text-warning me-1"></i>${item.rating || '0'}</span>
                </div>
            </div>
        `;
        
        // Thêm sự kiện click để đi đến trang truyện
        div.addEventListener('click', function() {
            window.location.href = `/comic/${item.id}`;
        });
        
        return div;
    }
    
    // Định dạng giá trị hiển thị
    function formatMetric(value, rankingType) {
        if (!value) return '0';
        
        // Với điểm đánh giá, hiển thị 1 chữ số thập phân
        if (rankingType === 'highest-rated') {
            return parseFloat(value).toFixed(1);
        }
        
        // Với các loại khác, định dạng số lớn với dấu phân cách hàng nghìn
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
    // Hiển thị trạng thái đang tải
    function showLoadingState(container) {
        container.innerHTML = `
            <div class="d-flex justify-content-center align-items-center p-5">
                <div class="spinner-border text-primary me-3" role="status">
                    <span class="visually-hidden">Đang tải...</span>
                </div>
                <span>Đang tải dữ liệu bảng xếp hạng...</span>
            </div>
        `;
    }
    
    // Hiển thị trạng thái lỗi
    function showErrorState(container) {
        container.innerHTML = `
            <div class="text-center text-danger p-5">
                <i class="bi bi-exclamation-triangle-fill fs-1 mb-3"></i>
                <p>Không thể tải dữ liệu bảng xếp hạng. Vui lòng thử lại sau.</p>
                <button type="button" class="btn btn-primary mt-3" onclick="loadRankingData()">
                    <i class="bi bi-arrow-clockwise me-2"></i>Thử lại
                </button>
            </div>
        `;
    }
    
    // Hiển thị trạng thái không có dữ liệu
    function showEmptyState(container) {
        container.innerHTML = `
            <div class="text-center p-5">
                <i class="bi bi-inbox fs-1 mb-3 text-muted"></i>
                <p class="text-muted">Không có dữ liệu cho bảng xếp hạng này.</p>
            </div>
        `;
    }
    
    // Tạo dữ liệu giả cho bảng xếp hạng (sử dụng khi không có API)
    function generateDummyData(rankingType) {
        const comicTitles = [
            'One Piece', 'Naruto', 'Dragon Ball', 'Attack on Titan', 'Demon Slayer',
            'My Hero Academia', 'Jujutsu Kaisen', 'Haikyuu!!', 'Bleach', 'Death Note'
        ];
        
        const authors = [
            'Eiichiro Oda', 'Masashi Kishimoto', 'Akira Toriyama', 'Hajime Isayama', 'Koyoharu Gotouge',
            'Kohei Horikoshi', 'Gege Akutami', 'Haruichi Furudate', 'Tite Kubo', 'Tsugumi Ohba'
        ];
        
        const result = [];
        
        for (let i = 0; i < comicTitles.length; i++) {
            let metric;
            let rating;
            
            switch (rankingType) {
                case 'most-read':
                    metric = Math.floor(1000000 / (i + 1)) + Math.floor(Math.random() * 100000);
                    rating = (5 - (i * 0.1)).toFixed(1);
                    break;
                case 'most-liked':
                    metric = Math.floor(500000 / (i + 1)) + Math.floor(Math.random() * 50000);
                    rating = (5 - (i * 0.1)).toFixed(1);
                    break;
                case 'highest-rated':
                    metric = (5 - (i * 0.1)).toFixed(1);
                    rating = (5 - (i * 0.1)).toFixed(1);
                    break;
                case 'weekly-top':
                    metric = Math.floor(200000 / (i + 1)) + Math.floor(Math.random() * 20000);
                    rating = (5 - (i * 0.1)).toFixed(1);
                    break;
                case 'daily-top':
                    metric = Math.floor(50000 / (i + 1)) + Math.floor(Math.random() * 5000);
                    rating = (5 - (i * 0.1)).toFixed(1);
                    break;
            }
            
            // Làm cho dữ liệu giả phù hợp với cấu trúc API thực từ rankingRoutes.js
            result.push({
                id: i + 1,
                title: comicTitles[i],
                author: authors[i],
                coverImage: `https://picsum.photos/150/200?random=${i}`,
                image: `https://picsum.photos/150/200?random=${i}`, // Trường bắt buộc để hiển thị hình ảnh
                metric: metric,
                rating: rating,
                genres: ['Hành động', 'Phiêu lưu', 'Shounen'], // Đảm bảo có Shounen trong danh sách thể loại
                trend: ['up', 'down', 'stable', 'new'][Math.floor(Math.random() * 4)],
                link: `/comic/${i + 1}` // Trường bắt buộc cho liên kết
            });
        }
        
        return result;
    }
});