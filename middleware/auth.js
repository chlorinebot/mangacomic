// middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your-secret-key'; // Replace with your actual secret key

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token không được cung cấp!' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token không hợp lệ!' });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;