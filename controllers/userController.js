// controllers/userController.js
const { getAllUsers, deleteUser, updateUser, loginUser, changeUserPassword } = require('../models/userModel');
const bcrypt = require('bcrypt');

const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (err) {
        console.error('Lỗi khi lấy users:', err.stack);
        res.status(500).json({ error: 'Lỗi server khi lấy users', details: err.message });
    }
};

const deleteUserData = async (req, res) => {
    try {
        const result = await deleteUser(req.params.id);
        res.json({ message: 'Xóa người dùng thành công!', affectedRows: result.affectedRows });
    } catch (err) {
        console.error('Lỗi khi xóa user:', err.stack);
        res.status(500).json({ error: 'Lỗi server khi xóa user', details: err.message });
    }
};

const updateUserData = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;
        const result = await updateUser(id, username, email, password);
        res.json({ message: 'Cập nhật người dùng thành công!', affectedRows: result.affectedRows });
    } catch (err) {
        console.error('Lỗi khi cập nhật user:', err.stack);
        res.status(500).json({ error: 'Lỗi server khi cập nhật user', details: err.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const { username, currentPassword, newPassword } = req.body;

        // Validate input
        if (!username || !currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin!' });
        }

        // Verify the user making the request matches the token
        if (req.user.username !== username) {
            return res.status(403).json({ error: 'Bạn không có quyền đổi mật khẩu của người dùng này!' });
        }

        // Fetch the user to verify the current password
        const user = await loginUser(username);
        if (!user) {
            return res.status(404).json({ error: 'Người dùng không tồn tại!' });
        }

        // Verify the current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Mật khẩu hiện tại không đúng!' });
        }

        // Update the password
        const result = await changeUserPassword(username, newPassword);
        res.json({ message: 'Đổi mật khẩu thành công!', affectedRows: result.affectedRows });
    } catch (err) {
        console.error('Lỗi khi đổi mật khẩu:', err.stack);
        res.status(500).json({ error: 'Lỗi server khi đổi mật khẩu', details: err.message });
    }
};

module.exports = { getUsers, deleteUserData, updateUser: updateUserData, changePassword };