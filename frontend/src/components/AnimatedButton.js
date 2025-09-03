import React from "react";
import { motion } from "framer-motion";
import { Button, styled } from "@mui/material";

const StyledButton = styled(Button)(({ theme, variant, gradient }) => ({
  position: "relative",
  overflow: "hidden",
  borderRadius: 16,
  padding: "12px 32px",
  fontSize: "1rem",
  fontWeight: 600,
  textTransform: "none",
  border: "none",
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",

  ...(gradient === "primary" && {
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    color: "#ffffff",
    boxShadow: "0 4px 15px rgba(99, 102, 241, 0.4)",
    "&:hover": {
      background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
      boxShadow: "0 8px 25px rgba(99, 102, 241, 0.6)",
      transform: "translateY(-2px)",
    },
  }),

  ...(gradient === "secondary" && {
    background: "linear-gradient(135deg, #ec4899 0%, #f97316 100%)",
    color: "#ffffff",
    boxShadow: "0 4px 15px rgba(236, 72, 153, 0.4)",
    "&:hover": {
      background: "linear-gradient(135deg, #db2777 0%, #ea580c 100%)",
      boxShadow: "0 8px 25px rgba(236, 72, 153, 0.6)",
      transform: "translateY(-2px)",
    },
  }),

  ...(gradient === "success" && {
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "#ffffff",
    boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)",
    "&:hover": {
      background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
      boxShadow: "0 8px 25px rgba(16, 185, 129, 0.6)",
      transform: "translateY(-2px)",
    },
  }),

  ...(variant === "outlined" && {
    background: "transparent",
    border: "2px solid #6366f1",
    color: "#6366f1",
    "&:hover": {
      background: "#6366f1",
      color: "#ffffff",
      transform: "translateY(-2px)",
      boxShadow: "0 8px 25px rgba(99, 102, 241, 0.3)",
    },
  }),

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
    transition: "left 0.5s",
  },

  "&:hover::before": {
    left: "100%",
  },

  "&:active": {
    transform: "translateY(0)",
  },
}));

const AnimatedButton = ({
  children,
  gradient = "primary",
  delay = 0,
  duration = 0.3,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={{
        scale: 1.05,
        transition: {
          duration: 0.2,
          ease: [0.4, 0, 0.2, 1],
        },
      }}
      whileTap={{
        scale: 0.95,
        transition: {
          duration: 0.1,
        },
      }}
    >
      <StyledButton gradient={gradient} {...props}>
        {children}
      </StyledButton>
    </motion.div>
  );
};

export default AnimatedButton;
