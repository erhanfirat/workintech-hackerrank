const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");

// Öğrenci sonuçlarını getir
router.get(
  "/student/:studentId/results",
  candidateController.getStudentResults
);

// Rapor gönder
router.post("/send/report", candidateController.sendReports);

module.exports = router;
