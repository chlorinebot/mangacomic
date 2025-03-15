// api/manga.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const config = require('../config/db'); // Giả định file config database

// Tạo connection pool
const pool = mysql.createPool(config);

// Middleware kiểm tra authentication (giả định)
const authMiddleware = async (req, res, next) => {
    // Thêm logic kiểm tra token/auth ở đây
    next();
};

// 1. Lấy danh sách tất cả comics
router.get('/comics', async (req, res) => {
    try {
        const [comics] = await pool.query(`
            SELECT c.*, GROUP_CONCAT(g.genre_name) as genres
            FROM Comics c
            LEFT JOIN Comic_Genres cg ON c.comic_id = cg.comic_id
            LEFT JOIN Genres g ON cg.genre_id = g.genre_id
            GROUP BY c.comic_id
        `);
        res.json(comics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Lấy thông tin chi tiết một comic
router.get('/comics/:id', async (req, res) => {
    try {
        const [comic] = await pool.query(`
            SELECT c.*, GROUP_CONCAT(g.genre_name) as genres
            FROM Comics c
            LEFT JOIN Comic_Genres cg ON c.comic_id = cg.comic_id
            LEFT JOIN Genres g ON cg.genre_id = g.genre_id
            WHERE c.comic_id = ?
            GROUP BY c.comic_id
        `, [req.params.id]);

        if (!comic.length) {
            return res.status(404).json({ error: 'Comic not found' });
        }

        const [chapters] = await pool.query(`
            SELECT * FROM Chapters 
            WHERE comic_id = ? 
            ORDER BY chapter_number ASC
        `, [req.params.id]);

        res.json({ ...comic[0], chapters });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Lấy chi tiết một chapter
router.get('/chapters/:id', async (req, res) => {
    try {
        const [chapter] = await pool.query(`
            SELECT c.*, cm.title as comic_title
            FROM Chapters c
            JOIN Comics cm ON c.comic_id = cm.comic_id
            WHERE c.chapter_id = ?
        `, [req.params.id]);

        if (!chapter.length) {
            return res.status(404).json({ error: 'Chapter not found' });
        }

        const [comments] = await pool.query(`
            SELECT c.*, u.username
            FROM Comments c
            JOIN Users u ON c.user_id = u.user_id
            WHERE c.chapter_id = ?
            ORDER BY c.created_at DESC
        `, [req.params.id]);

        res.json({ ...chapter[0], comments });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Thêm comment (yêu cầu auth)
router.post('/comments', authMiddleware, async (req, res) => {
    const { chapter_id, rating, comment_text } = req.body;
    const user_id = req.user.id; // Giả định từ auth middleware

    try {
        const [result] = await pool.query(`
            INSERT INTO Comments (user_id, chapter_id, rating, comment_text)
            VALUES (?, ?, ?, ?)
        `, [user_id, chapter_id, rating, comment_text]);

        res.status(201).json({ 
            comment_id: result.insertId,
            message: 'Comment added successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. Thêm bookmark (yêu cầu auth)
router.post('/bookmarks', authMiddleware, async (req, res) => {
    const { comic_id } = req.body;
    const user_id = req.user.id;

    try {
        await pool.query(`
            INSERT INTO Bookmarks (user_id, comic_id)
            VALUES (?, ?)
        `, [user_id, comic_id]);
        
        res.status(201).json({ message: 'Bookmarked successfully' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Already bookmarked' });
        }
        res.status(500).json({ error: error.message });
    }
});

// 6. Lấy danh sách genres
router.get('/genres', async (req, res) => {
    try {
        const [genres] = await pool.query('SELECT * FROM Genres');
        res.json(genres);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 7. Cập nhật lượt xem chapter
router.post('/chapters/:id/view', async (req, res) => {
    try {
        await pool.query(`
            UPDATE Chapters 
            SET view_count = view_count + 1
            WHERE chapter_id = ?
        `, [req.params.id]);
        
        res.json({ message: 'View count updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;