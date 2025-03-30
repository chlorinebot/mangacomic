// controllers/userController.js
const { getAllUsers, deleteUser, updateUser } = require('../service/userService');

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
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng để xóa' });
        }
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

        // Kiểm tra dữ liệu đầu vào
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ username, email và password' });
        }

        const result = await updateUser(id, username, email, password);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng để cập nhật' });
        }
        res.json({ message: 'Cập nhật người dùng thành công!', affectedRows: result.affectedRows });
    } catch (err) {
        console.error('Lỗi khi cập nhật user:', err.stack);
        res.status(500).json({ error: 'Lỗi server khi cập nhật user', details: err.message });
    }
};

module.exports = { getUsers, deleteUserData, updateUser: updateUserData };