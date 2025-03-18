const express = require('express');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

// Middleware
app.use(express.static('public'));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views');

// Cấu hình pool kết nối MySQL
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

// Hàm kiểm tra kết nối khi khởi động server
(async () => {
    try {
        const connection = await dbPool.getConnection();
        console.log('Đã kết nối tới MySQL!');
        connection.release();
    } catch (err) {
        console.error('Lỗi kết nối MySQL khi khởi động:', err.stack);
        process.exit(1);
    }
})();

// Secret key cho JWT
const JWT_SECRET = 'your-secret-key';

// Middleware xử lý lỗi chung
app.use((err, req, res, next) => {
    console.error('Lỗi không xử lý được:', err.stack);
    res.status(500).json({ error: 'Lỗi server nội bộ', details: err.message });
});

// Route để lấy tất cả cards
app.get('/api/cards', checkDbConnection, async (req, res) => {
    let connection;
    try {
        connection = await dbPool.getConnection();
        console.log('Lấy kết nối cho /api/cards');
        const [rows] = await connection.query('SELECT id, title, image, content FROM cards');
        res.json(rows);
    } catch (err) {
        console.error('Lỗi khi lấy cards:', err.stack);
        res.status(500).json({ error: 'Lỗi server khi lấy cards', details: err.message });
    } finally {
        if (connection) {
            connection.release();
            console.log('Đã release kết nối cho /api/cards');
        }
    }
});

// Route để lấy tất cả chapters
app.get('/api/chapters', checkDbConnection, async (req, res) => {
    let connection;
    try {
        connection = await dbPool.getConnection();
        console.log('Lấy kết nối cho /api/chapters');
        const [rows] = await connection.query('SELECT card_id, chapter_number, chapter_title, content, image_folder, image_count FROM chapters');
        const chapterData = {};
        rows.forEach(row => {
            if (!chapterData[row.card_id]) chapterData[row.card_id] = [];
            chapterData[row.card_id].push({
                chapterNumber: row.chapter_number,
                chapterTitle: row.chapter_title,
                content: row.content,
                imageFolder: row.image_folder,
                imageCount: row.image_count
            });
        });
        res.json(chapterData);
    } catch (err) {
        console.error('Lỗi khi lấy chapters:', err.stack);
        res.status(500).json({ error: 'Lỗi server khi lấy chapters', details: err.message });
    } finally {
        if (connection) {
            connection.release();
            console.log('Đã release kết nối cho /api/chapters');
        }
    }
});

// Route để đăng ký
app.post('/api/register', checkDbConnection, async (req, res) => {
    let connection;
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin!' });
        }

        connection = await dbPool.getConnection();
        console.log('Lấy kết nối cho /api/register');

        await connection.beginTransaction();
        console.log('Bắt đầu giao dịch đăng ký');

        const [existingUsers] = await connection.query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, email]
        );
        if (existingUsers.length > 0) {
            throw new Error('Tên người dùng hoặc email đã tồn tại!');
        }

        // Lưu mật khẩu dưới dạng văn bản thuần (không mã hóa)
        const [result] = await connection.query(
            'INSERT INTO users (username, email, password, role_id) VALUES (?, ?, ?, 2)',
            [username, email, password]
        );
        console.log('Thực thi INSERT, affectedRows:', result.affectedRows, 'userId:', result.insertId);

        const [newUser] = await connection.query(
            'SELECT * FROM users WHERE id = ?',
            [result.insertId]
        );
        if (!newUser.length) {
            throw new Error('Dữ liệu không được lưu vào database sau INSERT!');
        }
        console.log('Xác nhận dữ liệu:', newUser[0]);

        await connection.commit();
        console.log('Giao dịch đăng ký commit thành công, userId:', result.insertId);
        res.status(201).json({ message: 'Đăng ký thành công!', userId: result.insertId });
    } catch (err) {
        if (connection) {
            await connection.rollback();
            console.log('Giao dịch đăng ký rollback do lỗi:', err.message);
        }
        console.error('Lỗi khi đăng ký:', err.stack);
        res.status(500).json({ error: 'Lỗi server khi đăng ký', details: err.message });
    } finally {
        if (connection) {
            connection.release();
            console.log('Đã release kết nối cho /api/register');
        }
    }
});

// Route để đăng nhập
app.post('/api/login', checkDbConnection, async (req, res) => {
    let connection;
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Vui lòng cung cấp username và password!' });
        }

        connection = await dbPool.getConnection();
        console.log('Lấy kết nối cho /api/login với username:', username);

        await connection.beginTransaction();
        console.log('Bắt đầu giao dịch đăng nhập');

        const [users] = await connection.query(
            'SELECT id, username, password, role_id FROM users WHERE username = ?',
            [username]
        );
        console.log('Kết quả truy vấn users:', users);

        if (users.length === 0) {
            return res.status(401).json({ error: 'Tên người dùng không tồn tại!' });
        }

        const user = users[0];
        console.log('Người dùng tìm thấy:', user);

        // So sánh mật khẩu trực tiếp (không mã hóa)
        const isMatch = password === user.password;
        console.log('Kết quả so sánh mật khẩu:', isMatch);

        if (!isMatch) {
            return res.status(401).json({ error: 'Mật khẩu không đúng!' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role_id: user.role_id },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        console.log('Tạo token thành công:', token);

        await connection.commit();
        console.log('Giao dịch đăng nhập commit thành công');
        res.json({ message: 'Đăng nhập thành công!', token, role_id: user.role_id });
    } catch (err) {
        if (connection) {
            await connection.rollback();
            console.log('Giao dịch đăng nhập rollback do lỗi:', err.message);
        }
        console.error('Lỗi khi đăng nhập:', err.stack);
        res.status(500).json({ error: 'Lỗi server khi đăng nhập', details: err.message });
    } finally {
        if (connection) {
            connection.release();
            console.log('Đã release kết nối cho /api/login');
        }
    }
});

// Route để phục vụ admin-web.ejs
app.get('/admin-web', checkDbConnection, (req, res) => {
    res.render('admin-web');
});

// Route root (index.ejs)
app.get('/', checkDbConnection, async (req, res) => {
    let connection;
    try {
        connection = await dbPool.getConnection();
        console.log('Lấy kết nối cho route /');
        const [rows] = await connection.query('SELECT VERSION() as version');
        res.render('index', { mysqlVersion: rows[0].version });
    } catch (err) {
        console.error('Lỗi khi lấy version MySQL:', err.stack);
        res.status(500).send('Lỗi server');
    } finally {
        if (connection) {
            connection.release();
            console.log('Đã release kết nối cho route /');
        }
    }
});

// Route để lưu cardData
app.post('/api/cards', checkDbConnection, async (req, res) => {
    let connection;
    try {
        connection = await dbPool.getConnection();
        console.log('Lấy kết nối cho /api/cards (POST)');
        await connection.beginTransaction();

        const cards = req.body;
        const query = 'INSERT INTO cards (id, title, image, content, link) VALUES ? ON DUPLICATE KEY UPDATE title=VALUES(title), image=VALUES(image), content=VALUES(content), link=VALUES(link)';
        const values = cards.map(card => [card.id, card.title, card.image, card.content, card.link]);

        const [result] = await connection.query(query, [values]);
        await connection.commit();
        console.log('Lưu cards thành công, affectedRows:', result.affectedRows);
        res.json({ message: 'Cards đã được lưu thành công!', affectedRows: result.affectedRows });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('Lỗi khi lưu cards:', err.stack);
        res.status(500).json({ error: 'Lỗi server khi lưu cards', details: err.message });
    } finally {
        if (connection) {
            connection.release();
            console.log('Đã release kết nối cho /api/cards (POST)');
        }
    }
});

// Route để lưu chapterData
app.post('/api/chapters', checkDbConnection, async (req, res) => {
    let connection;
    try {
        connection = await dbPool.getConnection();
        console.log('Lấy kết nối cho /api/chapters (POST)');
        await connection.beginTransaction();

        const chapters = req.body;
        const query = 'INSERT INTO chapters (card_id, chapter_number, chapter_title, content, image_folder, image_count, rating, comment_count) VALUES ? ON DUPLICATE KEY UPDATE chapter_title=VALUES(chapter_title), content=VALUES(content), image_folder=VALUES(image_folder), image_count=VALUES(image_count), rating=VALUES(rating), comment_count=VALUES(comment_count)';
        
        const values = [];
        Object.keys(chapters).forEach(cardId => {
            chapters[cardId].forEach(chapter => {
                values.push([
                    cardId,
                    chapter.chapterNumber,
                    chapter.chapterTitle,
                    chapter.content,
                    chapter.imageFolder,
                    chapter.imageCount,
                    chapter.rating,
                    chapter.commentCount
                ]);
            });
        });

        const [result] = await connection.query(query, [values]);
        await connection.commit();
        console.log('Lưu chapters thành công, affectedRows:', result.affectedRows);
        res.json({ message: 'Chapters đã được lưu thành công!', affectedRows: result.affectedRows });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('Lỗi khi lưu chapters:', err.stack);
        res.status(500).json({ error: 'Lỗi server khi lưu chapters', details: err.message });
    } finally {
        if (connection) {
            connection.release();
            console.log('Đã release kết nối cho /api/chapters (POST)');
        }
    }
});

app.listen(port, () => {
    console.log(`Server chạy tại http://localhost:${port}`);
});

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