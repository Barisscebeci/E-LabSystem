const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const authorizeRoles = require('../middlewares/authorizeRoles');
const { registerAdmin, getAllUsers, getUserByName, getUserTestsById } = require('../controllers/adminController');

// Yeni admin kullanıcı oluşturma
router.post('/register', authenticateToken, authorizeRoles('admin'), registerAdmin);

// Tüm kullanıcıları listeleme (isteğe bağlı)
router.get('/users', authenticateToken, authorizeRoles('admin'), getAllUsers);

// İsim/soyisim ile kullanıcı arama
router.get('/users/search', authenticateToken, authorizeRoles('admin'), getUserByName);

// Belirli bir kullanıcının tahlillerini getir
router.get('/tahliller/:userId', authenticateToken, authorizeRoles('admin'), getUserTestsById);

module.exports = router;
