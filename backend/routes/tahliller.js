const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const { addTahlil, getTahliller, getTestDetails, getSearchTahliller } = require('../controllers/tahlilController');

// Yeni tahlil ekleme
router.post('/', authenticateToken, addTahlil);

// Tahlilleri listeleme
router.get('/', authenticateToken, getTahliller);

// Tahlil detaylarını getirme
router.get('/:id', authenticateToken, getTestDetails);

// Tahlil arama
router.get('/ara', authenticateToken, getSearchTahliller);

module.exports = router;
