const express = require("express");
const router = express.Router();
const motivationController = require("../controllers/motivationController");

// Motivasyon alıntısı getir
router.get("/", motivationController.getMotivation);

module.exports = router;
