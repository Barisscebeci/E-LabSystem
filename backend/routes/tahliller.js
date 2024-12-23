const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authenticateToken");
const {
  addTahlil,
  getTahliller,
  getTestDetails,
  getSearchTahliller,
  deleteTahlil,
  updateTahlil,
  getUserTahliller,
} = require("../controllers/tahlilController");

// Yeni tahlil ekleme
router.post("/", authenticateToken, addTahlil);

// Tahlilleri listeleme
router.get("/", authenticateToken, getTahliller);

// Kullanıcı bazlı tahlilleri listeleme
router.get("/user/:userId", authenticateToken, getUserTahliller);

// Tahlil detaylarını getirme
router.get("/:id", authenticateToken, getTestDetails);

// Tahlil arama
router.get("/ara", authenticateToken, getSearchTahliller);

// Tahlil silme
router.delete("/:id", authenticateToken, deleteTahlil);

// Tahlil güncelleme
router.put("/:id", authenticateToken, updateTahlil);

module.exports = router;
