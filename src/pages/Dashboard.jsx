// import React, { useEffect, useState } from "react";
// import axios from "../api/api";
// import { Box, Typography, MenuItem, Select, Card, CardContent } from "@mui/material";
// import UserIndentRequest from "../components/UserIndentRequest";
// import FLADashboard from "../components/FLADashboard";
// import SLAView from "../components/SLAView";
// import StoreView from "../components/StoreView";
// import FinanceView from "./FinanceView";
// import PurchasePanel from "./PurchasePanel";
// // import FinancePanel from "../components/FinancePanel";

// const Dashboard = () => {
//   const [user, setUser] = useState(null);
//   const [currentRole, setCurrentRole] = useState("");

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get("/auth/me");
//         console.log("User data:", res.data); // Debugging line
//         setUser(res.data);
//         setCurrentRole(res.data.roles[0]); // default role
//       } catch (err) {
//         console.error("Failed to fetch user", err);
//       }
//     };
//     fetchUser();
//   }, []);

//   const handleRoleChange = (event) => {
//     setCurrentRole(event.target.value);
//   };

//   if (!user) return <Typography>Loading...</Typography>;

//   return (
//     <Box sx={{ padding: 4 }}>
//       <Card sx={{ marginBottom: 3 }}>
//         <CardContent>
//           <Typography variant="h5">Welcome, {user.username}</Typography>
//           <Typography variant="body1">Email: {user.email}</Typography>

//           <Box sx={{ marginTop: 2 }}>
//             <Typography variant="body2">Current Role:</Typography>
//             <Select value={currentRole} onChange={handleRoleChange}>
//               {user.roles.map((role) => (
//                 <MenuItem key={role} value={role}>
//                   {role}
//                 </MenuItem>
//               ))}
//             </Select>
//           </Box>
//         </CardContent>
//       </Card>

//       {/* Render Role-Based UI */}
//       {currentRole === "USER" && <UserIndentRequest />}
//       {/* {currentRole === "FLA" && <FLAApprovalView />} */}
//       {currentRole === "FLA" && <FLADashboard />}

//       {/* Add SLA, STORE, FINANCE, PURCHASE as you build */}
//         {currentRole === "SLA" && <SLAView />}
//         {currentRole === "STORE" && <StoreView />}
//         {currentRole === "FINANCE" && <FinanceView />}
//         {currentRole === "PURCHASE" && <PurchasePanel />}

//     </Box>
//   );
// };

// export default Dashboard;













// import React, { useEffect, useState } from "react";
// import axios from "../api/api";
// import { 
//   Box, 
//   Typography, 
//   MenuItem, 
//   Select, 
//   Card, 
//   CardContent, 
//   Grid, 
//   FormControl,
//   InputLabel,
//   Container,
//   Paper,
//   Avatar,
//   Chip,
//   Divider,
//   useTheme,
//   useMediaQuery
// } from "@mui/material";
// import UserIndentRequest from "../components/UserIndentRequest";
// import FLADashboard from "../components/FLADashboard";
// import SLAView from "../components/SLAView";
// import StoreView from "../components/StoreView";
// import FinanceView from "./FinanceView";
// import PurchasePanel from "./PurchasePanel";
// import PersonIcon from "@mui/icons-material/Person";
// import EmailIcon from "@mui/icons-material/Email";
// import WorkIcon from "@mui/icons-material/Work";

// const Dashboard = () => {
//   const [user, setUser] = useState(null);
//   const [currentRole, setCurrentRole] = useState("");
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get("/auth/me");
//         console.log("User data:", res.data); // Debugging line
//         setUser(res.data);
        
//         // Set current role from localStorage or default to first role
//         const savedRole = localStorage.getItem('currentRole');
//         if (savedRole && res.data.roles.includes(savedRole)) {
//           setCurrentRole(savedRole);
//         } else {
//           setCurrentRole(res.data.roles[0]); // default role
//         }
//       } catch (err) {
//         console.error("Failed to fetch user", err);
//       }
//     };
//     fetchUser();
//   }, []);

//   const handleRoleChange = (event) => {
//     const newRole = event.target.value;
//     setCurrentRole(newRole);
//     localStorage.setItem('currentRole', newRole);
//   };

//   if (!user) {
//     return (
//       <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
//         <Typography variant="h6">Loading your dashboard...</Typography>
//       </Container>
//     );
//   }

//   const getBackgroundColor = (role) => {
//     const colors = {
//       USER: 'rgba(25, 118, 210, 0.08)',
//       FLA: 'rgba(46, 125, 50, 0.08)',
//       SLA: 'rgba(237, 108, 2, 0.08)',
//       STORE: 'rgba(156, 39, 176, 0.08)',
//       FINANCE: 'rgba(211, 47, 47, 0.08)',
//       PURCHASE: 'rgba(2, 136, 209, 0.08)',
//     };
//     return colors[role] || 'rgba(25, 118, 210, 0.08)';
//   };
  
//   const getRoleColor = (role) => {
//     const colors = {
//       USER: '#1976d2',
//       FLA: '#2e7d32',
//       SLA: '#ed6c02',
//       STORE: '#9c27b0',
//       FINANCE: '#d32f2f',
//       PURCHASE: '#0288d1',
//     };
//     return colors[role] || '#1976d2';
//   };

//   // Get component for current role
//   const getRoleComponent = () => {
//     switch (currentRole) {
//       case "USER": return <UserIndentRequest />;
//       case "FLA": return <FLADashboard />;
//       case "SLA": return <SLAView />;
//       case "STORE": return <StoreView />;
//       case "FINANCE": return <FinanceView />;
//       case "PURCHASE": return <PurchasePanel />;
//       default: return <Typography>No component for this role</Typography>;
//     }
//   };

//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       <Grid container spacing={3}>
//         {/* User Profile Card */}
//         <Grid item xs={12}>
//           <Paper 
//             elevation={0} 
//             sx={{ 
//               p: 3, 
//               borderRadius: 2, 
//               background: `linear-gradient(135deg, ${getBackgroundColor(currentRole)} 0%, rgba(255,255,255,0.9) 100%)`,
//               border: `1px solid rgba(0,0,0,0.08)`,
//               mb: 2
//             }}
//           >
//             <Grid container spacing={2} alignItems="center">
//               <Grid item xs={12} sm={6} md={8}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
//                   <Avatar 
//                     sx={{ 
//                       width: 60, 
//                       height: 60, 
//                       bgcolor: getRoleColor(currentRole),
//                       mr: 2
//                     }}
//                   >
//                     {user.username?.charAt(0).toUpperCase() || "U"}
//                   </Avatar>
//                   <Box>
//                     <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 0.5 }}>
//                       Welcome, {user.username}
//                     </Typography>
//                     <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                       <EmailIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
//                       <Typography variant="body2" color="text.secondary">
//                         {user.email}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </Box>
//               </Grid>
              
//               <Grid item xs={12} sm={6} md={4}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'flex-start' : 'flex-end' }}>
//                   <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                     <WorkIcon fontSize="small" sx={{ color: getRoleColor(currentRole), mr: 1 }} />
//                     <Typography variant="body2" sx={{ mr: 1 }}>Active Role:</Typography>
//                     <Chip 
//                       label={currentRole} 
//                       size="small" 
//                       sx={{ 
//                         fontWeight: 'medium',
//                         backgroundColor: getRoleColor(currentRole),
//                         color: 'white'
//                       }} 
//                     />
//                   </Box>
                  
//                   <FormControl 
//                     size="small" 
//                     sx={{ 
//                       minWidth: 200, 
//                       mt: 1,
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: 2
//                       }
//                     }}
//                   >
//                     <InputLabel id="role-select-label">Switch Role</InputLabel>
//                     <Select
//                       labelId="role-select-label"
//                       id="role-select"
//                       value={currentRole}
//                       label="Switch Role"
//                       onChange={handleRoleChange}
//                     >
//                       {user.roles.map((role) => (
//                         <MenuItem key={role} value={role}>
//                           {role}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Box>
//               </Grid>
//             </Grid>
//           </Paper>
//         </Grid>
        
//         {/* Role Component */}
//         <Grid item xs={12}>
//           <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
//             <Box sx={{ p: 2, bgcolor: getRoleColor(currentRole), color: 'white' }}>
//               <Typography variant="h6">{currentRole} Dashboard</Typography>
//             </Box>
//             <Divider />
//             <Box sx={{ p: 3 }}>
//               {getRoleComponent()}
//             </Box>
//           </Paper>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };

// export default Dashboard;























import React, { useEffect, useState } from "react";
import axios from "../api/api";
import { 
  Box, 
  Typography, 
  MenuItem, 
  Select, 
  Card, 
  CardContent, 
  Grid, 
  FormControl,
  InputLabel,
  Container,
  Paper,
  Avatar,
  Chip,
  Divider,
  useTheme,
  useMediaQuery
} from "@mui/material";
import UserIndentRequest from "../components/UserIndentRequest";
import FLADashboard from "../components/FLADashboard";
import SLAView from "../components/SLAView";
import StoreView from "../components/StoreView";
import FinanceView from "./FinanceView";
import PurchasePanel from "./PurchasePanel";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import WorkIcon from "@mui/icons-material/Work";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [currentRole, setCurrentRole] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/auth/me");
        console.log("User data:", res.data); // Debugging line
        setUser(res.data);
        
        // Set current role from localStorage or default to first role
        const savedRole = localStorage.getItem('currentRole');
        if (savedRole && res.data.roles.includes(savedRole)) {
          setCurrentRole(savedRole);
        } else {
          setCurrentRole(res.data.roles[0]); // default role
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, []);

  const handleRoleChange = (event) => {
    const newRole = event.target.value;
    setCurrentRole(newRole);
    localStorage.setItem('currentRole', newRole);
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography variant="h6">Loading your dashboard...</Typography>
      </Container>
    );
  }

  const getBackgroundColor = (role) => {
    const colors = {
      USER: 'rgba(25, 118, 210, 0.08)',
      FLA: 'rgba(46, 125, 50, 0.08)',
      SLA: 'rgba(237, 108, 2, 0.08)',
      STORE: 'rgba(156, 39, 176, 0.08)',
      FINANCE: 'rgba(211, 47, 47, 0.08)',
      PURCHASE: 'rgba(2, 136, 209, 0.08)',
    };
    return colors[role] || 'rgba(25, 118, 210, 0.08)';
  };
  
  const getRoleColor = (role) => {
    const colors = {
      USER: '#1976d2',
      FLA: '#2e7d32',
      SLA: '#ed6c02',
      STORE: '#9c27b0',
      FINANCE: '#d32f2f',
      PURCHASE: '#0288d1',
    };
    return colors[role] || '#1976d2';
  };

  // Get component for current role
  const getRoleComponent = () => {
    switch (currentRole) {
      case "USER": return <UserIndentRequest />;
      case "FLA": return <FLADashboard />;
      case "SLA": return <SLAView />;
      case "STORE": return <StoreView />;
      case "FINANCE": return <FinanceView />;
      case "PURCHASE": return <PurchasePanel />;
      default: return <Typography>No component for this role</Typography>;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', width: '100%' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* User Profile Card */}
        <Grid item xs={12}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 2, 
              background: `linear-gradient(135deg, ${getBackgroundColor(currentRole)} 0%, rgba(255,255,255,0.9) 100%)`,
              border: `1px solid rgba(0,0,0,0.08)`,
              mb: 2
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={8}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                  <Avatar 
                    sx={{ 
                      width: 60, 
                      height: 60, 
                      bgcolor: getRoleColor(currentRole),
                      mr: 2
                    }}
                  >
                    {user.username?.charAt(0).toUpperCase() || "U"}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 0.5 }}>
                      Welcome, {user.username}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EmailIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'flex-start' : 'flex-end' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <WorkIcon fontSize="small" sx={{ color: getRoleColor(currentRole), mr: 1 }} />
                    <Typography variant="body2" sx={{ mr: 1 }}>Active Role:</Typography>
                    <Chip 
                      label={currentRole} 
                      size="small" 
                      sx={{ 
                        fontWeight: 'medium',
                        backgroundColor: getRoleColor(currentRole),
                        color: 'white'
                      }} 
                    />
                  </Box>
                  
                  <FormControl 
                    size="small" 
                    sx={{ 
                      minWidth: 200, 
                      mt: 1,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  >
                    <InputLabel id="role-select-label">Switch Role</InputLabel>
                    <Select
                      labelId="role-select-label"
                      id="role-select"
                      value={currentRole}
                      label="Switch Role"
                      onChange={handleRoleChange}
                    >
                      {user.roles.map((role) => (
                        <MenuItem key={role} value={role}>
                          {role}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Role Component */}
        <Grid item xs={12}>
          <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: getRoleColor(currentRole), color: 'white' }}>
              <Typography variant="h6">{currentRole} Dashboard</Typography>
            </Box>
            <Divider />
            <Box sx={{ p: 3 }}>
              {getRoleComponent()}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
    </Box>
  );
};

export default Dashboard;