// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware kiểm tra token và role_id
const checkAdminAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Lấy token từ header Authorization: Bearer <token>

    if (!token) {
        return res.status(401).render('401'); // Chưa đăng nhập -> render 401.ejs
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const roleId = decoded.role_id;

        if (roleId !== '1') {
            return res.status(401).render('401'); // Không phải admin -> render 401.ejs
        }

        req.user = decoded; // Lưu thông tin user vào request để sử dụng sau nếu cần
        next(); // Là admin -> tiếp tục
    } catch (err) {
        console.error('Lỗi xác thực token:', err.stack);
        return res.status(401).render('401'); // Token không hợp lệ -> render 401.ejs
    }
};

module.exports = { checkAdminAuth };