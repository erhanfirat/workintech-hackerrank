const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");

// Soruları getir
router.get("/", questionController.getQuestions);

// Soru oluştur/güncelle
router.post("/", questionController.createUpdateQuestions);

module.exports = router;
