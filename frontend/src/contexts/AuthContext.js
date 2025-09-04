import React, { createContext, useContext, useReducer, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_START":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case "AUTH_FAIL":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on app start
  useEffect(() => {
    let ignore = false;
    const loadUser = async () => {
      if (state.token) {
        try {
          dispatch({ type: "AUTH_START" });
          const response = await authService.getCurrentUser();
          if (!ignore) {
            dispatch({
              type: "AUTH_SUCCESS",
              payload: {
                user: response.data.user,
                token: state.token,
              },
            });
          }
        } catch (error) {
          if (!ignore) {
            // Only dispatch AUTH_FAIL if not already failed
            if (state.isAuthenticated || state.loading) {
              dispatch({
                type: "AUTH_FAIL",
                payload:
                  error.response?.data?.message || "Authentication failed",
              });
              localStorage.removeItem("token");
            }
          }
        }
      } else {
        if (!ignore && state.isAuthenticated)
          dispatch({ type: "AUTH_FAIL", payload: null });
      }
    };
    loadUser();
    return () => {
      ignore = true;
    };
  }, [state.token]);

  // Register user
  const register = async (userData) => {
    try {
      dispatch({ type: "AUTH_START" });
      const response = await authService.register(userData);
      const { user, token } = response.data;

      localStorage.setItem("token", token);
      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user, token },
      });

      return { success: true };
    } catch (error) {
      console.log("Registration error:", error.response?.data); // Debug log
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      dispatch({
        type: "AUTH_FAIL",
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      dispatch({ type: "AUTH_START" });
      const response = await authService.login(credentials);
      const { user, token } = response.data;

      localStorage.setItem("token", token);
      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user, token },
      });

      return { success: true };
    } catch (error) {
      console.log("Login error:", error.response?.data); // Debug log
      const errorMessage = error.response?.data?.message || "Login failed";
      dispatch({
        type: "AUTH_FAIL",
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await authService.updateProfile(userData);
      dispatch({
        type: "UPDATE_USER",
        payload: response.data.user,
      });
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Profile update failed";
      return { success: false, error: errorMessage };
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      await authService.changePassword(passwordData);
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Password change failed";
      return { success: false, error: errorMessage };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
