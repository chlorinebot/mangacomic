// models/userModel.js
const { dbPool } = require('../data/dbConfig');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const getAllUsers = async () => {
    const connection = await dbPool.getConnection();
    try {
        const [rows] = await connection.query('SELECT id, username, email, password, role_id, created_at FROM users');
        return rows;
    } finally {
        connection.release();
    }
};

const registerUser = async (username, email, password) => {
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();
        const [existingUsers] = await connection.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
        if (existingUsers.length > 0) throw new Error('Tên người dùng hoặc email đã tồn tại!');

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const [result] = await connection.query('INSERT INTO users (username, email, password, role_id) VALUES (?, ?, ?, 2)', [username, email, hashedPassword, 2]);
        const [newUser] = await connection.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
        await connection.commit();
        return { userId: result.insertId, user: newUser[0] };
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

const loginUser = async (username) => {
    const connection = await dbPool.getConnection();
    try {
        const [users] = await connection.query('SELECT id, username, password, role_id FROM users WHERE username = ?', [username]);
        return users.length > 0 ? users[0] : null;
    } finally {
        connection.release();
    }
};

const deleteUser = async (id) => {
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();
        const [result] = await connection.query('DELETE FROM users WHERE id = ?', [id]);
        await connection.commit();
        return result;
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

const updateUser = async (id, username, email, password) => {
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();
        // Hash the password if provided
        const hashedPassword = password ? await bcrypt.hash(password, saltRounds) : undefined;
        const [result] = await connection.query(
            'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?',
            [username, email, hashedPassword || password, id]
        );
        await connection.commit();
        return result;
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

const changeUserPassword = async (username, newPassword) => {
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        const [result] = await connection.query(
            'UPDATE users SET password = ? WHERE username = ?',
            [hashedPassword, username]
        );
        if (result.affectedRows === 0) {
            throw new Error('Không thể cập nhật mật khẩu!');
        }
        await connection.commit();
        return result;
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

module.exports = { getAllUsers, registerUser, loginUser, deleteUser, updateUser, changeUserPassword };