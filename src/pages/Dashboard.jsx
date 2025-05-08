import React, { useEffect, useState } from "react";
import axios from "../api/api";
import { Box, Typography, MenuItem, Select, Card, CardContent } from "@mui/material";
import UserIndentRequest from "../components/UserIndentRequest";
import FLADashboard from "../components/FLADashboard";
import SLAView from "../components/SLAView";
import StoreView from "../components/StoreView";
import FinanceView from "./FinanceView";
import PurchasePanel from "./PurchasePanel";
// import FinancePanel from "../components/FinancePanel";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [currentRole, setCurrentRole] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/auth/me");
        console.log("User data:", res.data); // Debugging line
        setUser(res.data);
        setCurrentRole(res.data.roles[0]); // default role
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, []);

  const handleRoleChange = (event) => {
    setCurrentRole(event.target.value);
  };

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ padding: 4 }}>
      <Card sx={{ marginBottom: 3 }}>
        <CardContent>
          <Typography variant="h5">Welcome, {user.username}</Typography>
          <Typography variant="body1">Email: {user.email}</Typography>

          <Box sx={{ marginTop: 2 }}>
            <Typography variant="body2">Current Role:</Typography>
            <Select value={currentRole} onChange={handleRoleChange}>
              {user.roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </CardContent>
      </Card>

      {/* Render Role-Based UI */}
      {currentRole === "USER" && <UserIndentRequest />}
      {/* {currentRole === "FLA" && <FLAApprovalView />} */}
      {currentRole === "FLA" && <FLADashboard />}

      {/* Add SLA, STORE, FINANCE, PURCHASE as you build */}
        {currentRole === "SLA" && <SLAView />}
        {currentRole === "STORE" && <StoreView />}
        {currentRole === "FINANCE" && <FinanceView />}
        {currentRole === "PURCHASE" && <PurchasePanel />}

    </Box>
  );
};

export default Dashboard;
