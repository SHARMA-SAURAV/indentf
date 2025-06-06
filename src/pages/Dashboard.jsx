import React, { useEffect, useState, useCallback } from "react";
import axios from "../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import {
  Avatar,
  Box,
  Chip,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { Email as EmailIcon } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import UserIndentRequest from "../components/UserIndentRequest";
import FLADashboard from "../components/FLADashboard";
import SLAView from "../components/SLAView";
import StoreView from "../components/StoreView";
import FinanceView from "./FinanceView";
import PurchasePanel from "./PurchasePanel";
import AdminDashboard from "./AdminDashboard";
import { redirect } from "react-router-dom";
// Updated Constants - professional, muted colors
const GRADIENT_BG = "linear-gradient(145deg, #f8f9fa, #e9ecef)";
const CARD_BG = "#ffffff";
const TEXT_COLOR = "#212529"; // dark slate gray
const ACCENT_COLOR = "#0d47a1"; // deep navy blue for professionalism
const BORDER_COLOR = "#dee2e6";

// Animations
const fadeSlideVariant = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.3, ease: "easeIn" } },
};

// Role-to-Component Mapping remains unchanged
const RoleContent = ({ role }) => {
  switch (role) {
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
    case "ADMIN":
      return <AdminDashboard />
    default:
      return (
        <Typography align="center" sx={{ p: 3, fontStyle: "italic", color: TEXT_COLOR }}>
          No dashboard found for this role.
        </Typography>
      );
  }
};

// Header Section
const Header = ({ user, currentRole, onRoleChange }) => {
  return (
    <Paper
      elevation={4}
      sx={{
        px: { xs: 2, md: 6 },
        py: { xs: 3, md: 4 },
        borderRadius: 4,
        width: '100%',
        maxWidth: '100%',
        mx: 'auto',
        background: `linear-gradient(90deg, #f8fafc 60%, #e3eafc 100%)`,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: 4,
        border: `1.5px solid ${BORDER_COLOR}`,
        boxShadow: '0 6px 32px 0 rgba(13,71,161,0.08)',
        position: 'relative',
      }}
    >
      {/* Left Section: Avatar + Info */}
      <Stack direction="row" spacing={3} alignItems="center">
        <Avatar
          sx={{
            bgcolor: ACCENT_COLOR,
            width: 72,
            height: 72,
            fontSize: 36,
            boxShadow: `0 6px 24px ${ACCENT_COLOR}22`,
            border: `3px solid #fff`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="user-avatar"
        >
          <FontAwesomeIcon icon={faUser} color="white" />
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={700} color={TEXT_COLOR} sx={{ letterSpacing: 0.5 }}>
            Welcome, {user?.username}
          </Typography>
          <Stack direction="row" spacing={1.2} alignItems="center" mt={0.5}>
            <EmailIcon fontSize="small" sx={{ color: ACCENT_COLOR }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {user?.email}
            </Typography>
          </Stack>
        </Box>
      </Stack>

      {/* Right Section: Role Chip + Select */}
      <Box sx={{ minWidth: 260, textAlign: { xs: 'left', md: 'right' } }}>
        <Box display="flex" alignItems="center" mb={1} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
          <Typography variant="body2" fontWeight={700} mr={1} color="text.primary" sx={{ letterSpacing: 0.5 }}>
            Current Role:
          </Typography>
          <Chip
            label={currentRole}
            sx={{
              bgcolor: ACCENT_COLOR,
              color: 'white',
              fontWeight: 700,
              px: 2,
              py: 0.5,
              fontSize: '1rem',
              boxShadow: '0 2px 8px rgb(13 71 161 / 0.18)',
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}
          />
        </Box>
        <FormControl
          fullWidth
          size="small"
          sx={{
            maxWidth: 320,
            m: 0,
            '& .MuiInputLabel-root': {
              color: TEXT_COLOR,
              fontWeight: 700,
            },
            '& .MuiOutlinedInput-root': {
              color: TEXT_COLOR,
              fontWeight: 600,
              borderRadius: 3,
              background: '#f6f8fa',
              '& fieldset': {
                borderColor: BORDER_COLOR,
              },
              '&:hover fieldset': {
                borderColor: ACCENT_COLOR,
              },
              '&.Mui-focused fieldset': {
                borderColor: ACCENT_COLOR,
                borderWidth: 2,
              },
            },
            '& .MuiSelect-icon': {
              color: ACCENT_COLOR,
            },
          }}
        >
          <InputLabel id="role-switch-label">Switch Role</InputLabel>
          <Select
            labelId="role-switch-label"
            value={currentRole}
            onChange={onRoleChange}
            label="Switch Role"
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgb(13 71 161 / 0.13)',
                },
              },
            }}
            sx={{
              fontWeight: 700,
              color: TEXT_COLOR,
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: ACCENT_COLOR,
              },
            }}
          >
            {user?.roles?.map((role) => (
              <MenuItem key={role} value={role} sx={{ fontWeight: 700 }}>
                {role}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
};

// Dashboard Component
const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [currentRole, setCurrentRole] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/auth/me");
        const savedRole = localStorage.getItem("currentRole");
        const defaultRole = res.data.roles?.[0] || "";
        const validRole = res.data.roles.includes(savedRole) ? savedRole : defaultRole;

        setUser(res.data);
        setCurrentRole(validRole);
      } catch (err) {
        redirect("/");
        // console.error("Error fetching user:", err);
      }
    })();
  }, []);

  const handleRoleChange = useCallback((e) => {
    const newRole = e.target.value;
    setCurrentRole(newRole);
    localStorage.setItem("currentRole", newRole);
  }, []);

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ pt: 12, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          style={{ marginBottom: 28 }}
        >
          <CircularProgress size={70} thickness={5} sx={{ color: ACCENT_COLOR }} />
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          <Typography
            variant="h6"
            align="center"
            sx={{
              textShadow: `0 0 12px ${ACCENT_COLOR}33`,
              fontWeight: 600,
              color: TEXT_COLOR,
            }}
          >
            Loading your dashboard...
          </Typography>
        </motion.div>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", minWidth: "100vw", width: "100vw", height: "100vh", background: GRADIENT_BG, py: 0, px: 0, m: 0 }}>
      <Box sx={{ width: "100vw", height: "100vh", p: 0, m: 0 }}>
        <Header user={user} currentRole={currentRole} onRoleChange={handleRoleChange} />
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRole}
            variants={fadeSlideVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ width: "100vw", minHeight: "calc(100vh - 180px)" }}
          >
            <Paper
              elevation={3}
              sx={{
                mt: 5,
                mx: 0,
                p: 0,
                width: "100vw",
                minHeight: "calc(100vh - 180px)",
                borderRadius: 0,
                background: CARD_BG,
                boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                justifyContent: 'stretch',
              }}
            >
              <RoleContent role={currentRole} />
            </Paper>
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default Dashboard;
