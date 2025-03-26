// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { registerUser, loginUser } = require('../models/userModel');

const JWT_SECRET = 'your-secret-key';
const saltRounds = 10;

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin!' });
        }
        const { userId } = await registerUser(username, email, password);
        res.status(201).json({ message: 'Đăng ký thành công!', userId });
    } catch (err) {
        console.error('Lỗi khi đăng ký:', err.stack);
        res.status(500).json({ error: 'Tên người dùng hoặc email đã tồn tại!', details: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Vui lòng cung cấp username và password!' });
        }
        const user = await loginUser(username);
        if (!user) {
            return res.status(401).json({ error: 'Tên người dùng không tồn tại!' });
        }
        // Verify the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Mật khẩu không đúng!' });
        }
        const token = jwt.sign({ id: user.id, username: user.username, role_id: user.role_id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Đăng nhập thành công!', token, role_id: user.role_id });
    } catch (err) {
        console.error('Lỗi khi đăng nhập:', err.stack);
        res.status(500).json({ error: 'Lỗi server khi đăng nhập', details: err.message });
    }
};

module.exports = { register, login };