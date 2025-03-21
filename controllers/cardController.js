// controllers/cardController.js
const { getAllCards, saveCards, deleteCard } = require('../models/cardModel');

const getCards = async (req, res) => {
    try {
        const cards = await getAllCards();
        res.json(cards);
    } catch (err) {
        console.error('Lỗi khi lấy cards:', err.stack);
        res.status(500).json({ error: 'Lỗi server khi lấy cards', details: err.message });
    }
};

const saveCardData = async (req, res) => {
    try {
        const result = await saveCards(req.body);
        res.json({ message: 'Cards đã được lưu thành công!', affectedRows: result.affectedRows });
    } catch (err) {
        console.error('Lỗi khi lưu cards:', err.stack);
        res.status(500).json({ error: 'Lỗi server khi lưu cards', details: err.message });
    }
};

const deleteCardData = async (req, res) => {
    try {
        const result = await deleteCard(req.params.id);
        res.json({ message: 'Xóa truyện thành công!', affectedRows: result.affectedRows });
    } catch (err) {
        console.error('Lỗi khi xóa card:', err.stack);
        res.status(500).json({ error: 'Lỗi server khi xóa card', details: err.message });
    }
};

const updateCard = async (req, res) => {
    try {
        const { id, title, content, link } = req.body;
        const result = await saveCards([{ id, title, content, link }]); // Sử dụng saveCards với ON DUPLICATE KEY UPDATE
        res.json({ message: 'Cập nhật truyện thành công!', affectedRows: result.affectedRows });
    } catch (err) {
        console.error('Lỗi khi cập nhật card:', err.stack);
        res.status(500).json({ error: 'Lỗi server khi cập nhật card', details: err.message });
    }
};

module.exports = { getCards, saveCardData, deleteCardData, updateCard };