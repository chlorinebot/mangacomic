// Khai báo các biến toàn cục
window.selectedGenres = [];
window.editSelectedGenres = [];
window.isEditMode = false;
window.currentComicGenres = [];
window.allGenres = []; // Lưu trữ tất cả thể loại

// Hàm khởi tạo danh sách thể loại
window.initializeGenreList = async function() {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Không tìm thấy token');

        // Kiểm tra xem allGenres đã có chưa
        if (!window.allGenres || window.allGenres.length === 0) {
            const response = await fetch('/api/genres', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Lỗi khi lấy danh sách thể loại');
            window.allGenres = await response.json();
        }

        setupGenreAutocomplete();
        updateSelectedGenresList();
    } catch (error) {
        console.error('Lỗi trong initializeGenreList:', error);
        alert('Không thể tải danh sách thể loại: ' + error.message);
    }
};

// Hàm thiết lập autocomplete cho input thể loại
function setupGenreAutocomplete() {
    const genreInput = document.getElementById('genreInput');
    const suggestionsList = document.getElementById('genreSuggestions');

    // Xóa event listener cũ
    genreInput.oninput = function() {
        const searchTerm = this.value.toLowerCase();
        if (searchTerm.length < 1) {
            suggestionsList.style.display = 'none';
            return;
        }

        const matches = window.allGenres.filter(genre => 
            genre.genre_name.toLowerCase().includes(searchTerm)
        );

        if (matches.length > 0) {
            suggestionsList.innerHTML = matches.map(genre => `
                <a href="#" class="list-group-item list-group-item-action" 
                   data-genre-id="${genre.genre_id}" 
                   data-genre-name="${genre.genre_name}">
                    ${genre.genre_name}
                </a>
            `).join('');
            suggestionsList.style.display = 'block';
        } else {
            suggestionsList.style.display = 'none';
        }
    };

    // Xóa event listener cũ và thêm mới cho suggestions
    suggestionsList.onclick = function(e) {
        e.preventDefault();
        if (e.target.tagName === 'A') {
            const genreId = e.target.dataset.genreId;
            const genreName = e.target.dataset.genreName;
            addGenreToSelection(genreId, genreName);
            genreInput.value = '';
            suggestionsList.style.display = 'none';
        }
    };

    // Xử lý nút thêm thể loại
    document.getElementById('addGenreToList').onclick = function() {
        const searchTerm = genreInput.value.toLowerCase();
        const matchedGenre = window.allGenres.find(genre => 
            genre.genre_name.toLowerCase() === searchTerm
        );
        if (matchedGenre) {
            addGenreToSelection(matchedGenre.genre_id, matchedGenre.genre_name);
            genreInput.value = '';
        }
    };
}

// Hàm thêm thể loại vào danh sách đã chọn
function addGenreToSelection(genreId, genreName) {
    const targetArray = window.isEditMode ? window.editSelectedGenres : window.selectedGenres;
    if (!targetArray.includes(genreId)) {
        targetArray.push(genreId);
        updateSelectedGenresList();
    }
}

// Hàm cập nhật hiển thị danh sách thể loại đã chọn
window.updateSelectedGenresList = function() {
    const selectedGenresList = document.getElementById('selectedGenresList');
    const targetArray = window.isEditMode ? window.editSelectedGenres : window.selectedGenres;

    if (!window.allGenres || window.allGenres.length === 0) {
        selectedGenresList.innerHTML = '<span class="text-danger">Không thể tải thể loại</span>';
        return;
    }

    selectedGenresList.innerHTML = targetArray.map(genreId => {
        const genre = window.allGenres.find(g => g.genre_id.toString() === genreId.toString());
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
};

// Hàm xóa thể loại khỏi danh sách đã chọn
window.removeGenre = function(genreId) {
    const targetArray = window.isEditMode ? window.editSelectedGenres : window.selectedGenres;
    const index = targetArray.indexOf(genreId);
    if (index > -1) {
        targetArray.splice(index, 1);
        updateSelectedGenresList();
    }
};

// Khởi tạo modal events
const comicModal = document.getElementById('addComicModal');

// Xóa event listeners cũ
const newComicModal = comicModal.cloneNode(true);
comicModal.parentNode.replaceChild(newComicModal, comicModal);

// Thêm event listeners mới
newComicModal.addEventListener('show.bs.modal', async () => {
    console.log('Modal opening, isEditMode:', window.isEditMode);
    await window.initializeGenreList();
}, { once: true });

newComicModal.addEventListener('hidden.bs.modal', () => {
    // Xóa backdrop và reset body
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';

    // Reset form và biến nếu không phải chế độ sửa
    if (!window.isEditMode) {
        window.selectedGenres = [];
        document.getElementById('comicId').value = '';
        document.getElementById('comicTitle').value = '';
        document.getElementById('comicImage').value = '';
        document.getElementById('comicContent').value = '';
        document.getElementById('comicLink').value = '';
        document.getElementById('addComicModalLabel').textContent = 'Thêm Truyện Mới';
        document.getElementById('comicSubmitButton').textContent = 'Thêm';
    }
    document.getElementById('genreInput').value = '';
    document.getElementById('genreSuggestions').style.display = 'none';
    updateSelectedGenresList();
});

// Thêm sự kiện cho nút đóng modal
const closeButtons = newComicModal.querySelectorAll('[data-bs-dismiss="modal"]');
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Xóa backdrop và reset body
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    });
});

// Khởi tạo khi DOM được tải
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
}, { once: true });