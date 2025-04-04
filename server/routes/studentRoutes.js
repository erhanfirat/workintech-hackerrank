const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

// Tüm öğrencileri getir
router.get("/", studentController.getAllStudents);

module.exports = router;
