document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    
    // Biến để lưu trữ dữ liệu gốc
    let originalComics = [];
    let originalUsers = [];

    fetchComics();
    fetchUsers();

    // Hàm fetch dữ liệu truyện từ API
    async function fetchComics() {
        try {
            const response = await fetch('/api/cards');
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

    // Hàm hiển thị danh sách truyện
    function renderComics(comics) {
        const tableBody = document.getElementById('comicTableBody');
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
                        ${comic.image ? `<img src="${comic.image}" alt="${comic.title}" class="comic-image">` : 'N/A'}
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

        // Gắn sự kiện cho các nút
        document.querySelectorAll('.delete-comic-btn').forEach(button => {
            button.addEventListener('click', function() {
                console.log('Nút Xóa được bấm cho truyện ID:', this.dataset.id);
                deleteComic(this);
            });
        });

        document.querySelectorAll('.show-chapters-btn').forEach(button => {
            button.addEventListener('click', function() {
                console.log('Nút Chương được bấm cho truyện ID:', this.dataset.id);
                showChapters(this.dataset.id);
            });
        });

        document.querySelectorAll('.edit-comic-btn').forEach(button => {
            button.addEventListener('click', function() {
                editComic(this.dataset.id);
            });
        });
    }

    // Hàm fetch dữ liệu người dùng từ API
    async function fetchUsers() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/users', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Lỗi khi lấy danh sách người dùng: ' + response.statusText);
            }
            const users = await response.json();
            originalUsers = users; // Lưu trữ dữ liệu gốc
            renderUsers(users); // Hiển thị danh sách ban đầu
        } catch (error) {
            console.error('Lỗi trong fetchUsers:', error);
            alert('Đã xảy ra lỗi khi lấy danh sách người dùng: ' + error.message);
        }
    }

    // Hàm hiển thị danh sách người dùng
    function renderUsers(users) {
        const tableBody = document.getElementById('userTableBody');
        tableBody.innerHTML = '';
        users.forEach(user => {
            const row = `
                <tr data-id="${user.id}">
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>
                        <span class="password-mask">••••••••</span>
                        <span class="password-text d-none">${user.password}</span>
                        <button class="btn btn-sm btn-outline-secondary toggle-password"><i class="bi bi-eye"></i></button>
                    </td>
                    <td>${new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-danger btn-sm delete-user-btn" data-id="${user.id}"><i class="bi bi-trash"></i> Xóa</button>
                        <button class="btn btn-warning btn-sm edit-user-btn" data-id="${user.id}"><i class="bi bi-pencil"></i> Sửa</button>
                    </td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', row);
        });

        document.querySelectorAll('.toggle-password').forEach(button => {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                const mask = row.querySelector('.password-mask');
                const text = row.querySelector('.password-text');
                mask.classList.toggle('d-none');
                text.classList.toggle('d-none');
                this.innerHTML = text.classList.contains('d-none') ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
            });
        });

        document.querySelectorAll('.delete-user-btn').forEach(button => {
            button.addEventListener('click', function() {
                deleteUser(this);
            });
        });

        document.querySelectorAll('.edit-user-btn').forEach(button => {
            button.addEventListener('click', function() {
                editUser(this.dataset.id);
            });
        });
    }

    // Tìm kiếm truyện tranh
    document.getElementById('comicSearch').addEventListener('input', function() {
        const searchTerm = this.value.trim().toLowerCase();
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
    });

    // Tìm kiếm người dùng
    document.getElementById('userSearch').addEventListener('input', function() {
        const searchTerm = this.value.trim().toLowerCase();
        let filteredUsers = [];

        if (searchTerm === '') {
            filteredUsers = originalUsers; // Hiển thị tất cả nếu không có từ khóa
        } else {
            // Lọc các người dùng khớp với từ khóa
            filteredUsers = originalUsers.filter(user => {
                const username = user.username ? user.username.toLowerCase() : '';
                return username.includes(searchTerm);
            });

            // Sắp xếp: các mục khớp với từ khóa lên đầu
            filteredUsers.sort((a, b) => {
                const aUsername = a.username ? a.username.toLowerCase() : '';
                const bUsername = b.username ? b.username.toLowerCase() : '';
                const aMatch = aUsername.includes(searchTerm);
                const bMatch = bUsername.includes(searchTerm);
                if (aMatch && !bMatch) return -1;
                if (!aMatch && bMatch) return 1;
                return 0;
            });
        }

        renderUsers(filteredUsers); // Hiển thị danh sách đã lọc
    });

    // Hiển thị danh sách chương
    async function showChapters(cardId) {
        console.log('showChapters được gọi với cardId:', cardId);
        try {
            // Đóng các modal khác nếu có
            const openModals = document.querySelectorAll('.modal.show');
            openModals.forEach(modal => {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            });

            const token = localStorage.getItem('token');
            const response = await fetch('/api/chapters', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Phản hồi từ API /api/chapters:', response);
            if (!response.ok) {
                throw new Error('Lỗi khi lấy danh sách chương: ' + response.statusText);
            }
            const chapters = await response.json();
            console.log('Dữ liệu chương:', chapters);
            const chapterList = chapters[cardId] || [];
            const chapterBody = document.getElementById('chapterTableBody');
            if (!chapterBody) {
                throw new Error('Không tìm thấy phần tử chapterTableBody trong DOM');
            }
            chapterBody.innerHTML = '';
            
            if (chapterList.length === 0) {
                chapterBody.innerHTML = '<tr><td colspan="6" class="text-center">Không có chương nào cho truyện này.</td></tr>';
            } else {
                chapterList.forEach(chapter => {
                    const row = `
                        <tr>
                            <td>${chapter.chapterNumber}</td>
                            <td>${chapter.chapterTitle || 'N/A'}</td>
                            <td>${chapter.content || 'N/A'}</td>
                            <td>${chapter.imageFolder || 'N/A'}</td>
                            <td>${chapter.imageCount || 0}</td>
                            <td>
                                <button class="btn btn-danger btn-sm delete-chapter-btn" data-card-id="${cardId}" data-chapter-number="${chapter.chapterNumber}"><i class="bi bi-trash"></i> Xóa</button>
                                <button class="btn btn-warning btn-sm edit-chapter-btn" data-card-id="${cardId}" data-chapter-number="${chapter.chapterNumber}"><i class="bi bi-pencil"></i> Sửa</button>
                            </td>
                        </tr>
                    `;
                    chapterBody.insertAdjacentHTML('beforeend', row);
                });

                // Gắn sự kiện cho các nút trong modal
                document.querySelectorAll('.delete-chapter-btn').forEach(button => {
                    button.addEventListener('click', function() {
                        console.log('Nút Xóa chương được bấm:', this.dataset.cardId, this.dataset.chapterNumber);
                        deleteChapter(this.dataset.cardId, this.dataset.chapterNumber, this);
                    });
                });

                document.querySelectorAll('.edit-chapter-btn').forEach(button => {
                    button.addEventListener('click', function() {
                        console.log('Nút Sửa chương được bấm:', this.dataset.cardId, this.dataset.chapterNumber);
                        editChapter(this.dataset.cardId, this.dataset.chapterNumber);
                    });
                });
            }
            
            document.getElementById('chapterModalTitle').textContent = `Chương của truyện ID: ${cardId}`;
            const chapterModal = document.getElementById('chapterModal');
            if (!chapterModal) {
                throw new Error('Không tìm thấy modal chapterModal trong DOM');
            }
            if (typeof bootstrap === 'undefined') {
                throw new Error('Bootstrap không được tải đúng cách');
            }
            console.log('Mở modal chapterModal');
            const modalInstance = new bootstrap.Modal(chapterModal);
            modalInstance.show();
            console.log('Modal đã được gọi để hiển thị');
        } catch (error) {
            console.error('Lỗi trong showChapters:', error);
            alert('Đã xảy ra lỗi khi hiển thị danh sách chương: ' + error.message);
        }
    }

    // Xóa truyện
    async function deleteComic(button) {
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
                    const errorText = await response.text();
                    console.error('Lỗi khi xóa truyện:', errorText);
                    alert('Lỗi khi xóa truyện: ' + errorText);
                }
            } catch (error) {
                console.error('Lỗi trong deleteComic:', error);
                alert('Lỗi khi xóa truyện: ' + error.message);
            }
        }
    }

    // Xóa chương
    async function deleteChapter(cardId, chapterNumber, button) {
        console.log('deleteChapter được gọi:', cardId, chapterNumber);
        if (confirm('Bạn có chắc chắn muốn xóa chương này?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/chapters?card_id=${cardId}&chapter_number=${chapterNumber}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log('Phản hồi từ API /api/chapters:', response);
                if (response.ok) {
                    button.closest('tr').remove();
                    console.log('Chương đã được xóa thành công');
                } else {
                    const errorText = await response.text();
                    console.error('Lỗi khi xóa chương:', errorText);
                    alert('Lỗi khi xóa chương: ' + errorText);
                }
            } catch (error) {
                console.error('Lỗi trong deleteChapter:', error);
                alert('Lỗi khi xóa chương: ' + error.message);
            }
        }
    }

    // Xóa người dùng
    async function deleteUser(button) {
        if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            const row = button.closest('tr');
            const id = row.dataset.id;
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                row.remove();
                // Cập nhật lại danh sách gốc sau khi xóa
                originalUsers = originalUsers.filter(user => user.id != id);
                renderUsers(originalUsers);
            } else {
                alert('Lỗi khi xóa người dùng!');
            }
        }
    }

    // Thêm hoặc cập nhật truyện
    document.getElementById('addComicForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const id = document.getElementById('comicId').value;
        const title = document.getElementById('comicTitle').value;
        const image = document.getElementById('comicImage').value || null; // Lấy URL ảnh bìa, nếu rỗng thì gửi null
        const content = document.getElementById('comicContent').value;
        const link = document.getElementById('comicLink').value;
    
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
    document.getElementById('addChapterForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const cardId = document.getElementById('chapterCardId').value;
        const chapterNumber = document.getElementById('chapterNumber').value;
        const chapterTitle = document.getElementById('chapterTitle').value;
        const content = document.getElementById('chapterContent').value;
        const imageFolder = document.getElementById('chapterImageFolder').value;
        const imageCount = document.getElementById('chapterImageCount').value;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/chapters', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    [cardId]: [{
                        chapterNumber,
                        chapterTitle,
                        content,
                        imageFolder,
                        imageCount
                    }]
                })
            });
            if (!response.ok) {
                throw new Error('Lỗi khi lưu chương: ' + response.statusText);
            }
            this.reset();
            document.getElementById('chapterCardIdHidden').value = '';
            document.getElementById('addChapterModalLabel').textContent = 'Thêm Chương Mới';
            document.getElementById('chapterSubmitButton').textContent = 'Thêm';
            bootstrap.Modal.getInstance(document.getElementById('addChapterModal')).hide();
            showChapters(cardId);
        } catch (error) {
            console.error('Lỗi khi lưu chương:', error);
            alert('Lỗi khi lưu chương: ' + error.message);
        }
    });

    // Thêm hoặc cập nhật người dùng
    document.getElementById('addUserForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const id = document.getElementById('userId').value;
        const username = document.getElementById('userName').value;
        const email = document.getElementById('userEmail').value;
        const password = document.getElementById('userPassword').value;

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
                throw new Error('Lỗi khi lưu người dùng: ' + response.statusText);
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

    // Chỉnh sửa truyện
    window.editComic = async function(id) {
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
            document.getElementById('comicImage').value = comic.image || ''; // Điền URL ảnh bìa
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
};

    // Chỉnh sửa chương
    window.editChapter = async function(cardId, chapterNumber) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/chapters', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Lỗi khi lấy danh sách chương: ' + response.statusText);
            }
            const chapters = await response.json();
            const chapter = (chapters[cardId] || []).find(ch => ch.chapterNumber == chapterNumber);
            if (chapter) {
                document.getElementById('chapterCardId').value = cardId;
                document.getElementById('chapterCardIdHidden').value = cardId;
                document.getElementById('chapterNumber').value = chapter.chapterNumber;
                document.getElementById('chapterTitle').value = chapter.chapterTitle || '';
                document.getElementById('chapterContent').value = chapter.content || '';
                document.getElementById('chapterImageFolder').value = chapter.imageFolder || '';
                document.getElementById('chapterImageCount').value = chapter.imageCount || 0;
                document.getElementById('addChapterModalLabel').textContent = 'Chỉnh Sửa Chương';
                document.getElementById('chapterSubmitButton').textContent = 'Cập Nhật';
                new bootstrap.Modal(document.getElementById('addChapterModal')).show();
            }
        } catch (error) {
            console.error('Lỗi trong editChapter:', error);
            alert('Lỗi khi chỉnh sửa chương: ' + error.message);
        }
    };

    // Chỉnh sửa người dùng
    window.editUser = async function(id) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/users', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Lỗi khi lấy danh sách người dùng: ' + response.statusText);
            }
            const users = await response.json();
            const user = users.find(u => u.id == id);
            if (user) {
                document.getElementById('userId').value = user.id;
                document.getElementById('userName').value = user.username;
                document.getElementById('userEmail').value = user.email;
                document.getElementById('userPassword').value = user.password;
                document.getElementById('addUserModalLabel').textContent = 'Chỉnh Sửa Người Dùng';
                document.getElementById('userSubmitButton').textContent = 'Cập Nhật';
                new bootstrap.Modal(document.getElementById('addUserModal')).show();
            }
        } catch (error) {
            console.error('Lỗi trong editUser:', error);
            alert('Lỗi khi chỉnh sửa người dùng: ' + error.message);
        }
    };

    // Hàm thử nghiệm mở modal
    window.testModal = function() {
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

function checkLoginStatus() {
    const token = localStorage.getItem('token');
    const roleId = localStorage.getItem('roleId');
    if (!token || !roleId || roleId !== '1') {
        window.location.href = '/';
        return;
    }
    console.log('User is logged in as admin');
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('roleId');
    setTimeout(() => {
        window.location.href = '/';
    }, 500);
}