// models/cardModel.js
const { dbPool } = require('../data/dbConfig');

const getAllCards = async () => {
    const connection = await dbPool.getConnection();
    try {
        const [rows] = await connection.query('SELECT id, title, image, content, link FROM cards');
        return rows;
    } finally {
        connection.release();
    }
};

const saveCards = async (cards) => {
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();
        const query = 'INSERT INTO cards (id, title, image, content, link) VALUES ? ON DUPLICATE KEY UPDATE title=VALUES(title), image=VALUES(image), content=VALUES(content), link=VALUES(link)';
        const values = cards.map(card => [card.id, card.title, card.image || null, card.content, card.link || null]);
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

const deleteCard = async (id) => {
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();
        await connection.query('DELETE FROM chapters WHERE card_id = ?', [id]);
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