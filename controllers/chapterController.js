const { getAllChapters, saveChapters, deleteChapter } = require('../models/chapterModel');

const getChapters = async (req, res) => {
    try {
        const chapters = await getAllChapters();
        res.json(chapters);
    } catch (err) {
        console.error('Lỗi khi lấy chapters:', err.stack);
        res.status(500).json({ error: 'Lỗi server khi lấy chapters', details: err.message });
    }
};

const saveChapterData = async (req, res) => {
    try {
        const result = await saveChapters(req.body);
        res.json({ message: 'Chapters đã được lưu thành công!', affectedRows: result.affectedRows });
    } catch (err) {
        console.error('Lỗi khi lưu chapters:', err.stack);
        res.status(500).json({ error: 'Lỗi server khi lưu chapters', details: err.message });
    }
};

const deleteChapterData = async (req, res) => {
    try {
        const { card_id, chapter_number } = req.query;
        if (!card_id || !chapter_number) {
            return res.status(400).json({ error: 'Vui lòng cung cấp card_id và chapter_number!' });
        }
        const result = await deleteChapter(card_id, chapter_number);
        res.json({ message: 'Xóa chương thành công!', affectedRows: result.affectedRows });
    } catch (err) {
        console.error('Lỗi khi xóa chapter:', err.stack);
        res.status(500).json({ error: 'Lỗi server khi xóa chapter', details: err.message });
    }
};

module.exports = { getChapters, saveChapterData, deleteChapterData };