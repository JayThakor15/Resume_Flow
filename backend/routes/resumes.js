const express = require("express");
const { body, validationResult } = require("express-validator");
const {
  getResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
  getResumeVersions,
  duplicateResume,
  toggleResumeStatus,
} = require("../controllers/resumeController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Protect all routes
router.use(protect);

// Validation middleware
const validateResume = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be between 1 and 100 characters"),
  body("personalInfo.firstName")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("First name is required and must be less than 50 characters"),
  body("personalInfo.lastName")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Last name is required and must be less than 50 characters"),
  body("personalInfo.email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("personalInfo.summary")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Summary cannot exceed 500 characters"),
];

const validateEducation = [
  body("education.*.institution")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Institution name is required"),
  body("education.*.degree")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Degree is required"),
  body("education.*.field")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Field of study is required"),
  body("education.*.startDate")
    .isISO8601()
    .withMessage("Valid start date is required"),
];

const validateExperience = [
  body("experience.*.company")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Company name is required"),
  body("experience.*.position")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Position title is required"),
  body("experience.*.startDate")
    .isISO8601()
    .withMessage("Valid start date is required"),
  body("experience.*.description")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Job description is required"),
];

const validateSkills = [
  body("skills.*.name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Skill name is required"),
];

// Check for validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }
  next();
};

// @route   GET /api/resumes
// @desc    Get all resumes for logged in user
// @access  Private
router.get("/", getResumes);

// @route   POST /api/resumes
// @desc    Create new resume
// @access  Private
router.post("/", validateResume, handleValidationErrors, createResume);

// @route   GET /api/resumes/:id
// @desc    Get single resume
// @access  Private
router.get("/:id", getResume);

// @route   PUT /api/resumes/:id
// @desc    Update resume
// @access  Private
router.put("/:id", validateResume, handleValidationErrors, updateResume);

// @route   DELETE /api/resumes/:id
// @desc    Delete resume
// @access  Private
router.delete("/:id", deleteResume);

// @route   GET /api/resumes/:id/versions
// @desc    Get resume versions
// @access  Private
router.get("/:id/versions", getResumeVersions);

// @route   POST /api/resumes/:id/duplicate
// @desc    Duplicate resume
// @access  Private
router.post("/:id/duplicate", duplicateResume);

// @route   PUT /api/resumes/:id/toggle
// @desc    Toggle resume active status
// @access  Private
router.put("/:id/toggle", toggleResumeStatus);

module.exports = router;
