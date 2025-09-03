import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  cursor: "pointer",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
    transition: "left 0.5s",
  },
  "&:hover::before": {
    left: "100%",
  },
}));

const AnimatedCard = ({
  children,
  onClick,
  delay = 0,
  duration = 0.3,
  hoverScale = 1.05,
  hoverY = -8,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={{
        scale: hoverScale,
        y: hoverY,
        transition: {
          duration: 0.2,
          ease: [0.4, 0, 0.2, 1],
        },
      }}
      whileTap={{
        scale: 0.98,
        transition: {
          duration: 0.1,
        },
      }}
    >
      <StyledCard
        onClick={onClick}
        sx={{
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          ...props.sx,
        }}
        {...props}
      >
        <CardContent>{children}</CardContent>
      </StyledCard>
    </motion.div>
  );
};

export default AnimatedCard;
