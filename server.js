const express = require('express');
const { dbPool, checkDbConnection, initializeDb } = require('./data/dbConfig');
const { getCards, saveCardData, deleteCardData, updateCard } = require('./controllers/cardController');
const { getChapters, saveChapterData, deleteChapterData } = require('./controllers/chapterController');
const { getUsers, deleteUserData, updateUser: updateUserData } = require('./controllers/userController');
const { register, login } = require('./controllers/authController');

const app = express();
const port = 3000;

// Middleware
app.use(express.static('public'));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware xử lý lỗi chung
app.use((err, req, res, next) => {
    console.error('Lỗi không xử lý được:', err.stack);
    res.status(500).json({ error: 'Lỗi server nội bộ', details: err.message });
});

// Routes
app.get('/api/cards', checkDbConnection, getCards);
app.post('/api/cards', checkDbConnection, saveCardData);
app.delete('/api/cards/:id', checkDbConnection, deleteCardData);
app.put('/api/cards/:id', checkDbConnection, updateCard);

app.get('/api/chapters', checkDbConnection, getChapters);
app.post('/api/chapters', checkDbConnection, saveChapterData);
app.delete('/api/chapters', checkDbConnection, deleteChapterData);

app.get('/api/users', checkDbConnection, getUsers);
app.delete('/api/users/:id', checkDbConnection, deleteUserData);
app.put('/api/users/:id', checkDbConnection, updateUserData);

app.post('/api/register', checkDbConnection, register);
app.post('/api/login', checkDbConnection, login);

app.get('/admin-web', checkDbConnection, (req, res) => res.render('admin-web'));

app.get('/', checkDbConnection, async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
        const [rows] = await connection.query('SELECT VERSION() as version');
        res.render('index', { mysqlVersion: rows[0].version });
    } catch (err) {
        console.error('Lỗi khi lấy version MySQL:', err.stack);
        res.status(500).send('Lỗi server');
    } finally {
        connection.release();
    }
});

// Khởi động server
app.listen(port, async () => {
    await initializeDb();
    console.log(`Server chạy tại http://localhost:${port}`);
});

// Xử lý tắt server
process.on('SIGTERM', async () => {
    await dbPool.end();
    console.log('Đã đóng pool kết nối MySQL');
    process.exit(0);
});

process.on('SIGINT', async () => {
    await dbPool.end();
    console.log('Đã đóng pool kết nối MySQL');
    process.exit(0);
});