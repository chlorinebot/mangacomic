// genres.js
let originalGenres = [];
const ITEMS_PER_PAGE = 5; // Số lượng thể loại mỗi trang
let currentPage = 1; // Trang hiện tại

// Hàm lấy danh sách thể loại từ API
export async function fetchGenres() {
    console.log('[Thể loại] Bắt đầu tải danh sách thể loại');
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('[Thể loại] Lỗi: Không tìm thấy token');
            throw new Error('Không tìm thấy token xác thực');
        }
        console.log('[Thể loại] Sử dụng token:', token.substring(0, 15) + '...');

        console.log('[Thể loại] Gửi request đến /api/genres');
        const response = await fetch('/api/genres', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });

        console.log('[Thể loại] Phản hồi API:', response.status, response.statusText);
        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Thể loại] Lỗi API:', errorText);
            throw new Error(`Không thể tải thể loại: ${response.statusText}`);
        }

        const genres = await response.json();
        console.log(`[Thể loại] Đã nhận được ${genres.length} thể loại`);
        console.log('[Thể loại] Dữ liệu mẫu thể loại đầu tiên:', genres.length > 0 ? JSON.stringify(genres[0]).substring(0, 100) + '...' : 'Không có dữ liệu');
        
        originalGenres = genres; // Lưu trữ dữ liệu gốc
        currentPage = 1; // Reset về trang đầu tiên
        
        console.log('[Thể loại] Gọi renderGenres() để hiển thị dữ liệu');
        renderGenres(genres); // Hiển thị danh sách ban đầu
        console.log('[Thể loại] Quá trình tải danh sách thể loại hoàn tất');
        
        return genres;
    } catch (error) {
        console.error('[Thể loại] Lỗi khi tải thể loại:', error);
        alert('Không thể tải danh sách thể loại: ' + error.message);
        return [];
    }
}

// Hàm hiển thị danh sách thể loại
export function renderGenres(genres) {
    const tableBody = document.getElementById('genreTableBody');
    const paginationContainer = document.getElementById('genrePagination');
    if (!tableBody || !paginationContainer) {
        console.error('Không tìm thấy phần tử genreTableBody hoặc genrePagination trong DOM');
        return;
    }

    // Tính toán dữ liệu phân trang
    const totalItems = genres.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedGenres = genres.slice(startIndex, endIndex);

    // Hiển thị danh sách thể loại
    tableBody.innerHTML = '';
    paginatedGenres.forEach(genre => {
        const row = `
            <tr data-id="${genre.genre_id}">
                <td>${genre.genre_id}</td>
                <td>${genre.genre_name}</td>
                <td>
                    <button class="btn btn-danger btn-sm delete-genre-btn" data-id="${genre.genre_id}"><i class="bi bi-trash"></i> Xóa</button>
                    <button class="btn btn-warning btn-sm edit-genre-btn" data-id="${genre.genre_id}"><i class="bi bi-pencil"></i> Sửa</button>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });

    // Hiển thị phân trang
    renderPagination(paginationContainer, totalPages, currentPage, (page) => {
        currentPage = page;
        renderGenres(genres);
    });
}

// Hàm render phân trang
function renderPagination(container, totalPages, currentPage, onPageChange) {
    container.innerHTML = '';
    if (totalPages <= 1) return; // Không cần phân trang nếu chỉ có 1 trang

    const ul = document.createElement('ul');
    ul.className = 'pagination';

    // Nút Previous
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#">Previous</a>`;
    prevLi.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    });
    ul.appendChild(prevLi);

    // Các trang số
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.addEventListener('click', (e) => {
            e.preventDefault();
            onPageChange(i);
        });
        ul.appendChild(li);
    }

    // Nút Next
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#">Next</a>`;
    nextLi.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    });
    ul.appendChild(nextLi);

    container.appendChild(ul);
}

// Hàm xóa thể loại
export async function deleteGenre(button) {
    if (confirm('Bạn có chắc chắn muốn xóa thể loại này?')) {
        try {
            const row = button.closest('tr');
            const id = row.dataset.id;
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/genres/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                row.remove();
                // Cập nhật lại danh sách gốc sau khi xóa
                originalGenres = originalGenres.filter(genre => genre.genre_id != id);
                renderGenres(originalGenres);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Lỗi khi xóa thể loại');
            }
        } catch (error) {
            console.error('Lỗi khi xóa thể loại:', error);
            alert('Lỗi khi xóa thể loại: ' + error.message);
        }
    }
}

// Hàm chỉnh sửa thể loại
export async function editGenre(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/genres', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Lỗi khi lấy danh sách thể loại');
        }
        const genres = await response.json();
        const genre = genres.find(g => g.genre_id == id);
        if (genre) {
            document.getElementById('genreId').value = genre.genre_id;
            document.getElementById('genreName').value = genre.genre_name;
            document.getElementById('addGenreModalLabel').textContent = 'Chỉnh Sửa Thể Loại';
            document.getElementById('genreSubmitButton').textContent = 'Cập Nhật';
            new bootstrap.Modal(document.getElementById('addGenreModal')).show();
        }
    } catch (error) {
        console.error('Lỗi trong editGenre:', error);
        alert('Lỗi khi chỉnh sửa thể loại: ' + error.message);
    }
}

// Hàm tìm kiếm thể loại
export function searchGenres() {
    const searchTerm = document.getElementById('genreSearch').value.trim().toLowerCase();
    let filteredGenres = [];

    if (searchTerm === '') {
        filteredGenres = originalGenres; // Hiển thị tất cả nếu không có từ khóa
    } else {
        // Lọc các thể loại khớp với từ khóa
        filteredGenres = originalGenres.filter(genre => {
            const genreName = genre.genre_name ? genre.genre_name.toLowerCase() : '';
            return genreName.includes(searchTerm);
        });

        // Sắp xếp: các mục khớp với từ khóa lên đầu
        filteredGenres.sort((a, b) => {
            const aGenreName = a.genre_name ? a.genre_name.toLowerCase() : '';
            const bGenreName = b.genre_name ? b.genre_name.toLowerCase() : '';
            const aMatch = aGenreName.includes(searchTerm);
            const bMatch = bGenreName.includes(searchTerm);
            if (aMatch && !bMatch) return -1;
            if (!aMatch && bMatch) return 1;
            return 0;
        });
    }

    currentPage = 1; // Reset về trang đầu tiên khi tìm kiếm
    renderGenres(filteredGenres); // Hiển thị danh sách đã lọc
}