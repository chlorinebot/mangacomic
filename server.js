const express = require('express');
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

// Khởi động server nodemon app.js
app.listen(port, () => {
    console.log(`Server chạy tại http://localhost:${port}`);
});