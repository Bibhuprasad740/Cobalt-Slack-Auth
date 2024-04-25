const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// /oauth/signin
router.get("/signin", authController.signin);

// /auth/getDataFromSlack
router.get("/getDataFromSlack", authController.getDataFromSlack);

module.exports = router;
