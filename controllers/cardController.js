// cardController.js
const { dbPool } = require('../data/dbConfig');

// Lấy danh sách truyện
exports.getCards = async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
        // Lấy danh sách cards và các thể loại liên quan
        const [cards] = await connection.query(`
            SELECT c.*, GROUP_CONCAT(g.genre_name) as genre_names
            FROM cards c
            LEFT JOIN card_genres cg ON c.id = cg.card_id
            LEFT JOIN genres g ON cg.genre_id = g.genre_id
            GROUP BY c.id
        `);
        res.json(cards);
    } catch (err) {
        console.error('Lỗi khi lấy danh sách cards:', err);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách cards' });
    } finally {
        connection.release();
    }
};

// Thêm truyện mới
exports.saveCardData = async (req, res) => {
    const { title, image, content, link, hashtags, genres } = req.body; // genres là mảng các genre_id
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();

        // Thêm truyện mới vào bảng cards
        const [result] = await connection.query(
            'INSERT INTO cards (title, image, content, link, hashtags) VALUES (?, ?, ?, ?, ?)',
            [title, image, content, link, hashtags]
        );
        const cardId = result.insertId;

        // Thêm các thể loại vào bảng card_genres
        if (genres && Array.isArray(genres) && genres.length > 0) {
            const genreValues = genres.map(genreId => [cardId, genreId]);
            await connection.query(
                'INSERT INTO card_genres (card_id, genre_id) VALUES ?',
                [genreValues]
            );
        }

        await connection.commit();
        res.status(201).json({ id: cardId, title, image, content, link, hashtags, genres });
    } catch (err) {
        await connection.rollback();
        console.error('Lỗi khi lưu card:', err);
        res.status(500).json({ error: 'Lỗi khi lưu card' });
    } finally {
        connection.release();
    }
};

// Xóa truyện
exports.deleteCardData = async (req, res) => {
    const { id } = req.params;
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();
        const [result] = await connection.query('DELETE FROM cards WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Truyện không tồn tại' });
        }
        await connection.commit();
        res.json({ message: 'Xóa truyện thành công' });
    } catch (err) {
        await connection.rollback();
        console.error('Lỗi khi xóa truyện:', err);
        res.status(500).json({ error: 'Lỗi khi xóa truyện' });
    } finally {
        connection.release();
    }
};

// Cập nhật truyện
exports.updateCard = async (req, res) => {
    const { id } = req.params;
    const { title, image, content, link, hashtags, genres } = req.body;
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();

        // Cập nhật thông tin truyện
        const [result] = await connection.query(
            'UPDATE cards SET title = ?, image = ?, content = ?, link = ?, hashtags = ? WHERE id = ?',
            [title, image, content, link, hashtags, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Truyện không tồn tại' });
        }

        // Xóa các thể loại cũ
        await connection.query('DELETE FROM card_genres WHERE card_id = ?', [id]);

        // Thêm các thể loại mới
        if (genres && Array.isArray(genres) && genres.length > 0) {
            const genreValues = genres.map(genreId => [id, genreId]);
            await connection.query(
                'INSERT INTO card_genres (card_id, genre_id) VALUES ?',
                [genreValues]
            );
        }

        await connection.commit();
        res.json({ id, title, image, content, link, hashtags, genres });
    } catch (err) {
        await connection.rollback();
        console.error('Lỗi khi cập nhật card:', err);
        res.status(500).json({ error: 'Lỗi khi cập nhật card' });
    } finally {
        connection.release();
    }
};