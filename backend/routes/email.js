const express = require("express");
const { shareResume } = require("../controllers/emailController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All routes are protected
router.use(protect);

// Share resume via email
router.post("/share-resume", shareResume);

module.exports = router;
