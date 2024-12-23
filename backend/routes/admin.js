const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const { authorizeRoles } = require('../middlewares/authorizeRoles');
const { createUser, searchUsers } = require('../controllers/adminUserController');
const { registerAdmin, getAllUsers, getUserByName, getUserTestsById, getTahlilDetay } = require('../controllers/adminController');

// Yeni admin kullanıcı oluşturma
router.post('/register', authenticateToken, authorizeRoles('admin'), registerAdmin);

// Tüm kullanıcıları listeleme (isteğe bağlı)
router.get('/users', authenticateToken, authorizeRoles('admin'), getAllUsers);

// İsim/soyisim ile kullanıcı arama
router.get('/users/search', authenticateToken, authorizeRoles('admin'), getUserByName);

// Tahlil detaylarını getirme
router.get('/tahliller/detay/:tahlilId', authenticateToken, authorizeRoles('admin'), getTahlilDetay);

// Belirli bir kullanıcının tahlillerini getir
router.get('/tahliller/:userId', authenticateToken, authorizeRoles('admin'), getUserTestsById);

// Genel admin işlemleri
router.get('/', authenticateToken, authorizeRoles('admin'), (req, res) => {
    res.json({ message: 'Admin paneli' });
  });

// User management routes
router.post('/users/create', authenticateToken, authorizeRoles('admin'), createUser);
router.get('/users/search', authenticateToken, authorizeRoles('admin'), searchUsers);

module.exports = router;
