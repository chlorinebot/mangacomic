// users.js
let originalUsers = [];

export async function fetchUsers() {
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

export function renderUsers(users) {
    const tableBody = document.getElementById('userTableBody');
    if (!tableBody) {
        console.error('Không tìm thấy phần tử userTableBody trong DOM');
        return;
    }
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
}

export async function deleteUser(button) {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
        try {
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
                const errorData = await response.json();
                throw new Error(errorData.error || 'Lỗi khi xóa người dùng');
            }
        } catch (error) {
            console.error('Lỗi khi xóa người dùng:', error);
            alert('Lỗi khi xóa người dùng: ' + error.message);
        }
    }
}

export async function editUser(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/users', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Lỗi khi lấy danh sách người dùng');
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
}

export function searchUsers() {
    const searchTerm = document.getElementById('userSearch').value.trim().toLowerCase();
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
}