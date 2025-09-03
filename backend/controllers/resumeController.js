const Resume = require("../models/Resume");

// @desc    Get all resumes for a user
// @route   GET /api/resumes
// @access  Private
const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort({
      updatedAt: -1,
    });

    res.json({
      success: true,
      count: resumes.length,
      data: resumes,
    });
  } catch (error) {
    console.error("Get resumes error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching resumes",
    });
  }
};

// @desc    Get single resume
// @route   GET /api/resumes/:id
// @access  Private
const getResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // Make sure user owns resume
    if (resume.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this resume",
      });
    }

    res.json({
      success: true,
      data: resume,
    });
  } catch (error) {
    console.error("Get resume error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching resume",
    });
  }
};

// @desc    Create new resume
// @route   POST /api/resumes
// @access  Private
const createResume = async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const resume = await Resume.create(req.body);

    res.status(201).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    console.error("Create resume error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating resume",
    });
  }
};

// @desc    Update resume
// @route   PUT /api/resumes/:id
// @access  Private
const updateResume = async (req, res) => {
  try {
    let resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // Make sure user owns resume
    if (resume.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this resume",
      });
    }

    // Increment version number
    req.body.version = resume.version + 1;

    resume = await Resume.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: resume,
    });
  } catch (error) {
    console.error("Update resume error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating resume",
    });
  }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Private
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // Make sure user owns resume
    if (resume.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this resume",
      });
    }

    await Resume.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error("Delete resume error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting resume",
    });
  }
};

// @desc    Get resume versions
// @route   GET /api/resumes/:id/versions
// @access  Private
const getResumeVersions = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // Make sure user owns resume
    if (resume.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this resume",
      });
    }

    // Get all versions of this resume
    const versions = await Resume.find({
      user: req.user.id,
      title: resume.title,
    }).sort({ version: -1 });

    res.json({
      success: true,
      count: versions.length,
      data: versions,
    });
  } catch (error) {
    console.error("Get resume versions error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching resume versions",
    });
  }
};

// @desc    Duplicate resume
// @route   POST /api/resumes/:id/duplicate
// @access  Private
const duplicateResume = async (req, res) => {
  try {
    const originalResume = await Resume.findById(req.params.id);

    if (!originalResume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // Make sure user owns resume
    if (originalResume.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to duplicate this resume",
      });
    }

    // Create new resume with same data but new title
    const newResumeData = originalResume.toObject();
    delete newResumeData._id;
    delete newResumeData.createdAt;
    delete newResumeData.updatedAt;

    newResumeData.title = `${originalResume.title} (Copy)`;
    newResumeData.version = 1;
    newResumeData.user = req.user.id;

    const newResume = await Resume.create(newResumeData);

    res.status(201).json({
      success: true,
      data: newResume,
    });
  } catch (error) {
    console.error("Duplicate resume error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while duplicating resume",
    });
  }
};

// @desc    Set resume as active/inactive
// @route   PUT /api/resumes/:id/toggle
// @access  Private
const toggleResumeStatus = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // Make sure user owns resume
    if (resume.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to modify this resume",
      });
    }

    resume.isActive = !resume.isActive;
    await resume.save();

    res.json({
      success: true,
      data: resume,
    });
  } catch (error) {
    console.error("Toggle resume status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while toggling resume status",
    });
  }
};

module.exports = {
  getResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
  getResumeVersions,
  duplicateResume,
  toggleResumeStatus,
};
