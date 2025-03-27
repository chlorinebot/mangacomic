// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const checkAdminAuth = (req, res, next) => {
    // Lấy token từ cookie
    const cookies = req.headers.cookie;
    let token;

    if (cookies) {
        const cookieArray = cookies.split(';');
        const tokenCookie = cookieArray.find(cookie => cookie.trim().startsWith('token='));
        if (tokenCookie) {
            token = tokenCookie.split('=')[1];
        }
    }

    // Nếu không có token, render 401
    if (!token) {
        console.log('No token found in cookies, rendering 401');
        return res.status(401).render('401', { error: 'No token provided' });
    }

    try {
        // Giải mã token
        const decoded = jwt.verify(token, JWT_SECRET);
        const roleId = decoded.role_id;

        console.log('Decoded token:', decoded);
        console.log('Role ID:', roleId);

        // Nếu role_id không phải 1, render 401
        if (roleId != '1') {
            console.log('User is not an admin, rendering 401');
            return res.status(401).render('401', { error: 'User is not an admin' });
        }

        // Nếu là admin, lưu thông tin user và tiếp tục
        req.user = decoded;
        console.log('User is admin, proceeding to admin-web');
        next();
    } catch (err) {
        // Nếu token không hợp lệ, render 401
        console.error('Lỗi xác thực token:', err.stack);
        return res.status(401).render('401', { error: 'Invalid token' });
    }
};

module.exports = { checkAdminAuth };