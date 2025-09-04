import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import ResumePreview from "./pages/ResumePreview";
import Profile from "./pages/Profile";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        Loading...
      </Box>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirects to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        Loading...
      </Box>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

function AppRoutes({ toggleThemeMode, currentThemeMode }) {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Navbar
              toggleThemeMode={toggleThemeMode}
              currentThemeMode={currentThemeMode}
            />
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume/new"
        element={
          <ProtectedRoute>
            <Navbar
              toggleThemeMode={toggleThemeMode}
              currentThemeMode={currentThemeMode}
            />
            <ResumeBuilder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume/:id/edit"
        element={
          <ProtectedRoute>
            <Navbar
              toggleThemeMode={toggleThemeMode}
              currentThemeMode={currentThemeMode}
            />
            <ResumeBuilder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume/:id/preview"
        element={
          <ProtectedRoute>
            <Navbar
              toggleThemeMode={toggleThemeMode}
              currentThemeMode={currentThemeMode}
            />
            <ResumePreview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Navbar
              toggleThemeMode={toggleThemeMode}
              currentThemeMode={currentThemeMode}
            />
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App({ toggleThemeMode, currentThemeMode }) {
  return (
    <AuthProvider>
      <AppRoutes
        toggleThemeMode={toggleThemeMode}
        currentThemeMode={currentThemeMode}
      />
    </AuthProvider>
  );
}

export default App;
