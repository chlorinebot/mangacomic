// data/dbConfig.js
const mysql = require('mysql2/promise');

const dbPool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '123456', // Thay bằng mật khẩu MySQL của bạn
    database: 'EBook',
    port: 3306,
    connectionLimit: 20,
    waitForConnections: true,
    queueLimit: 0
});

// Middleware kiểm tra kết nối database
const checkDbConnection = async (req, res, next) => {
    try {
        const connection = await dbPool.getConnection();
        await connection.ping();
        connection.release();
        next();
    } catch (err) {
        console.error('Lỗi kiểm tra kết nối database:', err.stack);
        res.status(503).json({ error: 'Dịch vụ không khả dụng, lỗi kết nối database' });
    }
};

// Hàm kiểm tra kết nối khi khởi động
const initializeDb = async () => {
    try {
        const connection = await dbPool.getConnection();
        console.log('Đã kết nối tới MySQL!');
        connection.release();
    } catch (err) {
        console.error('Lỗi kết nối MySQL khi khởi động:', err.stack);
        process.exit(1);
    }
};

module.exports = { dbPool, checkDbConnection, initializeDb };