import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Box,
  Alert,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Save,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

const Profile = () => {
  const { user, updateProfile, changePassword, loading, error, clearError } =
    useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (profileErrors[name]) {
      setProfileErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateProfile = () => {
    const errors = {};

    if (!profileData.name.trim()) {
      errors.name = "Name is required";
    } else if (profileData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!profileData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = "Please enter a valid email address";
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = () => {
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!validateProfile()) return;

    try {
      await updateProfile(profileData);
      setIsEditing(false);
    } catch (err) {
      // Error is handled by AuthContext
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!validatePassword()) return;

    try {
      await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
    } catch (err) {
      // Error is handled by AuthContext
    }
  };

  const handleCancelEdit = () => {
    setProfileData({
      name: user?.name || "",
      email: user?.email || "",
    });
    setProfileErrors({});
    setIsEditing(false);
  };

  const handleCancelPassword = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordErrors({});
    setIsChangingPassword(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Profile Settings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar
                  sx={{ width: 64, height: 64, mr: 2, bgcolor: "primary.main" }}
                >
                  <Person sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h6">Profile Information</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Update your personal details
                  </Typography>
                </Box>
              </Box>

              <form onSubmit={handleProfileSubmit}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  error={!!profileErrors.name}
                  helperText={profileErrors.name}
                  disabled={!isEditing}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  error={!!profileErrors.email}
                  helperText={profileErrors.email}
                  disabled={!isEditing}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />

                {isEditing ? (
                  <Box display="flex" gap={1}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<Save />}
                      disabled={loading}
                    >
                      {loading ? (
                        <CircularProgress size={20} />
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleCancelEdit}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </Box>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => setIsEditing(true)}
                    startIcon={<Person />}
                  >
                    Edit Profile
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Password Change */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    mr: 2,
                    bgcolor: "secondary.main",
                  }}
                >
                  <Lock sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h6">Change Password</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Update your password securely
                  </Typography>
                </Box>
              </Box>

              {isChangingPassword ? (
                <form onSubmit={handlePasswordSubmit}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    name="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    error={!!passwordErrors.currentPassword}
                    helperText={passwordErrors.currentPassword}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => togglePasswordVisibility("current")}
                            edge="end"
                          >
                            {showPasswords.current ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="New Password"
                    name="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    error={!!passwordErrors.newPassword}
                    helperText={passwordErrors.newPassword}
                    sx={{ mb: 2 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => togglePasswordVisibility("new")}
                            edge="end"
                          >
                            {showPasswords.new ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    name="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    error={!!passwordErrors.confirmPassword}
                    helperText={passwordErrors.confirmPassword}
                    sx={{ mb: 3 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => togglePasswordVisibility("confirm")}
                            edge="end"
                          >
                            {showPasswords.confirm ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Box display="flex" gap={1}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<Save />}
                      disabled={loading}
                    >
                      {loading ? (
                        <CircularProgress size={20} />
                      ) : (
                        "Change Password"
                      )}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleCancelPassword}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </Box>
                </form>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => setIsChangingPassword(true)}
                  startIcon={<Lock />}
                >
                  Change Password
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Account Information */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Account Information
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Member Since
              </Typography>
              <Typography variant="body1">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Last Login
              </Typography>
              <Typography variant="body1">
                {user?.lastLogin
                  ? new Date(user.lastLogin).toLocaleString()
                  : "N/A"}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Account Status
              </Typography>
              <Typography
                variant="body1"
                color={user?.isActive ? "success.main" : "error.main"}
              >
                {user?.isActive ? "Active" : "Inactive"}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                User ID
              </Typography>
              <Typography variant="body1" fontFamily="monospace">
                {user?._id || "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Profile;
