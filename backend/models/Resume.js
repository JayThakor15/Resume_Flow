const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: [true, "Institution name is required"],
    trim: true,
  },
  degree: {
    type: String,
    required: [true, "Degree is required"],
    trim: true,
  },
  field: {
    type: String,
    required: [true, "Field of study is required"],
    trim: true,
  },
  startDate: {
    type: Date,
    required: [true, "Start date is required"],
  },
  endDate: {
    type: Date,
  },
  current: {
    type: Boolean,
    default: false,
  },
  gpa: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
});

const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, "Company name is required"],
    trim: true,
  },
  position: {
    type: String,
    required: [true, "Position title is required"],
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  startDate: {
    type: Date,
    required: [true, "Start date is required"],
  },
  endDate: {
    type: Date,
  },
  current: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    required: [true, "Job description is required"],
    trim: true,
  },
  achievements: [
    {
      type: String,
      trim: true,
    },
  ],
});

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Skill name is required"],
    trim: true,
  },
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
    default: "Intermediate",
  },
  category: {
    type: String,
    enum: ["Technical", "Soft Skills", "Languages", "Tools", "Other"],
    default: "Technical",
  },
});

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Project title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Project description is required"],
    trim: true,
  },
  technologies: [
    {
      type: String,
      trim: true,
    },
  ],
  url: {
    type: String,
    trim: true,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  current: {
    type: Boolean,
    default: false,
  },
});

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Resume title is required"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    version: {
      type: Number,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    personalInfo: {
      firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
      },
      lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
      },
      linkedin: {
        type: String,
        trim: true,
      },
      github: {
        type: String,
        trim: true,
      },
      website: {
        type: String,
        trim: true,
      },
      summary: {
        type: String,
        trim: true,
        maxlength: [500, "Summary cannot be more than 500 characters"],
      },
    },
    education: [educationSchema],
    experience: [experienceSchema],
    skills: [skillSchema],
    projects: [projectSchema],
    certifications: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        issuer: {
          type: String,
          required: true,
          trim: true,
        },
        date: {
          type: Date,
          required: true,
        },
        url: {
          type: String,
          trim: true,
        },
      },
    ],
    languages: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        proficiency: {
          type: String,
          enum: ["Basic", "Conversational", "Fluent", "Native"],
          default: "Conversational",
        },
      },
    ],
    template: {
      type: String,
      enum: ["modern", "classic", "creative", "minimal"],
      default: "modern",
    },
    settings: {
      fontSize: {
        type: String,
        enum: ["small", "medium", "large"],
        default: "medium",
      },
      spacing: {
        type: String,
        enum: ["compact", "normal", "spacious"],
        default: "normal",
      },
      colorScheme: {
        type: String,
        enum: ["blue", "green", "purple", "red", "gray"],
        default: "blue",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
resumeSchema.index({ user: 1, createdAt: -1 });
resumeSchema.index({ user: 1, isActive: 1 });

// Virtual for full name
resumeSchema.virtual("personalInfo.fullName").get(function () {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

// Ensure virtual fields are serialized
resumeSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Resume", resumeSchema);
