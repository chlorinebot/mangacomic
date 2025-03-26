// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getUsers, deleteUserData, updateUserData, changePassword } = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');

router.get('/', getUsers);
router.delete('/:id', authenticateToken, deleteUserData);
router.put('/:id', authenticateToken, updateUserData);
router.put('/change-password', authenticateToken, changePassword);

module.exports = router;