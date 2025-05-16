import React, { useEffect, useState } from "react";
import axios from "../api/api";
import {
  Box,
  Typography,
  Grid,
  Container,
  Paper,
  Avatar,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Tooltip
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import WorkIcon from "@mui/icons-material/Work";

import UserIndentRequest from "../components/UserIndentRequest";
import FLADashboard from "../components/FLADashboard";
import SLAView from "../components/SLAView";
import StoreView from "../components/StoreView";
import FinanceView from "./FinanceView";
import PurchasePanel from "./PurchasePanel";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [currentRole, setCurrentRole] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const roleColors = {
    USER: "#1A73E8",
    FLA: "#2E7D32",
    SLA: "#F57C00",
    STORE: "#6A1B9A",
    FINANCE: "#B71C1C",
    PURCHASE: "#0277BD"
  };

  const roleBackgrounds = {
    USER: "rgba(26, 115, 232, 0.1)",
    FLA: "rgba(46, 125, 50, 0.1)",
    SLA: "rgba(245, 124, 0, 0.1)",
    STORE: "rgba(106, 27, 154, 0.1)",
    FINANCE: "rgba(183, 28, 28, 0.1)",
    PURCHASE: "rgba(2, 119, 189, 0.1)"
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/auth/me");
        const userData = res.data;
        setUser(userData);

        const savedRole = localStorage.getItem("currentRole");
        setCurrentRole(savedRole && userData.roles.includes(savedRole) ? savedRole : userData.roles[0]);
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };

    fetchUser();
  }, []);

  const handleRoleChange = (event) => {
    const selectedRole = event.target.value;
    setCurrentRole(selectedRole);
    localStorage.setItem("currentRole", selectedRole);
  };

  if (!user) {
    return (
      <Container
        sx={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
        aria-busy="true"
        aria-live="polite"
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading your dashboard...
        </Typography>
      </Container>
    );
  }

  const renderRoleComponent = () => {
    switch (currentRole) {
      case "USER":
        return <UserIndentRequest />;
      case "FLA":
        return <FLADashboard />;
      case "SLA":
        return <SLAView />;
      case "STORE":
        return <StoreView />;
      case "FINANCE":
        return <FinanceView />;
      case "PURCHASE":
        return <PurchasePanel />;
      default:
        return <Typography>No component available for this role.</Typography>;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          p: 4,
          bgcolor: "background.paper",
          border: "1px solid rgba(0,0,0,0.1)"
        }}
      >
        {/* Role Selection */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            gap: 2,
            mb: 4,
            bgcolor: roleBackgrounds[currentRole],
            p: 2,
            borderRadius: 2
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <WorkIcon sx={{ fontSize: 22, color: roleColors[currentRole], mr: 1 }} />
            <Typography variant="subtitle1" sx={{ mr: 1, fontWeight: 500 }}>
              Active Role:
            </Typography>
            <Chip
              label={currentRole}
              variant="outlined"
              sx={{
                borderColor: roleColors[currentRole],
                color: roleColors[currentRole],
                fontWeight: 600,
                fontSize: "0.9rem"
              }}
              size="medium"
              aria-label={`Current role is ${currentRole}`}
            />
          </Box>

          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel id="role-switch-label">Switch Role</InputLabel>
            <Tooltip title="Switch to a different role to view relevant dashboard">
              <Select
                labelId="role-switch-label"
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
            </Tooltip>
          </FormControl>
        </Box>

        {/* Profile Section */}
        <Grid container spacing={4} alignItems="center" sx={{ mb: 5 }}>
          <Grid item xs={12} sm={8}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Avatar sx={{ bgcolor: "grey.400", width: 70, height: 70, fontSize: 28 }}>
                {user.username?.charAt(0).toUpperCase() || <PersonIcon />}
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={600} sx={{ letterSpacing: 0.5 }}>
                  Welcome, {user.username}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <EmailIcon sx={{ fontSize: 20, color: "text.secondary", mr: 1 }} />
                  <Typography variant="body1" color="text.secondary" sx={{ wordBreak: "break-all" }}>
                    {user.email}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Role-Specific View */}
        <Box sx={{ bgcolor: roleColors[currentRole], color: "white", p: 2, borderRadius: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            {currentRole} Dashboard
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ minHeight: "400px" }}>{renderRoleComponent()}</Box>
      </Paper>
    </Container>
  );
};

export default Dashboard;
