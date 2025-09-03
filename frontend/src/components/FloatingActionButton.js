import React from "react";
import { motion } from "framer-motion";
import { Fab, styled } from "@mui/material";

const StyledFab = styled(Fab)(({ theme, gradient }) => ({
  position: "fixed",
  bottom: 24,
  right: 24,
  width: 56,
  height: 56,
  borderRadius: "50%",
  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",

  ...(gradient === "primary" && {
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    "&:hover": {
      background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
      boxShadow: "0 12px 35px rgba(99, 102, 241, 0.4)",
      transform: "scale(1.05)",
    },
  }),

  ...(gradient === "secondary" && {
    background: "linear-gradient(135deg, #ec4899 0%, #f97316 100%)",
    "&:hover": {
      background: "linear-gradient(135deg, #db2777 0%, #ea580c 100%)",
      boxShadow: "0 12px 35px rgba(236, 72, 153, 0.4)",
      transform: "scale(1.05)",
    },
  }),

  ...(gradient === "success" && {
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    "&:hover": {
      background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
      boxShadow: "0 12px 35px rgba(16, 185, 129, 0.4)",
      transform: "scale(1.05)",
    },
  }),

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: "50%",
    background:
      "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
    opacity: 0,
    transition: "opacity 0.3s",
  },

  "&:hover::before": {
    opacity: 1,
  },
}));

const FloatingActionButton = ({
  children,
  gradient = "primary",
  delay = 0,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0, y: 50 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      // Removed all animations to prevent movement of fixed positioned button
    >
      <StyledFab gradient={gradient} {...props}>
        {children}
      </StyledFab>
    </motion.div>
  );
};

export default FloatingActionButton;
