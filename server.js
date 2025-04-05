const express = require('express');
const { dbPool, checkDbConnection, initializeDb } = require('./data/dbConfig');
const { getCards, saveCardData, deleteCardData, updateCard, countCards } = require('./controllers/cardController');
const { getChapters, saveChapterData, deleteChapterData, countChapters } = require('./controllers/chapterController');
const { getUsers, deleteUserData, updateUser: updateUserData, countUsers } = require('./controllers/userController');
const { register, login } = require('./controllers/authController');
const { getGenres, createGenre, updateGenre, deleteGenre, getCardGenres, updateCardGenres, countGenres } = require('./controllers/genreController');
const { checkFavoriteStatus, addToFavorites, removeFromFavorites } = require('./controllers/favoriteController');
const { checkAdminAuth, verifyToken } = require('./middleware/authMiddleware');
const { getUserProfile, getUserFavorites } = require('./controllers/profileController');
const { addReadingHistory, getReadingHistoryByUser, deleteReadingHistory, clearReadingHistory } = require('./controllers/readingHistoryController');
const apiRoutes = require('./routes/api');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views');

// Sử dụng routes từ file api.js
app.use('/api', apiRoutes);

// Middleware xử lý lỗi chung
app.use((err, req, res, next) => {
    console.error('Lỗi không xử lý được:', err.stack);
    res.status(500).json({ error: 'Lỗi server nội bộ', details: err.message });
});

// API cho cards
app.get('/api/cards', checkDbConnection, getCards);
app.post('/api/cards', checkDbConnection, saveCardData);
app.delete('/api/cards/:id', checkDbConnection, deleteCardData);
app.put('/api/cards/:id', checkDbConnection, updateCard);

// API cho thể loại của một truyện
app.get('/api/cards/:id/genres', checkDbConnection, getCardGenres);
app.put('/api/cards/:id/genres', checkDbConnection, updateCardGenres);

// API cho lịch sử đọc
app.post('/api/reading-history', checkDbConnection, addReadingHistory);
app.get('/api/reading-history/:userId', checkDbConnection, getReadingHistoryByUser);
app.delete('/api/reading-history/:historyId', checkDbConnection, verifyToken, deleteReadingHistory);
app.delete('/api/reading-history/clear/all', checkDbConnection, verifyToken, clearReadingHistory);

// API cho chapters
app.get('/api/chapters', checkDbConnection, getChapters);
app.post('/api/chapters', checkDbConnection, saveChapterData);
app.delete('/api/chapters', checkDbConnection, deleteChapterData);

// API cho users
app.get('/api/users', checkDbConnection, getUsers);
app.delete('/api/users/:id', checkDbConnection, deleteUserData);
app.put('/api/users/:id', checkDbConnection, updateUserData);

// API cho genres
app.get('/api/genres', checkDbConnection, getGenres);
app.post('/api/genres', checkDbConnection, createGenre);
app.put('/api/genres/:id', checkDbConnection, updateGenre);
app.delete('/api/genres/:id', checkDbConnection, deleteGenre);

// API cho favorites
app.get('/api/favorites/:userId/:cardId', checkDbConnection, checkFavoriteStatus);
app.post('/api/favorites', checkDbConnection, addToFavorites);
app.delete('/api/favorites/:userId/:cardId', checkDbConnection, removeFromFavorites);

// API đếm số lượng
app.get('/api/cards/count', [checkDbConnection, checkAdminAuth], countCards);
app.get('/api/users/count', [checkDbConnection, checkAdminAuth], countUsers);
app.get('/api/genres/count', [checkDbConnection, checkAdminAuth], countGenres);
app.get('/api/chapters/count', [checkDbConnection, checkAdminAuth], countChapters);

// API đăng ký và đăng nhập
app.post('/api/register', checkDbConnection, register);
app.post('/api/login', checkDbConnection, login);

// API cho thông tin người dùng và danh sách yêu thích
app.get('/api/users/:userId', checkDbConnection, getUserProfile);
app.get('/api/favorites/:userId', checkDbConnection, getUserFavorites);

// Route admin
app.get('/admin-web', checkDbConnection, checkAdminAuth, (req, res) => {
    res.render('admin-web', { user: req.user });
});

// Route cho trang lỗi
app.get('/401', (req, res) => {
    res.render('401', { error: 'Direct access to 401 page' });
});

app.get('/404', (req, res) => {
    res.status(404).render('404');
});

// Route trang chủ
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

// Khởi tạo DB và mở cổng
const startServer = async () => {
    try {
        await initializeDb();
        app.listen(port, () => {
            console.log(`Server đang chạy tại http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Không thể khởi tạo database:', err);
        process.exit(1);
    }
};

// Xử lý khi có lỗi không bắt được
process.on('uncaughtException', (err) => {
    console.error('Lỗi không bắt được:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Lỗi promise không được xử lý:', reason);
});

startServer();