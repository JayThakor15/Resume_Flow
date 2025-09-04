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

console.log("Resume Service using API URL:", API_URL); // Debug log

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

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const resumeService = {
  // Get all resumes for current user
  getResumes: async () => {
    const response = await api.get("/resumes");
    return response;
  },

  // Get single resume by ID
  getResume: async (id) => {
    const response = await api.get(`/resumes/${id}`);
    return response;
  },

  // Create new resume
  createResume: async (resumeData) => {
    const response = await api.post("/resumes", resumeData);
    return response;
  },

  // Update resume
  updateResume: async (id, resumeData) => {
    const response = await api.put(`/resumes/${id}`, resumeData);
    return response;
  },

  // Delete resume
  deleteResume: async (id) => {
    const response = await api.delete(`/resumes/${id}`);
    return response;
  },

  // Get resume versions
  getResumeVersions: async (id) => {
    const response = await api.get(`/resumes/${id}/versions`);
    return response;
  },

  // Duplicate resume
  duplicateResume: async (id) => {
    const response = await api.post(`/resumes/${id}/duplicate`);
    return response;
  },

  // Toggle resume status
  toggleResumeStatus: async (id) => {
    const response = await api.put(`/resumes/${id}/toggle`);
    return response;
  },
};
