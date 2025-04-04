const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");

// Tüm grupları getir
router.get("/", groupController.getAllGroups);

// Grup test bilgilerini getir
router.get("/test-info", groupController.getGroupTestInfo);

// Grup raporu getir
router.get("/rapor/:groupId", groupController.getGroupReport);

// Öğrenci HR e-postasını ayarla
router.post("/set-student-hr-email", groupController.setStudentHrEmail);

// Sınava girmeyen öğrencilere hatırlatma e-postası gönder
router.post("/remind-hr-exam-to-group", groupController.remindHrExamToGroup);

module.exports = router;
