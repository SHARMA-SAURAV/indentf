// // Login.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api/api.js";
// import { useAuth } from "../context/AuthContext";
// import {
//   Box,
//   Container,
//   TextField,
//   Button,
//   Typography,
//   Paper,
//   Avatar,
//   CssBaseline,
//   InputAdornment,
//   IconButton,
//   Alert,
//   LinearProgress
// } from "@mui/material";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// const Login = () => {
//   const [form, setForm] = useState({ username: "", password: "" });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();
//   const { setAuthData } = useAuth();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     // Clear error when user starts typing again
//     if (error) setError("");
//   };

//   const handleTogglePassword = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
    
//     try {
//       const res = await api.post("/auth/login", form);
//       const token = res.data.token;
//       localStorage.setItem("token", token);

//       // Fetch user details and roles after login
//       const userRes = await api.get("/auth/me");
//       const user = userRes.data;

//       // Store current role in localStorage
//       const defaultRole = user.roles[0];
//       localStorage.setItem("currentRole", defaultRole);
      
//       // Store user in localStorage (as JSON string)
//       localStorage.setItem("user", JSON.stringify(user));

//       setAuthData({ token, user, currentRole: defaultRole });
//       navigate("/dashboard");
//     } catch (err) {
//       console.error("Login error:", err);
//       setError(err.response?.data?.message || "Invalid username or password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box 
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         flexDirection: "column",
//         backgroundColor: "#f5f5f5"
//       }}
//     >
//       <CssBaseline />
      
//       {/* Header */}
//       <Box 
//         sx={{ 
//           width: "100%", 
//           backgroundColor: "#1565c0", 
//           color: "white",
//           display: "flex",
//           justifyContent: "center",
//           padding: "1rem",
//           boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
//         }}
//       >
//         <Typography 
//           variant="h4" 
//           component="h1"
//           sx={{ 
//             fontWeight: 600,
//             background: 'linear-gradient(45deg, #ffffff 30%, #bbdefb 90%)',
//             WebkitBackgroundClip: 'text',
//             WebkitTextFillColor: 'transparent'
//           }}
//         >
//           Indent Management System
//         </Typography>
//       </Box>
      
//       {/* Main content */}
//       <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 8, flex: 1 }}>
//         <Paper 
//           elevation={3} 
//           sx={{
//             p: 4,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             borderRadius: 2,
//           }}
//         >
//           <Avatar sx={{ m: 1, bgcolor: "#1565c0" }}>
//             <LockOutlinedIcon />
//           </Avatar>
          
//           <Typography component="h2" variant="h5" sx={{ mb: 3 }}>
//             Sign In
//           </Typography>
          
//           {loading && <LinearProgress sx={{ width: '100%', mb: 2 }} />}
          
//           {error && (
//             <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
//               {error}
//             </Alert>
//           )}
          
//           <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="username"
//               label="Username"
//               name="username"
//               autoComplete="username"
//               autoFocus
//               value={form.username}
//               onChange={handleChange}
//               variant="outlined"
//               sx={{ mb: 2 }}
//             />
            
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               name="password"
//               label="Password"
//               type={showPassword ? "text" : "password"}
//               id="password"
//               autoComplete="current-password"
//               value={form.password}
//               onChange={handleChange}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       aria-label="toggle password visibility"
//                       onClick={handleTogglePassword}
//                       edge="end"
//                     >
//                       {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{ mb: 3 }}
//             />
            
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               disabled={loading}
//               sx={{ 
//                 py: 1.5, 
//                 borderRadius: 2,
//                 bgcolor: "#1565c0",
//                 '&:hover': {
//                   bgcolor: "#0d47a1"
//                 },
//                 transition: "background-color 0.3s"
//               }}
//             >
//               Sign In
//             </Button>
//           </Box>
//         </Paper>
//       </Container>
      
//       {/* Footer */}
//       <Box 
//         component="footer"
//         sx={{ 
//           py: 3, 
//           backgroundColor: "#f5f5f5", 
//           borderTop: "1px solid #e0e0e0",
//           mt: "auto"
//         }}

//       >
//         <Typography variant="body2" color="text.secondary" align="center">
//           © {new Date().getFullYear()} Indent Management System
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// export default Login;









import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";
import { useAuth } from "../context/AuthContext";
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
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
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
      console.error("Login error:", err);
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
      <Box
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
      </Box>

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
          <Avatar sx={{ m: 1, bgcolor: "#1976d2" }}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Welcome Back
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
