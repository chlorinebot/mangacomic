const { dbPool } = require('../data/dbConfig');

// Lấy danh sách tất cả cards, bao gồm tên thể loại từ bảng genres
const getAllCards = async () => {
    const connection = await dbPool.getConnection();
    try {
        const [rows] = await connection.query(`
            SELECT c.id, c.title, c.image, c.content, c.link, c.TheLoai, g.genre_name 
            FROM cards c
            LEFT JOIN genres g ON c.TheLoai = g.genre_id
        `);
        return rows;
    } finally {
        connection.release();
    }
};

// Lưu hoặc cập nhật cards, bao gồm cột TheLoai (lưu genre_id)
const saveCards = async (cards) => {
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();
        const query = `
            INSERT INTO cards (id, title, image, content, link, TheLoai) 
            VALUES ? 
            ON DUPLICATE KEY UPDATE 
                title=VALUES(title), 
                image=VALUES(image), 
                content=VALUES(content), 
                link=VALUES(link), 
                TheLoai=VALUES(TheLoai)
        `;
        const values = cards.map(card => [
            card.id, 
            card.title, 
            card.image || null, 
            card.content, 
            card.link || null, 
            card.TheLoai || null // TheLoai là genre_id
        ]);
        const [result] = await connection.query(query, [values]);
        await connection.commit();
        return result;
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

// Xóa card theo id
const deleteCard = async (id) => {
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();
        // Xóa các chapters liên quan trước
        await connection.query('DELETE FROM chapters WHERE card_id = ?', [id]);
        // Xóa card
        const [result] = await connection.query('DELETE FROM cards WHERE id = ?', [id]);
        await connection.commit();
        return result;
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

module.exports = { getAllCards, saveCards, deleteCard };