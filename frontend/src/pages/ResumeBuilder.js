import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Grid,
  Card,
  CardContent,
  IconButton,
  Alert,
  CircularProgress,
  Divider,
  Chip,
} from "@mui/material";
import {
  Save,
  Preview,
  ArrowBack,
  ArrowForward,
  Add,
  Delete,
  Palette,
  Email,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { resumeService } from "../services/resumeService";
import aiService from "../services/aiService";
import ThemeSelector from "../components/ThemeSelector";
import { getThemeById } from "../theme/resumeThemes";
import EmailShareModal from "../components/EmailShareModal";
import AISuggestionPanel from "../components/AISuggestionPanel";

const steps = [
  "Personal Info",
  "Education",
  "Experience",
  "Skills",
  "Projects",
];

const ResumeBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [themeSelectorOpen, setThemeSelectorOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [emailShareOpen, setEmailShareOpen] = useState(false);
  const [resume, setResume] = useState({
    title: "",
    template: "modern",
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
      linkedin: "",
      github: "",
      website: "",
      summary: "",
    },
    education: [],
    experience: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
  });

  // AI suggestion state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiData, setAiData] = useState(null); // { corrected, keywords, suggestions }
  const [aiOpen, setAiOpen] = useState(false);
  const [aiTarget, setAiTarget] = useState(null); // { type: 'summary' | 'project', index?: number }

  useEffect(() => {
    if (id && id !== "new") {
      fetchResume();
    }
  }, [id]);

  const fetchResume = async () => {
    try {
      setLoading(true);
      const response = await resumeService.getResume(id);
      setResume(response.data.data);
    } catch (err) {
      setError("Failed to load resume");
      console.error("Error fetching resume:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSave = async () => {
    // Clear previous errors
    setError(null);
    setFieldErrors({});

    // Validate form first
    if (!validateForm()) {
      setError("Please fix the validation errors below");
      return;
    }

    try {
      setSaving(true);

      if (id && id !== "new") {
        await resumeService.updateResume(id, resume);
      } else {
        const response = await resumeService.createResume(resume);
        navigate(`/resume/${response.data.data._id}/edit`);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        // Handle field-specific errors from server
        const errors = {};
        err.response.data.errors.forEach((error) => {
          errors[error.field] = error.message;
        });
        setFieldErrors(errors);
        setError("Please fix the validation errors below");
      } else {
        setError("Failed to save resume");
      }
      console.error("Error saving resume:", err);
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    if (id && id !== "new") {
      navigate(`/resume/${id}/preview`);
    }
  };

  const handleThemeSelect = (themeId) => {
    updateResume({ template: themeId });
  };

  const handleEmailShare = () => {
    setEmailShareOpen(true);
  };

  const getFieldError = (fieldName) => {
    return fieldErrors[fieldName] || "";
  };

  const clearFieldError = (fieldName) => {
    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    // Required fields validation
    if (!resume.title?.trim()) {
      errors.title = "Resume title is required";
    }

    if (!resume.personalInfo.firstName?.trim()) {
      errors["personalInfo.firstName"] = "First name is required";
    }

    if (!resume.personalInfo.lastName?.trim()) {
      errors["personalInfo.lastName"] = "Last name is required";
    }

    if (!resume.personalInfo.email?.trim()) {
      errors["personalInfo.email"] = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resume.personalInfo.email)) {
      errors["personalInfo.email"] = "Please provide a valid email";
    }

    if (!resume.personalInfo.phone?.trim()) {
      errors["personalInfo.phone"] = "Phone number is required";
    }

    if (!resume.personalInfo.summary?.trim()) {
      errors["personalInfo.summary"] = "Professional summary is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // AI helpers
  const openSuggestions = async ({ text, context, target }) => {
    try {
      setAiLoading(true);
      setAiOpen(true);
      setAiTarget(target);
      const res = await aiService.suggest({ text, context });
      setAiData(res?.data || null);
    } catch (e) {
      console.error("AI suggest error", e);
      setAiData({
        corrected: "",
        keywords: [],
        suggestions: ["AI suggestion failed. Please try again."],
      });
    } finally {
      setAiLoading(false);
    }
  };

  const regenerateSuggestions = async () => {
    if (!aiTarget) return;
    const { type, index } = aiTarget;
    const text =
      type === "summary"
        ? resume.personalInfo.summary || ""
        : resume.projects[index]?.description || "";
    const context =
      type === "summary"
        ? "Professional summary for a resume"
        : `Project description. Title: ${
            resume.projects[index]?.title || ""
          }. Tech stack: ${resume.projects[index]?.techStack || ""}.`;
    await openSuggestions({ text, context, target: aiTarget });
  };

  const applySuggestion = () => {
    if (!aiTarget || !aiData?.corrected) return;
    const { type, index } = aiTarget;
    if (type === "summary") {
      updatePersonalInfo({ summary: aiData.corrected });
    } else if (type === "project") {
      updateProject(index, { description: aiData.corrected });
    }
  };

  const updateResume = (updates) => {
    setResume((prev) => ({ ...prev, ...updates }));
  };

  const updatePersonalInfo = (updates) => {
    setResume((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...updates },
    }));
  };

  const addEducation = () => {
    setResume((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          institution: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          current: false,
          gpa: "",
          description: "",
        },
      ],
    }));
  };

  const updateEducation = (index, updates) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, ...updates } : edu
      ),
    }));
  };

  const removeEducation = (index) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const addExperience = () => {
    setResume((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          company: "",
          position: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
          achievements: [],
        },
      ],
    }));
  };

  const updateExperience = (index, updates) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, ...updates } : exp
      ),
    }));
  };

  const removeExperience = (index) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const addSkill = () => {
    setResume((prev) => ({
      ...prev,
      skills: [
        ...prev.skills,
        {
          name: "",
          level: "Intermediate",
          category: "Technical",
        },
      ],
    }));
  };

  const updateSkill = (index, updates) => {
    setResume((prev) => ({
      ...prev,
      skills: prev.skills.map((skill, i) =>
        i === index ? { ...skill, ...updates } : skill
      ),
    }));
  };

  const addProject = () => {
    setResume((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          title: "",
          techStack: "",
          description: "",
          demoLink: "",
          githubLink: "",
          startDate: "",
          endDate: "",
          current: false,
        },
      ],
    }));
  };

  const updateProject = (index, updates) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.map((project, i) =>
        i === index ? { ...project, ...updates } : project
      ),
    }));
  };

  const removeProject = (index) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const removeSkill = (index) => {
    setResume((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const renderPersonalInfo = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Basic Information
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Resume Title"
          value={resume.title}
          onChange={(e) => {
            updateResume({ title: e.target.value });
            clearFieldError("title");
          }}
          error={!!getFieldError("title")}
          helperText={getFieldError("title")}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="First Name"
          value={resume.personalInfo.firstName}
          onChange={(e) => {
            updatePersonalInfo({ firstName: e.target.value });
            clearFieldError("personalInfo.firstName");
          }}
          error={!!getFieldError("personalInfo.firstName")}
          helperText={getFieldError("personalInfo.firstName")}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Last Name"
          value={resume.personalInfo.lastName}
          onChange={(e) => {
            updatePersonalInfo({ lastName: e.target.value });
            clearFieldError("personalInfo.lastName");
          }}
          error={!!getFieldError("personalInfo.lastName")}
          helperText={getFieldError("personalInfo.lastName")}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={resume.personalInfo.email}
          onChange={(e) => {
            updatePersonalInfo({ email: e.target.value });
            clearFieldError("personalInfo.email");
          }}
          error={!!getFieldError("personalInfo.email")}
          helperText={getFieldError("personalInfo.email")}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Phone"
          value={resume.personalInfo.phone}
          onChange={(e) => {
            updatePersonalInfo({ phone: e.target.value });
            clearFieldError("personalInfo.phone");
          }}
          error={!!getFieldError("personalInfo.phone")}
          helperText={getFieldError("personalInfo.phone")}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Address
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Street Address"
          value={resume.personalInfo.address.street}
          onChange={(e) => {
            updatePersonalInfo({
              address: {
                ...resume.personalInfo.address,
                street: e.target.value,
              },
            });
            clearFieldError("personalInfo.address.street");
          }}
          error={!!getFieldError("personalInfo.address.street")}
          helperText={getFieldError("personalInfo.address.street")}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="City"
          value={resume.personalInfo.address.city}
          onChange={(e) => {
            updatePersonalInfo({
              address: { ...resume.personalInfo.address, city: e.target.value },
            });
            clearFieldError("personalInfo.address.city");
          }}
          error={!!getFieldError("personalInfo.address.city")}
          helperText={getFieldError("personalInfo.address.city")}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="State"
          value={resume.personalInfo.address.state}
          onChange={(e) => {
            updatePersonalInfo({
              address: {
                ...resume.personalInfo.address,
                state: e.target.value,
              },
            });
            clearFieldError("personalInfo.address.state");
          }}
          error={!!getFieldError("personalInfo.address.state")}
          helperText={getFieldError("personalInfo.address.state")}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="ZIP Code"
          value={resume.personalInfo.address.zipCode}
          onChange={(e) => {
            updatePersonalInfo({
              address: {
                ...resume.personalInfo.address,
                zipCode: e.target.value,
              },
            });
            clearFieldError("personalInfo.address.zipCode");
          }}
          error={!!getFieldError("personalInfo.address.zipCode")}
          helperText={getFieldError("personalInfo.address.zipCode")}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Professional Links
        </Typography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="LinkedIn"
          value={resume.personalInfo.linkedin}
          onChange={(e) => {
            updatePersonalInfo({ linkedin: e.target.value });
            clearFieldError("personalInfo.linkedin");
          }}
          error={!!getFieldError("personalInfo.linkedin")}
          helperText={getFieldError("personalInfo.linkedin")}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="GitHub"
          value={resume.personalInfo.github}
          onChange={(e) => {
            updatePersonalInfo({ github: e.target.value });
            clearFieldError("personalInfo.github");
          }}
          error={!!getFieldError("personalInfo.github")}
          helperText={getFieldError("personalInfo.github")}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Website"
          value={resume.personalInfo.website}
          onChange={(e) => {
            updatePersonalInfo({ website: e.target.value });
            clearFieldError("personalInfo.website");
          }}
          error={!!getFieldError("personalInfo.website")}
          helperText={getFieldError("personalInfo.website")}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Professional Summary"
          multiline
          rows={4}
          value={resume.personalInfo.summary}
          onChange={(e) => {
            updatePersonalInfo({ summary: e.target.value });
            clearFieldError("personalInfo.summary");
          }}
          error={!!getFieldError("personalInfo.summary")}
          helperText={getFieldError("personalInfo.summary")}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() =>
              openSuggestions({
                text: resume.personalInfo.summary || "",
                context: "Professional summary for a resume",
                target: { type: "summary" },
              })
            }
          >
            Get AI Suggestions
          </Button>
        </Box>
      </Grid>
    </Grid>
  );

  const renderEducation = () => (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Education</Typography>
        <Button startIcon={<Add />} onClick={addEducation}>
          Add Education
        </Button>
      </Box>
      {resume.education.map((edu, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">Education #{index + 1}</Typography>
              <IconButton onClick={() => removeEducation(index)} color="error">
                <Delete />
              </IconButton>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Institution"
                  value={edu.institution}
                  onChange={(e) =>
                    updateEducation(index, { institution: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Degree"
                  value={edu.degree}
                  onChange={(e) =>
                    updateEducation(index, { degree: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Field of Study"
                  value={edu.field}
                  onChange={(e) =>
                    updateEducation(index, { field: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="GPA"
                  value={edu.gpa}
                  onChange={(e) =>
                    updateEducation(index, { gpa: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={edu.startDate}
                  onChange={(e) =>
                    updateEducation(index, { startDate: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={edu.endDate}
                  onChange={(e) =>
                    updateEducation(index, { endDate: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                  disabled={edu.current}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={2}
                  value={edu.description}
                  onChange={(e) =>
                    updateEducation(index, { description: e.target.value })
                  }
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  const renderExperience = () => (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Work Experience</Typography>
        <Button startIcon={<Add />} onClick={addExperience}>
          Add Experience
        </Button>
      </Box>
      {resume.experience.map((exp, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">Experience #{index + 1}</Typography>
              <IconButton onClick={() => removeExperience(index)} color="error">
                <Delete />
              </IconButton>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company"
                  value={exp.company}
                  onChange={(e) =>
                    updateExperience(index, { company: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Position"
                  value={exp.position}
                  onChange={(e) =>
                    updateExperience(index, { position: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={exp.location}
                  onChange={(e) =>
                    updateExperience(index, { location: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={exp.startDate}
                  onChange={(e) =>
                    updateExperience(index, { startDate: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={exp.endDate}
                  onChange={(e) =>
                    updateExperience(index, { endDate: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                  disabled={exp.current}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Job Description"
                  multiline
                  rows={4}
                  value={exp.description}
                  onChange={(e) =>
                    updateExperience(index, { description: e.target.value })
                  }
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  const renderSkills = () => (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Skills</Typography>
        <Button startIcon={<Add />} onClick={addSkill}>
          Add Skill
        </Button>
      </Box>
      {resume.skills.map((skill, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">Skill #{index + 1}</Typography>
              <IconButton onClick={() => removeSkill(index)} color="error">
                <Delete />
              </IconButton>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Skill Name"
                  value={skill.name}
                  onChange={(e) => updateSkill(index, { name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Level"
                  value={skill.level}
                  onChange={(e) =>
                    updateSkill(index, { level: e.target.value })
                  }
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </TextField>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  const renderProjects = () => (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Projects</Typography>
        <Button startIcon={<Add />} onClick={addProject}>
          Add Project
        </Button>
      </Box>
      {resume.projects.map((project, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">Project #{index + 1}</Typography>
              <IconButton onClick={() => removeProject(index)} color="error">
                <Delete />
              </IconButton>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Project Title"
                  value={project.title}
                  onChange={(e) =>
                    updateProject(index, { title: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tech Stack"
                  placeholder="e.g., React, Node.js, MongoDB, AWS"
                  value={project.techStack}
                  onChange={(e) =>
                    updateProject(index, { techStack: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={project.startDate}
                  onChange={(e) =>
                    updateProject(index, { startDate: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={project.endDate}
                  onChange={(e) =>
                    updateProject(index, { endDate: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                  disabled={project.current}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Demo/Live Link"
                  placeholder="https://your-project-demo.com"
                  value={project.demoLink}
                  onChange={(e) =>
                    updateProject(index, { demoLink: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="GitHub Link"
                  placeholder="https://github.com/username/project"
                  value={project.githubLink}
                  onChange={(e) =>
                    updateProject(index, { githubLink: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Project Description"
                  multiline
                  rows={4}
                  placeholder="Describe your project, key features, challenges overcome, and your role..."
                  value={project.description}
                  onChange={(e) =>
                    updateProject(index, { description: e.target.value })
                  }
                />
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}
                >
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() =>
                      openSuggestions({
                        text: project.description || "",
                        context: `Project description. Title: ${project.title}. Tech stack: ${project.techStack}.`,
                        target: { type: "project", index },
                      })
                    }
                  >
                    Get AI Suggestions
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
      {resume.projects.length === 0 && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          py={4}
          textAlign="center"
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Projects Added Yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Add your projects to showcase your technical skills and experience
          </Typography>
          <Button variant="outlined" startIcon={<Add />} onClick={addProject}>
            Add Your First Project
          </Button>
        </Box>
      )}
    </Box>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderPersonalInfo();
      case 1:
        return renderEducation();
      case 2:
        return renderExperience();
      case 3:
        return renderSkills();
      case 4:
        return renderProjects();
      default:
        return "Unknown step";
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Resume Builder
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Palette />}
            onClick={() => setThemeSelectorOpen(true)}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Choose Theme
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary">
          {id === "new" ? "Create a new resume" : "Edit your resume"}
        </Typography>
        {resume.template && (
          <Box sx={{ mt: 1 }}>
            <Chip
              label={`Theme: ${getThemeById(resume.template).name}`}
              color="primary"
              size="small"
              sx={{ fontWeight: 500 }}
            />
          </Box>
        )}
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Content + AI Panel */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Paper sx={{ p: 3, mb: 3, flex: 1 }}>
          {getStepContent(activeStep)}
        </Paper>
        {aiOpen && (
          <AISuggestionPanel
            loading={aiLoading}
            data={aiData}
            onApply={applySuggestion}
            onRegenerate={regenerateSuggestions}
            title="AI Suggestions"
          />
        )}
      </Box>

      {/* Navigation */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          startIcon={<ArrowBack />}
        >
          Back
        </Button>

        <Box>
          <Button
            variant="outlined"
            onClick={handleSave}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={20} /> : <Save />}
            sx={{ mr: 1 }}
          >
            {saving ? "Saving..." : "Save"}
          </Button>

          {id && id !== "new" && (
            <>
              <Button
                variant="outlined"
                onClick={handlePreview}
                startIcon={<Preview />}
                sx={{ mr: 1 }}
              >
                Preview
              </Button>
              <Button
                variant="outlined"
                onClick={handleEmailShare}
                startIcon={<Email />}
                sx={{ mr: 1 }}
              >
                Share via Email
              </Button>
            </>
          )}

          <Button
            variant="contained"
            onClick={activeStep === steps.length - 1 ? handleSave : handleNext}
            disabled={saving}
            endIcon={
              activeStep === steps.length - 1 ? (
                saving ? (
                  <CircularProgress size={20} />
                ) : (
                  <Save />
                )
              ) : (
                <ArrowForward />
              )
            }
          >
            {activeStep === steps.length - 1
              ? saving
                ? "Saving..."
                : "Finish"
              : "Next"}
          </Button>
        </Box>
      </Box>

      {/* Theme Selector */}
      <ThemeSelector
        open={themeSelectorOpen}
        onClose={() => setThemeSelectorOpen(false)}
        onSelectTheme={handleThemeSelect}
        currentTheme={resume.template}
      />

      {/* Email Share Modal */}
      <EmailShareModal
        open={emailShareOpen}
        onClose={() => setEmailShareOpen(false)}
        resumeId={id}
        resumeTitle={resume.title}
      />
    </Container>
  );
};

export default ResumeBuilder;
