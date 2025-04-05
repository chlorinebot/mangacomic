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

module.exports = router; 