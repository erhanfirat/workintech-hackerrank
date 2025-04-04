const express = require("express");
const router = express.Router();
const testController = require("../controllers/testController");

// Tüm testleri getir
router.get("/", testController.getAllTests);

// Test ID'ye göre test getir
router.get("/:id", testController.getTestById);

// Yeni test oluştur
router.post("/", testController.createUpdateTest);

// Testi güncelle
router.put("/:id", testController.updateTest);

// Test ID'sine göre adayları getir
router.get("/:testId/candidates", testController.getTestCandidates);

// Teste adayları ekle
router.post("/:testId/candidates", testController.addCandidates);

// Test için PDF oluştur
router.post("/:testId/candidates/:group/pdf", testController.createPdf);

module.exports = router;
