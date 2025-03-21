// manager.js
import { checkLoginStatus, logout } from './auth.js';
import { fetchComics, renderComics, deleteComic, editComic, searchComics } from './comics.js';
import { showChapters, renderChapters, deleteChapter, editChapter, searchChapters } from './chapters.js';
import { fetchUsers, renderUsers, deleteUser, editUser, searchUsers } from './users.js';

// Khởi tạo khi DOM được tải
document.addEventListener('DOMContentLoaded', () => {
    if (!checkLoginStatus()) return;

    fetchComics();
    fetchUsers();

    // Sử dụng event delegation để xử lý các nút trong Quản Lý Truyện Tranh
    document.getElementById('comicTableBody').addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const comicId = target.dataset.id;
        if (target.classList.contains('delete-comic-btn')) {
            deleteComic(target);
        } else if (target.classList.contains('show-chapters-btn')) {
            showChapters(comicId).then(() => {
                // Gắn sự kiện tìm kiếm chương sau khi modal được mở
                document.getElementById('chapterSearch').oninput = () => searchChapters(comicId);
            });
        } else if (target.classList.contains('edit-comic-btn')) {
            editComic(comicId);
        }
    });

    // Sử dụng event delegation để xử lý các nút trong Quản Lý Người Dùng
    document.getElementById('userTableBody').addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const userId = target.dataset.id;
        if (target.classList.contains('delete-user-btn')) {
            deleteUser(target);
        } else if (target.classList.contains('edit-user-btn')) {
            editUser(userId);
        } else if (target.classList.contains('toggle-password')) {
            const row = target.closest('tr');
            const mask = row.querySelector('.password-mask');
            const text = row.querySelector('.password-text');
            mask.classList.toggle('d-none');
            text.classList.toggle('d-none');
            target.innerHTML = text.classList.contains('d-none') ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
        }
    });

    // Sử dụng event delegation để xử lý các nút trong modal Chương
    document.getElementById('chapterTableBody').addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const cardId = target.dataset.cardId;
        const chapterNumber = target.dataset.chapterNumber;
        if (target.classList.contains('delete-chapter-btn')) {
            deleteChapter(cardId, chapterNumber, target);
        } else if (target.classList.contains('edit-chapter-btn')) {
            editChapter(cardId, chapterNumber);
        }
    });

    // Tìm kiếm truyện tranh
    document.getElementById('comicSearch').addEventListener('input', searchComics);

    // Tìm kiếm người dùng
    document.getElementById('userSearch').addEventListener('input', searchUsers);

    // Thêm hoặc cập nhật truyện
    document.getElementById('addComicForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const id = document.getElementById('comicId').value;
        const title = document.getElementById('comicTitle').value.trim();
        const image = document.getElementById('comicImage').value.trim() || null;
        const content = document.getElementById('comicContent').value.trim() || null;
        const link = document.getElementById('comicLink').value.trim() || null;

        // Validation
        if (!title) {
            alert('Vui lòng nhập tiêu đề truyện!');
            return;
        }

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/cards/${id}` : '/api/cards';
        const body = id ? { id, title, image, content, link } : [{ title, image, content, link }];

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Lỗi khi lưu truyện');
            }
            this.reset();
            document.getElementById('comicId').value = '';
            document.getElementById('addComicModalLabel').textContent = 'Thêm Truyện Mới';
            document.getElementById('comicSubmitButton').textContent = 'Thêm';
            bootstrap.Modal.getInstance(document.getElementById('addComicModal')).hide();
            fetchComics(); // Tải lại danh sách
        } catch (error) {
            console.error('Lỗi khi lưu truyện:', error);
            alert('Lỗi khi lưu truyện: ' + error.message);
        }
    });

    // Thêm hoặc cập nhật chương
    document.getElementById('addChapterForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const cardId = document.getElementById('chapterCardId').value;
        const chapterNumber = parseInt(document.getElementById('chapterNumber').value);
        const chapterTitle = document.getElementById('chapterTitle').value.trim();
        const content = document.getElementById('chapterContent').value.trim() || null;
        const imageFolder = document.getElementById('chapterImageFolder').value.trim() || null;
        const imageCount = parseInt(document.getElementById('chapterImageCount').value) || 0;

        // Validation
        if (!chapterNumber || isNaN(chapterNumber) || chapterNumber <= 0) {
            alert('Số chương phải là một số dương!');
            return;
        }
        if (!chapterTitle) {
            alert('Vui lòng nhập tiêu đề chương!');
            return;
        }
        if (imageCount < 0) {
            alert('Số lượng hình ảnh không được nhỏ hơn 0!');
            return;
        }

        const chapterData = {
            chapterNumber,
            chapterTitle,
            content,
            imageFolder,
            imageCount
        };

        try {
            const token = localStorage.getItem('token');
            const method = document.getElementById('chapterSubmitButton').textContent === 'Cập Nhật' ? 'PUT' : 'POST';
            const url = method === 'PUT' ? `/api/chapters?card_id=${cardId}&chapter_number=${chapterNumber}` : '/api/chapters';
            const body = method === 'PUT' ? chapterData : { [cardId]: [chapterData] };

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Lỗi khi lưu chương');
            }
            this.reset();
            document.getElementById('chapterCardIdHidden').value = '';
            document.getElementById('addChapterModalLabel').textContent = 'Thêm Chương Mới';
            document.getElementById('chapterSubmitButton').textContent = 'Thêm';
            bootstrap.Modal.getInstance(document.getElementById('addChapterModal')).hide();
            showChapters(cardId); // Cập nhật danh sách chương
        } catch (error) {
            console.error('Lỗi khi lưu chương:', error);
            alert('Lỗi khi lưu chương: ' + error.message);
        }
    });

    // Thêm hoặc cập nhật người dùng
    document.getElementById('addUserForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const id = document.getElementById('userId').value;
        const username = document.getElementById('userName').value.trim();
        const email = document.getElementById('userEmail').value.trim();
        const password = document.getElementById('userPassword').value;

        // Validation
        if (!username) {
            alert('Vui lòng nhập tên người dùng!');
            return;
        }
        if (!email) {
            alert('Vui lòng nhập email!');
            return;
        }
        if (!password) {
            alert('Vui lòng nhập mật khẩu!');
            return;
        }

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/users/${id}` : '/api/register';

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Lỗi khi lưu người dùng');
            }
            this.reset();
            document.getElementById('userId').value = '';
            document.getElementById('addUserModalLabel').textContent = 'Thêm Người Dùng Mới';
            document.getElementById('userSubmitButton').textContent = 'Thêm';
            bootstrap.Modal.getInstance(document.getElementById('addUserModal')).hide();
            fetchUsers(); // Tải lại danh sách
        } catch (error) {
            console.error('Lỗi khi lưu người dùng:', error);
            alert('Lỗi khi lưu người dùng: ' + error.message);
        }
    });

    // Hàm thử nghiệm mở modal
    window.testModal = function () {
        console.log('Thử mở modal chapterModal');
        const chapterModal = document.getElementById('chapterModal');
        if (!chapterModal) {
            console.error('Không tìm thấy modal chapterModal trong DOM');
            return;
        }
        if (typeof bootstrap === 'undefined') {
            console.error('Bootstrap không được tải đúng cách');
            return;
        }
        const modalInstance = new bootstrap.Modal(chapterModal);
        modalInstance.show();
        console.log('Modal thử nghiệm đã được gọi để hiển thị');
    };

    document.getElementById('logoutButton').addEventListener('click', logout);
});