// routes/kilavuzlar.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const { createKilavuz, updateKilavuz, getKilavuzlar, getKilavuzByAge } = require('../controllers/kilavuzController');
const authorizeRoles = require('../middlewares/authorizeRoles');

// Kılavuz oluşturma (admin)
router.post('/', authenticateToken, authorizeRoles('admin'), createKilavuz);

// Kılavuz güncelleme (admin)
router.put('/:id', authenticateToken, authorizeRoles('admin'), updateKilavuz);

// Kılavuzları listeleme
router.get('/', authenticateToken, getKilavuzlar);

// Yaşa göre kılavuz getirme
router.get('/yasaraligi', authenticateToken, getKilavuzByAge);

module.exports = router;
