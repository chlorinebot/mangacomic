// comics.js
let originalComics = [];
const ITEMS_PER_PAGE = 5; // Số lượng truyện mỗi trang
let currentPage = 1; // Trang hiện tại

// Hàm lấy danh sách truyện từ API
export async function fetchComics() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/cards', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Lỗi khi lấy danh sách truyện: ' + response.statusText);
        }
        const comics = await response.json();
        originalComics = comics; // Lưu trữ dữ liệu gốc
        currentPage = 1; // Reset về trang đầu tiên
        renderComics(originalComics); // Hiển thị danh sách ban đầu
    } catch (error) {
        console.error('Lỗi trong fetchComics:', error);
        alert('Đã xảy ra lỗi khi lấy danh sách truyện: ' + error.message);
    }
}

// Hàm hiển thị danh sách truyện
export function renderComics(comics) {
    const tableBody = document.getElementById('comicTableBody');
    const paginationContainer = document.getElementById('comicPagination');
    if (!tableBody || !paginationContainer) {
        console.error('Không tìm thấy phần tử comicTableBody hoặc comicPagination trong DOM');
        return;
    }

    // Tính toán dữ liệu phân trang
    const totalItems = comics.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedComics = comics.slice(startIndex, endIndex);

    // Hiển thị danh sách truyện
    tableBody.innerHTML = '';
    paginatedComics.forEach(comic => {
        const comicId = parseInt(comic.id, 10);
        if (isNaN(comicId)) {
            console.error(`ID truyện không hợp lệ: ${comic.id}`);
            return;
        }
        const genreNames = comic.genre_names ? comic.genre_names.split(',') : [];
        const genreDisplay = genreNames.length > 0 ? genreNames.join(', ') : 'N/A';
        const row = `
            <tr data-id="${comicId}">
                <td>${comicId}</td>
                <td>${comic.title}</td>
                <td>
                    ${comic.image && comic.image.trim() !== '' ? `<img src="${comic.image}" alt="${comic.title}" class="comic-image">` : 'N/A'}
                </td>
                <td>${comic.content || 'N/A'}</td>
                <td><a href="${comic.link || '#'}" target="_blank">${comic.link || 'N/A'}</a></td>
                <td>${genreDisplay}</td> <!-- Hiển thị danh sách thể loại -->
                <td>
                    <button class="btn btn-danger btn-sm delete-comic-btn" data-id="${comicId}"><i class="bi bi-trash"></i> Xóa</button>
                    <button class="btn btn-info btn-sm show-chapters-btn" data-id="${comicId}"><i class="bi bi-book"></i> Chương</button>
                    <button class="btn btn-warning btn-sm edit-comic-btn" data-id="${comicId}"><i class="bi bi-pencil"></i> Sửa</button>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });

    // Hiển thị phân trang
    renderPagination(paginationContainer, totalPages, currentPage, (page) => {
        currentPage = page;
        renderComics(comics);
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

// Hàm xóa truyện
export async function deleteComic(button) {
    console.log('deleteComic được gọi');
    if (confirm('Bạn có chắc chắn muốn xóa truyện này?')) {
        try {
            const row = button.closest('tr');
            const id = row.dataset.id;
            console.log('Xóa truyện với ID:', id);
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/cards/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Phản hồi từ API /api/cards:', response);
            if (response.ok) {
                row.remove();
                console.log('Truyện đã được xóa thành công');
                // Cập nhật lại danh sách gốc sau khi xóa
                originalComics = originalComics.filter(comic => comic.id != id);
                renderComics(originalComics);
            } else {
                const errorData = await response.json();
                console.error('Lỗi khi xóa truyện:', errorData);
                throw new Error(errorData.error || 'Lỗi khi xóa truyện');
            }
        } catch (error) {
            console.error('Lỗi trong deleteComic:', error);
            alert('Lỗi khi xóa truyện: ' + error.message);
        }
    }
}

// Hàm chỉnh sửa truyện
export async function editComic(comicId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Không tìm thấy token trong localStorage');
        }

        // Tìm truyện trong danh sách đã có
        const comic = originalComics.find(c => c.id == comicId);
        if (!comic) {
            throw new Error('Không tìm thấy truyện với ID: ' + comicId);
        }

        // Thiết lập chế độ chỉnh sửa và cập nhật form
        window.isEditMode = true;
        window.editSelectedGenres = [];
        window.currentComicGenres = [];

        // Cập nhật form với thông tin truyện
        document.getElementById('comicId').value = comic.id;
        document.getElementById('comicTitle').value = comic.title;
        document.getElementById('comicContent').value = comic.content || '';
        document.getElementById('comicLink').value = comic.link || '';
        document.getElementById('comicImage').value = comic.image || '';

        // Lấy danh sách thể loại của truyện
        const genreNames = comic.genre_names ? comic.genre_names.split(',').map(name => name.trim()) : [];
        
        // Lấy danh sách tất cả thể loại để map ID
        const genresResponse = await fetch('/api/genres', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!genresResponse.ok) {
            throw new Error('Lỗi khi lấy danh sách thể loại: ' + genresResponse.statusText);
        }

        const allGenres = await genresResponse.json();
        
        // Map tên thể loại sang ID và cập nhật biến toàn cục
        window.currentComicGenres = allGenres
            .filter(genre => genreNames.includes(genre.genre_name))
            .map(genre => genre.genre_id.toString());
        window.editSelectedGenres = [...window.currentComicGenres];

        console.log('Current comic genres:', window.currentComicGenres);
        console.log('Edit selected genres:', window.editSelectedGenres);

        // Cập nhật tiêu đề và nút
        document.getElementById('addComicModalLabel').textContent = 'Chỉnh Sửa Truyện';
        document.getElementById('comicSubmitButton').textContent = 'Cập Nhật';

        // Hiển thị modal
        const modal = new bootstrap.Modal(document.getElementById('addComicModal'));
        modal.show();

        // Đợi một chút để đảm bảo modal đã được hiển thị hoàn toàn
        setTimeout(() => {
            // Cập nhật danh sách thể loại đã chọn
            const selectedGenresList = document.getElementById('selectedGenresList');
            if (selectedGenresList) {
                selectedGenresList.innerHTML = window.editSelectedGenres.map(genreId => {
                    const genre = allGenres.find(g => g.genre_id.toString() === genreId.toString());
                    if (!genre) return '';
                    return `
                        <span class="badge bg-primary me-2 mb-2" style="font-size: 14px;">
                            ${genre.genre_name}
                            <button type="button" class="btn-close btn-close-white" 
                                    style="font-size: 0.5em;" 
                                    onclick="removeGenre('${genreId}')"
                                    aria-label="Remove"></button>
                        </span>
                    `;
                }).join('');
            }
        }, 100);

    } catch (error) {
        console.error('Lỗi trong quá trình chỉnh sửa truyện:', error);
        alert('Lỗi trong quá trình chỉnh sửa truyện: ' + error.message);
        window.isEditMode = false;
        window.editSelectedGenres = [];
        window.currentComicGenres = [];
    }
}

// Hàm tìm kiếm truyện
export function searchComics() {
    const searchTerm = document.getElementById('comicSearch').value.trim().toLowerCase();
    let filteredComics = [];

    if (searchTerm === '') {
        filteredComics = originalComics; // Hiển thị tất cả nếu không có từ khóa
    } else {
        // Lọc các truyện khớp với từ khóa
        filteredComics = originalComics.filter(comic => {
            const title = comic.title ? comic.title.toLowerCase() : '';
            return title.includes(searchTerm);
        });

        // Sắp xếp: các mục khớp với từ khóa lên đầu
        filteredComics.sort((a, b) => {
            const aTitle = a.title ? a.title.toLowerCase() : '';
            const bTitle = b.title ? b.title.toLowerCase() : '';
            const aMatch = aTitle.includes(searchTerm);
            const bMatch = bTitle.includes(searchTerm);
            if (aMatch && !bMatch) return -1;
            if (!aMatch && bMatch) return 1;
            return 0;
        });
    }

    currentPage = 1; // Reset về trang đầu tiên khi tìm kiếm
    renderComics(filteredComics); // Hiển thị danh sách đã lọc
}