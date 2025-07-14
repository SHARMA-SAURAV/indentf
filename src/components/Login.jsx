import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
  CssBaseline,
  InputAdornment,
  IconButton,
  Alert,
  LinearProgress,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      const token = res.data.token;
      localStorage.setItem("token", token);

      const userRes = await api.get("/auth/me");
      const user = userRes.data;

      const defaultRole = user.roles[0];
      localStorage.setItem("currentRole", defaultRole);
      localStorage.setItem("user", JSON.stringify(user));

      setAuthData({ token, user, currentRole: defaultRole });
      navigate("/dashboard");
    } catch (err) {
      // console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(to bottom right, #e3f2fd, #ffffff)",
      }}
    >
      <CssBaseline />

      {/* Header */}
      {/* <Box
        sx={{
          backgroundColor: "#1565c0",
          color: "white",
          py: 2,
          boxShadow: 2,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            letterSpacing: 1,
            background: "linear-gradient(to right, #fff, #bbdefb)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Indent Management System
        </Typography>
      </Box> */}

      {/* Main content */}
      <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 6, flexGrow: 1 }}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
         
            <img src="/logo.jpeg" alt="logo" style={{ width: 60, height: 60 }} />
          

          <Typography component="h1" variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Login
          </Typography>

          {loading && <LinearProgress sx={{ width: "100%", mb: 2 }} />}

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: "100%" }}>
            <TextField
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              fullWidth
              autoFocus
              margin="normal"
              sx={{ mb: 2 }}
            />
            
            <TextField
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              required
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: "#1565c0",
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                letterSpacing: 1,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#0d47a1",
                },
              }}
            >
              Sign In
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          textAlign: "center",
          py: 2,
          mt: "auto",
          backgroundColor: "#f1f1f1",
          borderTop: "1px solid #ccc",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Indent Management System. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
