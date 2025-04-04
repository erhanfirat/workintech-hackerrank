const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Kullanıcı girişi
router.post("/login", authController.login);

// Kullanıcı doğrulama
router.get("/verify/me", authController.verifyMe);

// Grupları ve kullanıcıları getir
router.post("/fetch-groups-and-users", authController.fetchGroupsAndUsers);

module.exports = router;
