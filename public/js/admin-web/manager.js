// admin-web.js (manager.js)

document.addEventListener('DOMContentLoaded', () => {
    // Check login status on page load
    checkLoginStatus();

    // Hàm fetch dữ liệu truyện từ API
    async function fetchComics() {
        const response = await fetch('/api/cards');
        const comics = await response.json();
        const tableBody = document.getElementById('comicTableBody');
        tableBody.innerHTML = '';
        comics.forEach(comic => {
            const row = `
                <tr data-id="${comic.id}">
                    <td>${comic.id}</td>
                    <td>${comic.title}</td>
                    <td>${comic.content || 'N/A'}</td>
                    <td><a href="${comic.link || '#'}" target="_blank">${comic.link || 'N/A'}</a></td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteComic(this)"><i class="bi bi-trash"></i> Xóa</button>
                        <button class="btn btn-info btn-sm" onclick="showChapters(${comic.id})"><i class="bi bi-book"></i> Chương</button>
                    </td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', row);
        });
    }

    // Hiển thị danh sách chương
    async function showChapters(cardId) {
        const response = await fetch('/api/chapters');
        const chapters = await response.json();
        const chapterList = chapters[cardId] || [];
        const chapterBody = document.getElementById('chapterTableBody');
        chapterBody.innerHTML = '';
        chapterList.forEach(chapter => {
            const row = `
                <tr>
                    <td>${chapter.chapterNumber}</td>
                    <td>${chapter.chapterTitle || 'N/A'}</td>
                    <td>${chapter.content || 'N/A'}</td>
                    <td>${chapter.imageFolder || 'N/A'}</td>
                    <td>${chapter.imageCount || 0}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteChapter(${cardId}, ${chapter.chapterNumber}, this)"><i class="bi bi-trash"></i> Xóa</button>
                    </td>
                </tr>
            `;
            chapterBody.insertAdjacentHTML('beforeend', row);
        });
        document.getElementById('chapterModalTitle').textContent = `Chương của truyện ID: ${cardId}`;
        new bootstrap.Modal(document.getElementById('chapterModal')).show();
    }

    // Xóa truyện
    async function deleteComic(button) {
        if (confirm('Bạn có chắc chắn muốn xóa truyện này?')) {
            const row = button.closest('tr');
            const id = row.dataset.id;
            const response = await fetch(`/api/cards/${id}`, { method: 'DELETE' });
            if (response.ok) {
                row.remove();
            } else {
                alert('Lỗi khi xóa truyện!');
            }
        }
    }

    // Xóa chương
    async function deleteChapter(cardId, chapterNumber, button) {
        if (confirm('Bạn có chắc chắn muốn xóa chương này?')) {
            const response = await fetch(`/api/chapters?card_id=${cardId}&chapter_number=${chapterNumber}`, { method: 'DELETE' });
            if (response.ok) {
                button.closest('tr').remove();
            } else {
                alert('Lỗi khi xóa chương!');
            }
        }
    }

    // Fetch danh sách người dùng
    async function fetchUsers() {
        const response = await fetch('/api/users');
        const users = await response.json();
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
                        <button class="btn btn-danger btn-sm" onclick="deleteUser(this)"><i class="bi bi-trash"></i> Xóa</button>
                    </td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', row);
        });

        // Thêm sự kiện toggle mật khẩu
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
    }

    // Xóa người dùng
    async function deleteUser(button) {
        if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            const row = button.closest('tr');
            const id = row.dataset.id;
            const response = await fetch(`/api/users/${id}`, { method: 'DELETE' });
            if (response.ok) {
                row.remove();
            } else {
                alert('Lỗi khi xóa người dùng!');
            }
        }
    }

    // Thêm truyện
    document.getElementById('addComicForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const title = document.getElementById('comicTitle').value;
        const content = document.getElementById('comicContent').value;
        const link = document.getElementById('comicLink').value;

        const response = await fetch('/api/cards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([{ title, content, link }])
        });

        if (response.ok) {
            this.reset();
            bootstrap.Modal.getInstance(document.getElementById('addComicModal')).hide();
            fetchComics();
        } else {
            alert('Lỗi khi thêm truyện!');
        }
    });

    // Thêm chương
    document.getElementById('addChapterForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const cardId = document.getElementById('chapterCardId').value;
        const chapterNumber = document.getElementById('chapterNumber').value;
        const chapterTitle = document.getElementById('chapterTitle').value;
        const content = document.getElementById('chapterContent').value;
        const imageFolder = document.getElementById('chapterImageFolder').value;
        const imageCount = document.getElementById('chapterImageCount').value;
        const imageLink = document.getElementById('chapterImageLink').value;

        const response = await fetch('/api/chapters', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                [cardId]: [{ 
                    chapterNumber, 
                    chapterTitle, 
                    content, 
                    imageFolder, 
                    imageCount,
                    imageLink
                }] 
            })
        });

        if (response.ok) {
            this.reset();
            bootstrap.Modal.getInstance(document.getElementById('addChapterModal')).hide();
            showChapters(cardId);
        } else {
            alert('Lỗi khi thêm chương!');
        }
    });

    // Thêm người dùng
    document.getElementById('addUserForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('userName').value;
        const email = document.getElementById('userEmail').value;
        const password = document.getElementById('userPassword').value;

        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        if (response.ok) {
            this.reset();
            bootstrap.Modal.getInstance(document.getElementById('addUserModal')).hide();
            fetchUsers();
        } else {
            alert('Lỗi khi thêm người dùng!');
        }
    });

    // Load dữ liệu khi trang được tải
    fetchComics();
    fetchUsers();

    // Thêm sự kiện cho nút đăng xuất
    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'logoutButton') {
            logout();
        }
    });
});

// Function to check if user is already logged in
function checkLoginStatus() {
    const token = localStorage.getItem('token');
    const roleId = localStorage.getItem('roleId');

    // Nếu không có token hoặc roleId, chuyển hướng về trang chính
    if (!token || !roleId) {
        window.location.href = '/';
        return;
    }

    // Nếu roleId không phải admin (roleId !== '1'), chuyển hướng về trang chính
    if (roleId !== '1') {
        window.location.href = '/';
        return;
    }

    // Nếu là admin, tiếp tục ở lại trang admin-web
    console.log('User is logged in as admin');
}

// Function to handle logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('roleId');

    // Chuyển hướng về trang chính
    setTimeout(() => {
        window.location.href = '/';
    }, 500);
}