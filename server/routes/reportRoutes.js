const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

// Grup raporu getir
router.get("/group/:groupId", reportController.getGroupReport);

module.exports = router;
