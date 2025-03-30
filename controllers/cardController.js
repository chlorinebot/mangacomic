const { getAllCards, saveCards, deleteCard } = require('../service/cardService');

// Lấy danh sách tất cả truyện
const getCards = async (req, res) => {
    try {
        const cards = await getAllCards();
        res.status(200).json(cards);
    } catch (err) {
        console.error('Lỗi khi lấy cards:', err.stack);
        res.status(500).json({ error: 'Lỗi server khi lấy danh sách truyện', details: err.message });
    }
};

// Thêm truyện mới
const saveCardData = async (req, res) => {
    try {
        // Kiểm tra dữ liệu đầu vào
        const cards = req.body;
        if (!Array.isArray(cards) || cards.length === 0) {
            return res.status(400).json({ error: 'Dữ liệu đầu vào phải là một mảng không rỗng!' });
        }

        // Kiểm tra các trường bắt buộc
        for (const card of cards) {
            if (!card.title) {
                return res.status(400).json({ error: 'Tiêu đề truyện là bắt buộc!' });
            }
        }

        const result = await saveCards(cards);
        res.status(201).json({ message: 'Thêm truyện thành công!', affectedRows: result.affectedRows });
    } catch (err) {
        console.error('Lỗi khi lưu cards:', err.stack);
        res.status(500).json({ error: 'Lỗi server khi thêm truyện', details: err.message });
    }
};

// Xóa truyện
const deleteCardData = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'ID truyện không hợp lệ!' });
        }

        const result = await deleteCard(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy truyện để xóa!' });
        }

        res.status(200).json({ message: 'Xóa truyện thành công!', affectedRows: result.affectedRows });
    } catch (err) {
        console.error('Lỗi khi xóa card:', err.stack);
        res.status(500).json({ error: 'Lỗi server khi xóa truyện', details: err.message });
    }
};

// Cập nhật truyện
const updateCard = async (req, res) => {
    try {
        const { id } = req.params; // Lấy ID từ params thay vì body
        const { title, image, content, link } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'ID truyện không hợp lệ!' });
        }
        if (!title) {
            return res.status(400).json({ error: 'Tiêu đề truyện là bắt buộc!' });
        }

        // Chuẩn bị dữ liệu để cập nhật
        const cardData = {
            id: parseInt(id),
            title,
            image: image || null, // Nếu image không có, gửi null
            content: content || null,
            link: link || null
        };

        // Sử dụng saveCards với ON DUPLICATE KEY UPDATE
        const result = await saveCards([cardData]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy truyện để cập nhật!' });
        }

        res.status(200).json({ message: 'Cập nhật truyện thành công!', affectedRows: result.affectedRows });
    } catch (err) {
        console.error('Lỗi khi cập nhật card:', err.stack);
        res.status(500).json({ error: 'Lỗi server khi cập nhật truyện', details: err.message });
    }
};

module.exports = { getCards, saveCardData, deleteCardData, updateCard };