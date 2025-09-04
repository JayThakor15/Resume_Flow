import axios from "axios";

// Determine API URL based on environment
const getApiUrl = () => {
  // If there's an explicit environment variable, use it
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // If we're on localhost, use local backend
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return "http://localhost:5000/api";
  }

  // Otherwise, use deployed backend
  return "https://resume-flow.onrender.com/api";
};

const API_URL = getApiUrl();

console.log("Using API URL:", API_URL); // Debug log

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration (do not hard-redirect; let UI handle state)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Avoid redirect loops here; AuthContext will react to missing token
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Register user
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put("/auth/profile", userData);
    return response;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put("/auth/password", passwordData);
    return response;
  },
};
