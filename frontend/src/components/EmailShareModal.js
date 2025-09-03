import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Close, Send, Email } from "@mui/icons-material";
import { motion } from "framer-motion";

const EmailShareModal = ({ open, onClose, resumeId, resumeTitle }) => {
  const [formData, setFormData] = useState({
    recipientEmail: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const validateForm = () => {
    if (!formData.recipientEmail.trim()) {
      setError("Recipient email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.recipientEmail)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.subject.trim()) {
      setError("Subject is required");
      return false;
    }
    if (!formData.message.trim()) {
      setError("Message is required");
      return false;
    }
    return true;
  };

  const handleSendEmail = async () => {
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Call the backend API to send email
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/email/share-resume`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            recipientEmail: formData.recipientEmail,
            subject: formData.subject,
            message: formData.message,
            resumeId,
            resumeTitle,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send email");
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setFormData({ recipientEmail: "", subject: "", message: "" });
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to send email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({ recipientEmail: "", subject: "", message: "" });
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  const getDefaultSubject = () => {
    return `Resume: ${resumeTitle || "My Resume"}`;
  };

  const getDefaultMessage = () => {
    return `Hi,

I'm sharing my resume with you. You can view it at the link below:

${window.location.origin}/resume/${resumeId}/preview

Best regards`;
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperComponent={motion.div}
      PaperProps={{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.3 },
        style: {
          backgroundColor: "white",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
      }}
      BackdropProps={{
        style: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <Email color="primary" />
            <Typography variant="h6">Share Resume via Email</Typography>
          </Box>
          <IconButton onClick={handleClose} disabled={loading}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          backgroundColor: "white",
          p: 3,
          "& .MuiTextField-root": {
            backgroundColor: "white",
          },
        }}
      >
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Email sent successfully!
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Share your resume "{resumeTitle || "My Resume"}" with someone via
            email. The recipient will receive a link to view your resume.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            fullWidth
            label="Recipient Email"
            type="email"
            value={formData.recipientEmail}
            onChange={handleInputChange("recipientEmail")}
            placeholder="recipient@example.com"
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Subject"
            value={formData.subject}
            onChange={handleInputChange("subject")}
            placeholder={getDefaultSubject()}
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Message"
            multiline
            rows={6}
            value={formData.message}
            onChange={handleInputChange("message")}
            placeholder={getDefaultMessage()}
            disabled={loading}
            helperText="The resume link will be automatically included in your message"
          />

          <Box
            sx={{
              p: 2,
              bgcolor: "grey.50",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "grey.200",
              backgroundColor: "white",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Resume Link:</strong>
            </Typography>
            <Typography
              variant="body2"
              sx={{
                wordBreak: "break-all",
                fontFamily: "monospace",
                bgcolor: "white",
                p: 1,
                borderRadius: 0.5,
                border: "1px solid",
                borderColor: "grey.300",
                backgroundColor: "#f8f9fa",
                color: "#495057",
                fontWeight: 500,
              }}
            >
              {window.location.origin}/resume/{resumeId}/preview
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={handleClose} disabled={loading} sx={{ mr: 1 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSendEmail}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <Send />}
          sx={{
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
            },
          }}
        >
          {loading ? "Sending..." : "Send Email"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailShareModal;
