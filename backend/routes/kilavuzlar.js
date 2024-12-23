const express = require("express");
const router = express.Router();
const {
  createKilavuz,
  addReferenceToKilavuz,
  updateKilavuz,
  getKilavuz,
  getKilavuzlar,
  getKilavuzByAge,
  deleteKilavuz,
  updateReference,
  deleteReference,
} = require("../controllers/kilavuzController");
const authenticateToken = require("../middlewares/authenticateToken");
const { authorizeRoles } = require("../middlewares/authorizeRoles");

// Yaşa göre kılavuz getirme -> /kilavuzlar/yasaraligi
router.get("/yasaraligi", authenticateToken, getKilavuzByAge);

// Kılavuz oluşturma
router.post("/", authenticateToken, authorizeRoles("admin"), createKilavuz);

// Tekil kılavuz getirme
router.get("/:id", authenticateToken, getKilavuz);

// Kılavuz listeleme
router.get("/", authenticateToken, getKilavuzlar);

// Kılavuz güncelleme
router.put("/:id", authenticateToken, authorizeRoles("admin"), updateKilavuz);

// Kılavuz silme
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  deleteKilavuz
);

// Referans ekleme -> /kilavuzlar/:id/references
router.post(
  "/:id/references",
  authenticateToken,
  authorizeRoles("admin"),
  addReferenceToKilavuz
);

// Referans güncelleme
router.put(
  "/:kilavuzId/references/:referenceId",
  authenticateToken,
  authorizeRoles("admin"),
  updateReference
);

// Referans silme
router.delete(
  "/:kilavuzId/references/:referenceId",
  authenticateToken,
  authorizeRoles("admin"),
  deleteReference
);

module.exports = router;
