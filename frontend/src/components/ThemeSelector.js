import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
} from "@mui/material";
import {
  Close,
  CheckCircle,
  Palette,
  Business,
  School,
  Code,
  Brush,
  TrendingUp,
} from "@mui/icons-material";

const themes = [
  {
    id: "modern",
    name: "Modern Professional",
    description: "Clean and contemporary design for corporate roles",
    category: "Professional",
    color: "#6366f1",
    gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    icon: <Business />,
    preview: {
      header: {
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      },
      sections: { borderLeft: "3px solid #6366f1" },
      accent: "#6366f1",
    },
  },
  {
    id: "creative",
    name: "Creative Portfolio",
    description: "Bold and artistic design for creative professionals",
    category: "Creative",
    color: "#ec4899",
    gradient: "linear-gradient(135deg, #ec4899 0%, #f97316 100%)",
    icon: <Brush />,
    preview: {
      header: {
        background: "linear-gradient(135deg, #ec4899 0%, #f97316 100%)",
      },
      sections: { borderLeft: "3px solid #ec4899" },
      accent: "#ec4899",
    },
  },
  {
    id: "minimal",
    name: "Minimal Clean",
    description: "Simple and elegant design focusing on content",
    category: "Minimal",
    color: "#1e293b",
    gradient: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
    icon: <TrendingUp />,
    preview: {
      header: {
        background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
      },
      sections: { borderLeft: "3px solid #1e293b" },
      accent: "#1e293b",
    },
  },
  {
    id: "academic",
    name: "Academic Scholar",
    description: "Formal design perfect for research and education",
    category: "Academic",
    color: "#059669",
    gradient: "linear-gradient(135deg, #059669 0%, #047857 100%)",
    icon: <School />,
    preview: {
      header: {
        background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
      },
      sections: { borderLeft: "3px solid #059669" },
      accent: "#059669",
    },
  },
  {
    id: "tech",
    name: "Tech Developer",
    description: "Modern design for software and tech professionals",
    category: "Technology",
    color: "#0ea5e9",
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)",
    icon: <Code />,
    preview: {
      header: {
        background: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)",
      },
      sections: { borderLeft: "3px solid #0ea5e9" },
      accent: "#0ea5e9",
    },
  },
  {
    id: "elegant",
    name: "Elegant Classic",
    description: "Timeless design with sophisticated styling",
    category: "Classic",
    color: "#7c3aed",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
    icon: <Palette />,
    preview: {
      header: {
        background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
      },
      sections: { borderLeft: "3px solid #7c3aed" },
      accent: "#7c3aed",
    },
  },
];

const ThemeSelector = ({
  open,
  onClose,
  onSelectTheme,
  currentTheme = "modern",
}) => {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);

  const handleThemeSelect = (themeId) => {
    setSelectedTheme(themeId);
  };

  const handleConfirm = () => {
    onSelectTheme(selectedTheme);
    onClose();
  };

  const ThemePreview = ({ theme }) => (
    <Box
      sx={{
        width: "100%",
        height: 120,
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
        mb: 2,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          height: "40%",
          ...theme.preview.header,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "white",
            fontWeight: 600,
            fontSize: "0.75rem",
          }}
        >
          JOHN DOE
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 1.5, background: "white" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 1,
            ...theme.preview.sections,
            pl: 1,
          }}
        >
          <Box
            sx={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              backgroundColor: theme.preview.accent,
              mr: 1,
            }}
          />
          <Typography
            variant="caption"
            sx={{
              color: theme.preview.accent,
              fontWeight: 600,
              fontSize: "0.6rem",
            }}
          >
            EXPERIENCE
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            ...theme.preview.sections,
            pl: 1,
          }}
        >
          <Box
            sx={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              backgroundColor: theme.preview.accent,
              mr: 1,
            }}
          />
          <Typography
            variant="caption"
            sx={{
              color: theme.preview.accent,
              fontWeight: 600,
              fontSize: "0.6rem",
            }}
          >
            EDUCATION
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Choose Your Resume Theme
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Select a theme that best represents your professional style and
          industry
        </Typography>

        <Grid container spacing={3}>
          {themes.map((theme) => (
            <Grid item xs={12} sm={6} md={4} key={theme.id}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  sx={{
                    cursor: "pointer",
                    border:
                      selectedTheme === theme.id
                        ? `2px solid ${theme.color}`
                        : "2px solid transparent",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: `0 8px 25px ${theme.color}20`,
                    },
                  }}
                  onClick={() => handleThemeSelect(theme.id)}
                >
                  <CardContent>
                    {/* Theme Preview */}
                    <ThemePreview theme={theme} />

                    {/* Theme Info */}
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Box
                        sx={{
                          color: theme.color,
                          mr: 1,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {theme.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, fontSize: "1rem" }}
                      >
                        {theme.name}
                      </Typography>
                      {selectedTheme === theme.id && (
                        <CheckCircle
                          sx={{
                            color: theme.color,
                            ml: "auto",
                            fontSize: 20,
                          }}
                        />
                      )}
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, fontSize: "0.875rem" }}
                    >
                      {theme.description}
                    </Typography>

                    <Chip
                      label={theme.category}
                      size="small"
                      sx={{
                        backgroundColor: `${theme.color}15`,
                        color: theme.color,
                        fontWeight: 600,
                        fontSize: "0.75rem",
                      }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 4,
            pt: 2,
            borderTop: "1px solid rgba(0, 0, 0, 0.1)",
          }}
        >
          <Button variant="outlined" onClick={onClose} sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            sx={{
              borderRadius: 2,
              background: themes.find((t) => t.id === selectedTheme)?.gradient,
              "&:hover": {
                background: themes.find((t) => t.id === selectedTheme)
                  ?.gradient,
                opacity: 0.9,
              },
            }}
          >
            Apply Theme
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ThemeSelector;
