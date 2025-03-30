// models/userModel.js
const { dbPool } = require('../data/dbConfig');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const getAllUsers = async () => {
    const connection = await dbPool.getConnection();
    try {
        const [rows] = await connection.query('SELECT id, username, email, password, role_id, created_at FROM users');
        return rows;
    } finally {
        connection.release();
    }
};

const registerUser = async (username, email, password, role_id = 2) => {
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();
        const [existingUsers] = await connection.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
        if (existingUsers.length > 0) throw new Error('Tên người dùng hoặc email đã tồn tại!');

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const [result] = await connection.query(
            'INSERT INTO users (username, email, password, role_id) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, role_id]
        );
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

const loginUser = async (username, password) => {
    const connection = await dbPool.getConnection();
    try {
        console.log('Đang tìm người dùng:', username);
        const [users] = await connection.query('SELECT id, username, password, role_id FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            console.log('Không tìm thấy người dùng');
            return null;
        }

        const user = users[0];
        console.log('Người dùng tìm thấy:', user);
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Kết quả so sánh mật khẩu:', isMatch);
        if (!isMatch) {
            console.log('Mật khẩu không khớp');
            return null;
        }

        return user;
    } catch (err) {
        console.error('Lỗi trong loginUser:', err);
        throw err;
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

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const [result] = await connection.query(
            'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?',
            [username, email, hashedPassword, id]
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

module.exports = { getAllUsers, registerUser, loginUser, deleteUser, updateUser };