const express = require('express');
const { dbPool, checkDbConnection, initializeDb } = require('./data/dbConfig');
const { getCards, saveCardData, deleteCardData, updateCard } = require('./controllers/cardController');
const { getChapters, saveChapterData, deleteChapterData } = require('./controllers/chapterController');
const { getUsers, deleteUserData, updateUser: updateUserData } = require('./controllers/userController');
const { register, login } = require('./controllers/authController');
const { checkAdminAuth } = require('./middleware/authMiddleware');

const app = express();
const port = 3000;

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

// API cho cards
app.get('/api/cards', checkDbConnection, getCards);
app.post('/api/cards', checkDbConnection, saveCardData);
app.delete('/api/cards/:id', checkDbConnection, deleteCardData);
app.put('/api/cards/:id', checkDbConnection, updateCard);

// API lấy thể loại của một truyện
app.get('/api/cards/:id/genres', checkDbConnection, async (req, res) => {
    const { id } = req.params;
    const connection = await dbPool.getConnection();
    try {
        const [rows] = await connection.query(
            'SELECT g.genre_id, g.genre_name FROM genres g ' +
            'JOIN card_genres cg ON g.genre_id = cg.genre_id ' +
            'WHERE cg.card_id = ?',
            [id]
        );
        res.json(rows);
    } catch (err) {
        console.error('Lỗi khi lấy thể loại của truyện:', err);
        res.status(500).json({ error: 'Lỗi khi lấy thể loại của truyện' });
    } finally {
        connection.release();
    }
});

// API cập nhật thể loại của một truyện
app.put('/api/cards/:id/genres', checkDbConnection, async (req, res) => {
    const { id } = req.params;
    const { genres } = req.body;
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();

        // Xóa các thể loại hiện tại của truyện
        await connection.query('DELETE FROM card_genres WHERE card_id = ?', [id]);

        // Thêm các thể loại mới
        if (genres && genres.length > 0) {
            const values = genres.map(genreId => [id, genreId]);
            await connection.query('INSERT INTO card_genres (card_id, genre_id) VALUES ?', [values]);
        }

        await connection.commit();
        res.json({ message: 'Cập nhật thể loại thành công' });
    } catch (err) {
        await connection.rollback();
        console.error('Lỗi khi cập nhật thể loại:', err);
        res.status(500).json({ error: 'Lỗi khi cập nhật thể loại' });
    } finally {
        connection.release();
    }
});

// API cho chapters
app.get('/api/chapters', checkDbConnection, getChapters);
app.post('/api/chapters', checkDbConnection, saveChapterData);
app.delete('/api/chapters', checkDbConnection, deleteChapterData);

// API cho users
app.get('/api/users', checkDbConnection, getUsers);
app.delete('/api/users/:id', checkDbConnection, deleteUserData);
app.put('/api/users/:id', checkDbConnection, updateUserData);

// API cho genres
app.get('/api/genres', checkDbConnection, async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM genres');
        res.json(rows);
    } catch (err) {
        console.error('Lỗi khi lấy danh sách thể loại:', err);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách thể loại' });
    } finally {
        connection.release();
    }
});

app.post('/api/genres', checkDbConnection, async (req, res) => {
    const { genre_name } = req.body;
    if (!genre_name) {
        return res.status(400).json({ error: 'Tên thể loại là bắt buộc' });
    }
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();
        const [result] = await connection.query('INSERT INTO genres (genre_name) VALUES (?)', [genre_name]);
        await connection.commit();
        res.status(201).json({ genre_id: result.insertId, genre_name });
    } catch (err) {
        await connection.rollback();
        console.error('Lỗi khi thêm thể loại:', err);
        res.status(500).json({ error: 'Lỗi khi thêm thể loại' });
    } finally {
        connection.release();
    }
});

app.put('/api/genres/:id', checkDbConnection, async (req, res) => {
    const { id } = req.params;
    const { genre_name } = req.body;
    if (!genre_name) {
        return res.status(400).json({ error: 'Tên thể loại là bắt buộc' });
    }
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();
        const [result] = await connection.query('UPDATE genres SET genre_name = ? WHERE genre_id = ?', [genre_name, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Thể loại không tồn tại' });
        }
        await connection.commit();
        res.json({ genre_id: id, genre_name });
    } catch (err) {
        await connection.rollback();
        console.error('Lỗi khi cập nhật thể loại:', err);
        res.status(500).json({ error: 'Lỗi khi cập nhật thể loại' });
    } finally {
        connection.release();
    }
});

app.delete('/api/genres/:id', checkDbConnection, async (req, res) => {
    const { id } = req.params;
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();
        const [result] = await connection.query('DELETE FROM genres WHERE genre_id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Thể loại không tồn tại' });
        }
        await connection.commit();
        res.json({ message: 'Xóa thể loại thành công' });
    } catch (err) {
        await connection.rollback();
        console.error('Lỗi khi xóa thể loại:', err);
        res.status(500).json({ error: 'Lỗi khi xóa thể loại' });
    } finally {
        connection.release();
    }
});

// API đếm số lượng truyện
app.get('/api/cards/count', [checkDbConnection, checkAdminAuth], async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
        const [rows] = await connection.query('SELECT COUNT(*) as count FROM cards');
        res.json({ count: rows[0].count });
    } catch (err) {
        console.error('Lỗi khi đếm số lượng truyện:', err);
        res.status(500).json({ error: 'Lỗi khi đếm số lượng truyện' });
    } finally {
        connection.release();
    }
});

// API đếm số lượng người dùng
app.get('/api/users/count', [checkDbConnection, checkAdminAuth], async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
        const [rows] = await connection.query('SELECT COUNT(*) as count FROM users');
        res.json({ count: rows[0].count });
    } catch (err) {
        console.error('Lỗi khi đếm số lượng người dùng:', err);
        res.status(500).json({ error: 'Lỗi khi đếm số lượng người dùng' });
    } finally {
        connection.release();
    }
});

// API đếm số lượng thể loại
app.get('/api/genres/count', [checkDbConnection, checkAdminAuth], async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
        const [rows] = await connection.query('SELECT COUNT(*) as count FROM genres');
        res.json({ count: rows[0].count });
    } catch (err) {
        console.error('Lỗi khi đếm số lượng thể loại:', err);
        res.status(500).json({ error: 'Lỗi khi đếm số lượng thể loại' });
    } finally {
        connection.release();
    }
});

// API đếm số lượng chương
app.get('/api/chapters/count', [checkDbConnection, checkAdminAuth], async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
        const [rows] = await connection.query('SELECT COUNT(*) as count FROM chapters');
        res.json({ count: rows[0].count });
    } catch (err) {
        console.error('Lỗi khi đếm số lượng chương:', err);
        res.status(500).json({ error: 'Lỗi khi đếm số lượng chương' });
    } finally {
        connection.release();
    }
});

// API đăng ký và đăng nhập
app.post('/api/register', checkDbConnection, register);
app.post('/api/login', checkDbConnection, login);

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

// Xử lý 404 cho các route không xác định
app.use((req, res, next) => {
    res.status(404).render('404');
});

// Khởi động server
app.listen(port, async () => {
    await initializeDb();
    console.log(`Server chạy tại http://localhost:${port}`);
});

// Đóng pool kết nối khi server tắt
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