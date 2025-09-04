import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Download, Edit, ArrowBack, Print, Email } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { resumeService } from "../services/resumeService";
import generatePDF from "react-to-pdf";
import { getThemeById } from "../theme/resumeThemes";
import { formatDate } from "../utils/helpers";
import EmailShareModal from "../components/EmailShareModal";

const ThemedResume = ({ resume }) => {
  const theme = getThemeById(resume.template || "modern");
  const styles = theme.styles;

  // uses shared formatDate from utils

  return (
    <Box>
      {/* Header */}
      <Box sx={styles.header}>
        <Typography sx={styles.name}>
          {resume.personalInfo.firstName} {resume.personalInfo.lastName}
        </Typography>
        {resume.personalInfo.summary && (
          <Typography sx={styles.title}>
            {resume.personalInfo.summary.split(" ").slice(0, 10).join(" ")}...
          </Typography>
        )}
        <Box sx={styles.contact}>
          {resume.personalInfo.email && (
            <Typography>{resume.personalInfo.email}</Typography>
          )}
          {resume.personalInfo.phone && (
            <Typography>{resume.personalInfo.phone}</Typography>
          )}
          {resume.personalInfo.address.city &&
            resume.personalInfo.address.state && (
              <Typography>
                {resume.personalInfo.address.city},{" "}
                {resume.personalInfo.address.state}
              </Typography>
            )}
          {resume.personalInfo.linkedin && (
            <Typography>LinkedIn: {resume.personalInfo.linkedin}</Typography>
          )}
          {resume.personalInfo.github && (
            <Typography>GitHub: {resume.personalInfo.github}</Typography>
          )}
        </Box>
      </Box>

      {/* Summary */}
      {resume.personalInfo.summary && (
        <Box sx={styles.section}>
          <Typography sx={styles.sectionTitle}>Professional Summary</Typography>
          <Typography sx={styles.itemDescription}>
            {resume.personalInfo.summary}
          </Typography>
        </Box>
      )}

      {/* Experience */}
      {resume.experience && resume.experience.length > 0 && (
        <Box sx={styles.section}>
          <Typography sx={styles.sectionTitle}>
            Professional Experience
          </Typography>
          {resume.experience.map((exp, index) => (
            <Box key={index} sx={styles.item}>
              <Typography sx={styles.itemTitle}>{exp.position}</Typography>
              <Typography sx={styles.itemSubtitle}>
                {exp.company} {exp.location && `• ${exp.location}`}
              </Typography>
              <Typography sx={styles.itemDate}>
                {formatDate(exp.startDate)} -{" "}
                {exp.current ? "Present" : formatDate(exp.endDate)}
              </Typography>
              <Typography sx={styles.itemDescription}>
                {exp.description}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Education */}
      {resume.education && resume.education.length > 0 && (
        <Box sx={styles.section}>
          <Typography sx={styles.sectionTitle}>Education</Typography>
          {resume.education.map((edu, index) => (
            <Box key={index} sx={styles.item}>
              <Typography sx={styles.itemTitle}>{edu.degree}</Typography>
              <Typography sx={styles.itemSubtitle}>
                {edu.institution} {edu.field && `• ${edu.field}`}
              </Typography>
              <Typography sx={styles.itemDate}>
                {formatDate(edu.startDate)} -{" "}
                {edu.current ? "Present" : formatDate(edu.endDate)}
                {edu.gpa && ` • GPA: ${edu.gpa}`}
              </Typography>
              {edu.description && (
                <Typography sx={styles.itemDescription}>
                  {edu.description}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <Box sx={styles.section}>
          <Typography sx={styles.sectionTitle}>Skills</Typography>
          <Box sx={styles.skills}>
            {resume.skills.map((skill, index) => (
              <Typography key={index} sx={styles.skill}>
                {skill.name} {skill.level && `(${skill.level})`}
              </Typography>
            ))}
          </Box>
        </Box>
      )}

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <Box sx={styles.section}>
          <Typography sx={styles.sectionTitle}>Projects</Typography>
          {resume.projects.map((project, index) => (
            <Box key={index} sx={styles.item}>
              <Typography sx={styles.itemTitle}>{project.title}</Typography>
              <Typography sx={styles.itemSubtitle}>
                {project.techStack && `Tech Stack: ${project.techStack}`}
              </Typography>
              <Typography sx={styles.itemDate}>
                {formatDate(project.startDate)} -{" "}
                {project.current ? "Present" : formatDate(project.endDate)}
              </Typography>
              <Typography sx={styles.itemDescription}>
                {project.description}
              </Typography>
              {(project.demoLink || project.githubLink) && (
                <Box sx={{ mt: 1 }}>
                  {project.demoLink && (
                    <Typography
                      sx={{ fontSize: "0.9rem", color: "primary.main" }}
                    >
                      Demo: {project.demoLink}
                    </Typography>
                  )}
                  {project.githubLink && (
                    <Typography
                      sx={{ fontSize: "0.9rem", color: "primary.main" }}
                    >
                      GitHub: {project.githubLink}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Certifications */}
      {resume.certifications && resume.certifications.length > 0 && (
        <Box sx={styles.section}>
          <Typography sx={styles.sectionTitle}>Certifications</Typography>
          {resume.certifications.map((cert, index) => (
            <Box key={index} sx={styles.item}>
              <Typography sx={styles.itemTitle}>{cert.name}</Typography>
              <Typography sx={styles.itemSubtitle}>{cert.issuer}</Typography>
              <Typography sx={styles.itemDate}>
                {formatDate(cert.date)}{" "}
                {cert.expiryDate && `- ${formatDate(cert.expiryDate)}`}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Languages */}
      {resume.languages && resume.languages.length > 0 && (
        <Box sx={styles.section}>
          <Typography sx={styles.sectionTitle}>Languages</Typography>
          <Box sx={styles.skills}>
            {resume.languages.map((lang, index) => (
              <Typography key={index} sx={styles.skill}>
                {lang.name} ({lang.level})
              </Typography>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

const ResumePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emailShareOpen, setEmailShareOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const resumeRef = useRef();

  const fetchResume = useCallback(async () => {
    try {
      setLoading(true);
      const response = await resumeService.getResume(id);
      setResume(response.data.data);
      setError(null);
    } catch (err) {
      setError("Failed to load resume");
      console.error("Error fetching resume:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchResume();
  }, [id, fetchResume]);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const options = {
        filename: `${resume.personalInfo.firstName}_${resume.personalInfo.lastName}_Resume.pdf`,
        page: {
          margin: 20,
          format: "a4",
        },
      };

      await generatePDF(resumeRef, options);
    } catch (err) {
      setError("Failed to download PDF");
      console.error("Error generating PDF:", err);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmailShare = () => {
    setEmailShareOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!resume) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning">Resume not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Resume Preview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {resume.title}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate("/dashboard")}
          >
            Back
          </Button>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => navigate(`/resume/${id}/edit`)}
          >
            Edit
          </Button>
          <Tooltip title="Print Resume">
            <IconButton onClick={handlePrint}>
              <Print />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share via Email">
            <IconButton onClick={handleEmailShare}>
              <Email />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={
              downloading ? <CircularProgress size={20} /> : <Download />
            }
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? "Generating..." : "Download PDF"}
          </Button>
        </Box>
      </Box>

      {/* Resume Content */}
      <Paper
        ref={resumeRef}
        elevation={3}
        sx={{
          p: 4,
          maxWidth: "800px",
          margin: "0 auto",
          "@media print": {
            boxShadow: "none",
            margin: 0,
            padding: 2,
          },
        }}
      >
        <ThemedResume resume={resume} />
      </Paper>

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

export default ResumePreview;
