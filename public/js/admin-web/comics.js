// comics.js
let originalComics = [];

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
        renderComics(comics); // Hiển thị danh sách ban đầu
    } catch (error) {
        console.error('Lỗi trong fetchComics:', error);
        alert('Đã xảy ra lỗi khi lấy danh sách truyện: ' + error.message);
    }
}

export function renderComics(comics) {
    const tableBody = document.getElementById('comicTableBody');
    if (!tableBody) {
        console.error('Không tìm thấy phần tử comicTableBody trong DOM');
        return;
    }
    tableBody.innerHTML = '';
    comics.forEach(comic => {
        const comicId = parseInt(comic.id, 10);
        if (isNaN(comicId)) {
            console.error(`ID truyện không hợp lệ: ${comic.id}`);
            return;
        }
        const row = `
            <tr data-id="${comicId}">
                <td>${comicId}</td>
                <td>${comic.title}</td>
                <td>
                    ${comic.image && comic.image.trim() !== '' ? `<img src="${comic.image}" alt="${comic.title}" class="comic-image">` : 'N/A'}
                </td>
                <td>${comic.content || 'N/A'}</td>
                <td><a href="${comic.link || '#'}" target="_blank">${comic.link || 'N/A'}</a></td>
                <td>
                    <button class="btn btn-danger btn-sm delete-comic-btn" data-id="${comicId}"><i class="bi bi-trash"></i> Xóa</button>
                    <button class="btn btn-info btn-sm show-chapters-btn" data-id="${comicId}"><i class="bi bi-book"></i> Chương</button>
                    <button class="btn btn-warning btn-sm edit-comic-btn" data-id="${comicId}"><i class="bi bi-pencil"></i> Sửa</button>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

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

export async function editComic(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/cards`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Lỗi khi lấy danh sách truyện');
        }
        const comics = await response.json();
        const comic = comics.find(c => c.id == id);
        if (comic) {
            document.getElementById('comicId').value = comic.id;
            document.getElementById('comicTitle').value = comic.title;
            document.getElementById('comicImage').value = comic.image || '';
            document.getElementById('comicContent').value = comic.content || '';
            document.getElementById('comicLink').value = comic.link || '';
            document.getElementById('addComicModalLabel').textContent = 'Chỉnh Sửa Truyện';
            document.getElementById('comicSubmitButton').textContent = 'Cập Nhật';
            new bootstrap.Modal(document.getElementById('addComicModal')).show();
        }
    } catch (error) {
        console.error('Lỗi trong editComic:', error);
        alert('Lỗi khi chỉnh sửa truyện: ' + error.message);
    }
}

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

    renderComics(filteredComics); // Hiển thị danh sách đã lọc
}