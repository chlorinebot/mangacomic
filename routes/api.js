const express = require('express');
const router = express.Router();
const { dbPool } = require('../data/dbConfig');

// Lấy thông tin chapter theo cardId và chapterNumber
router.get('/chapters/:cardId/:chapterNumber', async (req, res) => {
    const { cardId, chapterNumber } = req.params;
    
    if (!cardId || !chapterNumber) {
        return res.status(400).json({ error: 'Thiếu thông tin card_id hoặc chapter_number' });
    }
    
    const connection = await dbPool.getConnection();
    try {
        const [rows] = await connection.query(
            'SELECT * FROM chapters WHERE card_id = ? AND chapter_number = ?',
            [cardId, chapterNumber]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy chapter' });
        }
        
        res.json(rows[0]);
    } catch (err) {
        console.error('Lỗi khi lấy thông tin chapter:', err);
        res.status(500).json({ error: 'Lỗi khi lấy thông tin chapter', details: err.message });
    } finally {
        connection.release();
    }
});

// API đánh giá chương
// Lấy đánh giá của người dùng cho một chương cụ thể
router.get('/ratings', async (req, res) => {
    const { user_id, chapter_id } = req.query;
    
    if (!user_id || !chapter_id) {
        return res.status(400).json({ error: 'Thiếu thông tin user_id hoặc chapter_id' });
    }
    
    const connection = await dbPool.getConnection();
    try {
        const [rows] = await connection.query(
            'SELECT * FROM ratings WHERE user_id = ? AND chapter_id = ?',
            [user_id, chapter_id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy đánh giá' });
        }
        
        res.json(rows[0]);
    } catch (err) {
        console.error('Lỗi khi lấy thông tin đánh giá:', err);
        res.status(500).json({ error: 'Lỗi khi lấy thông tin đánh giá', details: err.message });
    } finally {
        connection.release();
    }
});

// Thêm hoặc cập nhật đánh giá của người dùng cho một chương
router.post('/ratings', async (req, res) => {
    const { user_id, chapter_id, rating } = req.body;
    
    if (!user_id || !chapter_id || !rating) {
        return res.status(400).json({ error: 'Thiếu thông tin user_id, chapter_id hoặc rating' });
    }
    
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Điểm đánh giá phải từ 1-5' });
    }
    
    const connection = await dbPool.getConnection();
    try {
        // Kiểm tra xem người dùng đã đánh giá chương này chưa
        const [existingRating] = await connection.query(
            'SELECT * FROM ratings WHERE user_id = ? AND chapter_id = ?',
            [user_id, chapter_id]
        );
        
        let result;
        const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        if (existingRating.length > 0) {
            // Cập nhật đánh giá hiện có
            [result] = await connection.query(
                'UPDATE ratings SET rating = ?, rated_at = ? WHERE user_id = ? AND chapter_id = ?',
                [rating, currentDate, user_id, chapter_id]
            );
            
            res.json({ message: 'Cập nhật đánh giá thành công', updated: true, rating });
        } else {
            // Thêm đánh giá mới
            [result] = await connection.query(
                'INSERT INTO ratings (user_id, chapter_id, rating, rated_at) VALUES (?, ?, ?, ?)',
                [user_id, chapter_id, rating, currentDate]
            );
            
            res.json({ message: 'Thêm đánh giá thành công', created: true, rating, id: result.insertId });
        }
    } catch (err) {
        console.error('Lỗi khi xử lý đánh giá:', err);
        res.status(500).json({ error: 'Lỗi khi xử lý đánh giá', details: err.message });
    } finally {
        connection.release();
    }
});

// Lấy điểm đánh giá trung bình của một chương
router.get('/ratings/average/:chapter_id', async (req, res) => {
    const { chapter_id } = req.params;
    
    if (!chapter_id) {
        return res.status(400).json({ error: 'Thiếu thông tin chapter_id' });
    }
    
    const connection = await dbPool.getConnection();
    try {
        const [rows] = await connection.query(
            'SELECT AVG(rating) as average_rating, COUNT(*) as rating_count FROM ratings WHERE chapter_id = ?',
            [chapter_id]
        );
        
        res.json({
            chapter_id,
            average_rating: rows[0].average_rating || 0,
            rating_count: rows[0].rating_count || 0
        });
    } catch (err) {
        console.error('Lỗi khi lấy điểm đánh giá trung bình:', err);
        res.status(500).json({ error: 'Lỗi khi lấy điểm đánh giá trung bình', details: err.message });
    } finally {
        connection.release();
    }
});

module.exports = router; 