import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  Add,
  Person,
  Logout,
  Close,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/login");
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate("/profile");
  };

  const handleDashboard = () => {
    setMobileOpen(false);
    navigate("/dashboard");
  };

  const handleCreateResume = () => {
    setMobileOpen(false);
    navigate("/resume/new");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    );
  };

  const mobileMenuItems = [
    {
      text: "Dashboard",
      icon: <Dashboard />,
      onClick: handleDashboard,
    },
    {
      text: "Create Resume",
      icon: <Add />,
      onClick: handleCreateResume,
    },
    {
      text: "Profile",
      icon: <Person />,
      onClick: handleProfile,
    },
    {
      text: "Logout",
      icon: <Logout />,
      onClick: handleLogout,
    },
  ];

  return (
    <>
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <AppBar
          position="fixed"
          sx={{
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            boxShadow: "0 4px 20px rgba(99, 102, 241, 0.3)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            {/* Logo/Brand */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 700,
                  cursor: "pointer",
                  color: "white",
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
                onClick={() => navigate("/dashboard")}
              >
                📄 Resume Flow
              </Typography>
            </motion.div>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    color="inherit"
                    onClick={() => navigate("/dashboard")}
                    sx={{
                      fontWeight: 600,
                      textTransform: "none",
                      fontSize: "1rem",
                      "&:hover": {
                        background: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    Dashboard
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    color="inherit"
                    onClick={() => navigate("/resume/new")}
                    sx={{
                      fontWeight: 600,
                      textTransform: "none",
                      fontSize: "1rem",
                      background: "rgba(255, 255, 255, 0.1)",
                      "&:hover": {
                        background: "rgba(255, 255, 255, 0.2)",
                      },
                    }}
                  >
                    Create Resume
                  </Button>
                </motion.div>

                {/* User Menu */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconButton
                    onClick={handleMenuOpen}
                    sx={{
                      color: "white",
                      "&:hover": {
                        background: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        background: "rgba(255, 255, 255, 0.2)",
                        color: "white",
                        fontWeight: 600,
                        fontSize: "1rem",
                        border: "2px solid rgba(255, 255, 255, 0.3)",
                      }}
                    >
                      {getInitials(user?.name)}
                    </Avatar>
                  </IconButton>
                </motion.div>
              </Box>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  color="inherit"
                  onClick={handleDrawerToggle}
                  sx={{
                    color: "white",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </motion.div>
            )}
          </Toolbar>
        </AppBar>
      </motion.div>

      {/* Desktop User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={handleProfile}
          sx={{ borderRadius: 2, mx: 1, my: 0.5 }}
        >
          <Person sx={{ mr: 2, color: "#6366f1" }} />
          Profile
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem
          onClick={handleLogout}
          sx={{ borderRadius: 2, mx: 1, my: 0.5, color: "error.main" }}
        >
          <Logout sx={{ mr: 2 }} />
          Logout
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            width: 280,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#6366f1" }}>
              Menu
            </Typography>
            <IconButton onClick={handleDrawerToggle}>
              <Close />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 3,
              p: 2,
              background: "rgba(99, 102, 241, 0.1)",
              borderRadius: 2,
            }}
          >
            <Avatar
              sx={{
                width: 50,
                height: 50,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                color: "white",
                fontWeight: 600,
                fontSize: "1.2rem",
                mr: 2,
              }}
            >
              {getInitials(user?.name)}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
          </Box>

          <List>
            {mobileMenuItems.map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ListItem
                  button
                  onClick={item.onClick}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    "&:hover": {
                      background: "rgba(99, 102, 241, 0.1)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "#6366f1" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      sx: { fontWeight: 500 },
                    }}
                  />
                </ListItem>
              </motion.div>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Toolbar spacer */}
      <Toolbar />
    </>
  );
};

export default Navbar;
