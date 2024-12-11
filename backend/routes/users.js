const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');

// Kullanıcı profilini görüntüleme
router.get('/me', authenticateToken, getUserProfile);

// Kullanıcı bilgilerini güncelleme
router.put('/me', authenticateToken, updateUserProfile);

module.exports = router;
