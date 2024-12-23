// adminUser.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const { authorizeRole } = require('../middlewares/authorizeRoles'); 
const { createUser, searchUsers } = require('../controllers/adminUserController');

// Yeni kullanıcı oluşturma (admin sadece erişebilir)
router.post('/create', authenticateToken, authorizeRole('admin'), createUser);

// Kullanıcı arama (admin sadece erişebilir)
router.get('/search', authenticateToken, authorizeRole('admin'), searchUsers);

module.exports = router;