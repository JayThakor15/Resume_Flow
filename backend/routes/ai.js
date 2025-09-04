const express = require("express");
const { body } = require("express-validator");
const { protect } = require("../middleware/auth");
const { getSuggestions } = require("../controllers/aiController");

const router = express.Router();

router.post(
  "/suggest",
  protect,
  [
    body("text")
      .isString()
      .trim()
      .isLength({ min: 3 })
      .withMessage("text is required"),
    body("context").optional().isString(),
  ],
  getSuggestions
);

module.exports = router;
