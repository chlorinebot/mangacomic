// backend/index.js
const express = require('express');
const cors = require('cors');
const { poolPromise } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// API lấy danh sách truyện
app.get('/api/comics', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM comics');
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// API lấy danh sách chương theo comic_id
app.get('/api/chapters/:comicId', async (req, res) => {
    const { comicId } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('comicId', sql.Int, comicId)
            .query('SELECT * FROM chapters WHERE comic_id = @comicId');
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});