import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Avatar,
  LinearProgress,
  Alert,
  useTheme,
} from "@mui/material";
import {
  MoreVert,
  Edit,
  Visibility,
  ContentCopy,
  Delete,
  ToggleOn,
  ToggleOff,
  Add,
  Description,
  TrendingUp,
  Schedule,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { resumeService } from "../services/resumeService";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmDialog from "../components/ConfirmDialog";
import AnimatedButton from "../components/AnimatedButton";
import FloatingActionButton from "../components/FloatingActionButton";

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const { user } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await resumeService.getResumes();
      console.log("API Response:", response); // Debug log

      // Ensure we always have an array, even if the response structure is different
      const resumesData = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data?.resumes)
        ? response.data.resumes
        : [];

      console.log("Processed resumes data:", resumesData); // Debug log
      setResumes(resumesData);
    } catch (error) {
      setError("Failed to fetch resumes");
      console.error("Error fetching resumes:", error);
      setResumes([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, resume) => {
    setAnchorEl(event.currentTarget);
    setSelectedResume(resume);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedResume(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    navigate(`/resume/${selectedResume._id}/edit`);
  };

  const handlePreview = () => {
    handleMenuClose();
    navigate(`/resume/${selectedResume._id}/preview`);
  };

  const handleDuplicate = async () => {
    handleMenuClose();
    setConfirmDialog({
      open: true,
      title: "Duplicate Resume",
      message: `Are you sure you want to duplicate "${selectedResume.title}"?`,
      onConfirm: async () => {
        try {
          await resumeService.duplicateResume(selectedResume._id);
          fetchResumes();
          setConfirmDialog({
            open: false,
            title: "",
            message: "",
            onConfirm: null,
          });
        } catch (error) {
          setError("Failed to duplicate resume");
        }
      },
    });
  };

  const handleDelete = () => {
    handleMenuClose();
    setConfirmDialog({
      open: true,
      title: "Delete Resume",
      message: `Are you sure you want to delete "${selectedResume.title}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await resumeService.deleteResume(selectedResume._id);
          fetchResumes();
          setConfirmDialog({
            open: false,
            title: "",
            message: "",
            onConfirm: null,
          });
        } catch (error) {
          setError("Failed to delete resume");
        }
      },
    });
  };

  const handleToggleStatus = async () => {
    handleMenuClose();
    try {
      await resumeService.toggleResumeStatus(selectedResume._id);
      fetchResumes();
    } catch (error) {
      setError("Failed to update resume status");
    }
  };

  const handleCreateResume = () => {
    navigate("/resume/new");
  };

  const getStats = () => {
    // Ensure resumes is always an array
    const resumesArray = Array.isArray(resumes) ? resumes : [];

    const total = resumesArray.length;
    const active = resumesArray.filter((r) => r.isActive).length;
    const recent = resumesArray.filter((r) => {
      const updatedAt = new Date(r.updatedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return updatedAt > weekAgo;
    }).length;

    return { total, active, recent };
  };

  const stats = getStats();

  if (loading) {
    return <LoadingSpinner message="Loading your resumes..." />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          theme.palette.mode === "light"
            ? "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
            : "linear-gradient(135deg, #0b1220 0%, #0f172a 100%)",
        padding: 3,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              Welcome back, {user?.name}! 👋
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Manage and create your professional resumes
            </Typography>
          </Box>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "white",
                  borderRadius: 3,
                  boxShadow: "0 8px 32px rgba(99, 102, 241, 0.3)",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.2)",
                        mr: 2,
                      }}
                    >
                      <Description />
                    </Avatar>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stats.total}
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Total Resumes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  borderRadius: 3,
                  boxShadow: "0 8px 32px rgba(16, 185, 129, 0.3)",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.2)",
                        mr: 2,
                      }}
                    >
                      <TrendingUp />
                    </Avatar>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stats.active}
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Active Resumes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  background:
                    "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  color: "white",
                  borderRadius: 3,
                  boxShadow: "0 8px 32px rgba(245, 158, 11, 0.3)",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.2)",
                        mr: 2,
                      }}
                    >
                      <Schedule />
                    </Avatar>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stats.recent}
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Recently Updated
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            style={{ marginBottom: 16 }}
          >
            <Alert
              severity="error"
              onClose={() => setError(null)}
              sx={{
                borderRadius: 2,
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
              }}
            >
              {error}
            </Alert>
          </motion.div>
        )}

        {/* Resumes Grid */}
        {!Array.isArray(resumes) || resumes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card
              sx={{
                textAlign: "center",
                padding: 6,
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: 3,
              }}
            >
              <Typography variant="h5" color="text.secondary" gutterBottom>
                No resumes yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Create your first resume to get started
              </Typography>
              <AnimatedButton
                gradient="primary"
                onClick={handleCreateResume}
                startIcon={<Add />}
              >
                Create Your First Resume
              </AnimatedButton>
            </Card>
          </motion.div>
        ) : (
          <Grid container spacing={3}>
            {(Array.isArray(resumes) ? resumes : []).map((resume, index) => (
              <Grid item xs={12} sm={6} md={4} key={resume._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 * index,
                  }}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      background: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: 3,
                      position: "relative",
                      overflow: "hidden",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: resume.isActive
                          ? "linear-gradient(90deg, #10b981, #059669)"
                          : "linear-gradient(90deg, #6b7280, #4b5563)",
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, pt: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, flex: 1 }}
                        >
                          {resume.title}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, resume)}
                        >
                          <MoreVert />
                        </IconButton>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Chip
                          label={resume.isActive ? "Active" : "Inactive"}
                          color={resume.isActive ? "success" : "default"}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Chip
                          label={`v${resume.version}`}
                          variant="outlined"
                          size="small"
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        Last updated:{" "}
                        {new Date(resume.updatedAt).toLocaleDateString()}
                      </Typography>

                      <LinearProgress
                        variant="determinate"
                        value={70}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: "rgba(99, 102, 241, 0.1)",
                          "& .MuiLinearProgress-bar": {
                            background:
                              "linear-gradient(90deg, #6366f1, #8b5cf6)",
                            borderRadius: 3,
                          },
                        }}
                      />
                    </CardContent>

                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <AnimatedButton
                        size="small"
                        gradient="primary"
                        onClick={() => navigate(`/resume/${resume._id}/edit`)}
                        sx={{ flex: 1, mr: 1 }}
                      >
                        Edit
                      </AnimatedButton>
                      <AnimatedButton
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          navigate(`/resume/${resume._id}/preview`)
                        }
                        sx={{ flex: 1 }}
                      >
                        Preview
                      </AnimatedButton>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Floating Action Button */}
        <FloatingActionButton
          gradient="primary"
          onClick={handleCreateResume}
          sx={{ zIndex: 1000 }}
        >
          <Add />
        </FloatingActionButton>

        {/* Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <MenuItem onClick={handleEdit}>
            <Edit sx={{ mr: 2, fontSize: 20 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handlePreview}>
            <Visibility sx={{ mr: 2, fontSize: 20 }} />
            Preview
          </MenuItem>
          <MenuItem onClick={handleDuplicate}>
            <ContentCopy sx={{ mr: 2, fontSize: 20 }} />
            Duplicate
          </MenuItem>
          <MenuItem onClick={handleToggleStatus}>
            {selectedResume?.isActive ? (
              <ToggleOff sx={{ mr: 2, fontSize: 20 }} />
            ) : (
              <ToggleOn sx={{ mr: 2, fontSize: 20 }} />
            )}
            {selectedResume?.isActive ? "Deactivate" : "Activate"}
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
            <Delete sx={{ mr: 2, fontSize: 20 }} />
            Delete
          </MenuItem>
        </Menu>

        {/* Confirm Dialog */}
        <ConfirmDialog
          open={confirmDialog.open}
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() =>
            setConfirmDialog({
              open: false,
              title: "",
              message: "",
              onConfirm: null,
            })
          }
        />
      </Container>
    </Box>
  );
};

export default Dashboard;
