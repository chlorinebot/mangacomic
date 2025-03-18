const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Phục vụ tài nguyên tĩnh từ thư mục public
app.use(express.static('public'));
// Phục vụ Bootstrap từ node_modules
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));
// Cấu hình EJS làm template engine
app.set('view engine', 'ejs');
app.set('views', './views');
// Route ví dụ
app.get('/', (req, res) => {
    res.render('index');
});

// Thiết lập kết nối MySQL
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'EBook',
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error('Lỗi kết nối MySQL:', err);
        return;
    }
    console.log('Đã kết nối tới MySQL!');
});

// Route ví dụ
app.get('/', (req, res) => {
    db.query('SELECT VERSION() as version', (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn:', err);
            res.status(500).send('Lỗi server');
            return;
        }
        res.render('index', { mysqlVersion: results[0].version });
    });
});

// Khởi động server nodemon server.js
app.listen(port, () => {
    console.log(`Server chạy tại http://localhost:${port}`);
});