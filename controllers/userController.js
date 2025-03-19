// controllers/userController.js
const { getAllUsers, deleteUser } = require('../models/userModel');

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

module.exports = { getUsers, deleteUserData };