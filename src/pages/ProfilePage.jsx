// import React, { useEffect, useState } from "react";
// import axios from "../api/api";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Paper,
//   Divider,
//   CircularProgress,
// } from "@mui/material";
// // import axios from 'axios';

// const ProfilePage = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true); // for spinner
//   const [passwordData, setPasswordData] = useState({
//     oldPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
//   const [resetLoading, setResetLoading] = useState(false);

//   const handleChange = (e) => {
//     setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
//   };

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await axios.get("/auth/profile");
//         setUser(response.data);
//         console.log("response data :-----------", response.data);
//       } catch (err) {
//         console.error("Failed to fetch user", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, []);

//   if (loading) {
//     return (
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         height="60vh"
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (!user) {
//     return (
//       <Box p={3} maxWidth={600} mx="auto">
//         <Typography color="error">Failed to load user profile.</Typography>
//       </Box>
//     );
//   }

// const handlePasswordReset = async () => {
//   if (passwordData.newPassword !== passwordData.confirmPassword) {
//     alert('New password and confirm password do not match.');
//     return;
//   }

//   setResetLoading(true);
//   try {
//     const res = await axios.post('/auth/reset-password', {
//       username: user.username, // Corrected here
//       oldPassword: passwordData.oldPassword,
//       newPassword: passwordData.newPassword
//     });

//     alert(res.data.message || 'Password updated successfully!');
//     setPasswordData({
//       oldPassword: '',
//       newPassword: '',
//       confirmPassword: ''
//     });
//   } catch (err) {
//     console.error(err);
//     alert(err.response?.data?.message || 'Failed to reset password.');
//   } finally {
//     setResetLoading(false);
//   }
// };

//   return (
//     <Box p={3} maxWidth={600} mx="auto">
//       <Paper elevation={3} sx={{ p: 3 }}>
//         <Typography variant="h5" fontWeight={600} gutterBottom>
//           Profile Details
//         </Typography>
//         <Typography>
//           <strong>Name:</strong> {user.name}
//         </Typography>
//         <Typography>
//           <strong>Username:</strong> {user.username}
//         </Typography>
//         <Typography>
//           <strong>Email:</strong> {user.email}
//         </Typography>
//         <Typography>
//           <strong>Department:</strong> {user.department}
//         </Typography>
//         <Typography>
//           <strong>Designation:</strong> {user.designation}
//         </Typography>
//         <Typography>
//           <strong>Phone:</strong> {user.phone}
//         </Typography>
//         <Typography>
//           <strong>Employee ID:</strong> {user.employeeId}
//         </Typography>
//         <Typography>
//           <strong>Sex:</strong> {user.sex}
//         </Typography>

//         <Divider sx={{ my: 3 }} />

//         <Typography variant="h6" fontWeight={500} gutterBottom>
//           Reset Password
//         </Typography>

//         <TextField
//           fullWidth
//           margin="normal"
//           type="password"
//           label="Old Password"
//           name="oldPassword"
//           value={passwordData.oldPassword}
//           onChange={handleChange}
//         />
//         <TextField
//           fullWidth
//           margin="normal"
//           type="password"
//           label="New Password"
//           name="newPassword"
//           value={passwordData.newPassword}
//           onChange={handleChange}
//         />
//         <TextField
//           fullWidth
//           margin="normal"
//           type="password"
//           label="Confirm New Password"
//           name="confirmPassword"
//           value={passwordData.confirmPassword}
//           onChange={handleChange}
//         />

//         <Button
//           variant="contained"
//           sx={{ mt: 2, bgcolor: "#1565c0" }}
//           onClick={handlePasswordReset}
//           disabled={resetLoading}
//         >
//           {resetLoading ? (
//             <CircularProgress size={24} sx={{ color: "white" }} />
//           ) : (
//             "Reset Password"
//           )}
//         </Button>
//       </Paper>
//     </Box>
//   );
// };

// export default ProfilePage;













import React, { useEffect, useState } from 'react';
import axios from "../api/api";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  CircularProgress,
  Grid,
  Avatar,
  Snackbar,
  Alert
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resetLoading, setResetLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/auth/profile");
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handlePasswordReset = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSnackbar({ open: true, message: 'New password and confirm password do not match.', severity: 'error' });
      return;
    }

    setResetLoading(true);
    try {
      const res = await axios.post('/auth/reset-password', {
        username: user.username,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });

      setSnackbar({ open: true, message: res.data.message || 'Password updated successfully!', severity: 'success' });
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to reset password.',
        severity: 'error'
      });
    } finally {
      setResetLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box p={3} maxWidth={600} mx="auto">
        <Typography color="error">Failed to load user profile.</Typography>
      </Box>
    );
  }

  return (
    <Box p={3} maxWidth={800} mx="auto">
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Grid container spacing={4}>
          {/* Profile Section */}
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56, mr: 2 }}>
                <PersonIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={600}>
                  {user.fullName}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {user.designation} • {user.department}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography><strong>Username:</strong> {user.username}</Typography>
            <Typography><strong>Email:</strong> {user.email}</Typography>
            <Typography><strong>Phone:</strong> {user.phone}</Typography>
            <Typography><strong>Employee ID:</strong> {user.employeeId}</Typography>
            <Typography><strong>Sex:</strong> {user.sex}</Typography>
            <Typography><strong>Roles:</strong> {user.roles.join(', ')}</Typography>
          </Grid>

          {/* Password Reset Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Reset Password
            </Typography>

            <TextField
              fullWidth
              margin="normal"
              type="password"
              label="Old Password"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              type="password"
              label="New Password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              type="password"
              label="Confirm New Password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handleChange}
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handlePasswordReset}
              disabled={resetLoading}
            >
              {resetLoading ? <CircularProgress size={24} /> : 'Reset Password'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePage;
