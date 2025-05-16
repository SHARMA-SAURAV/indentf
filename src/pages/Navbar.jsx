import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const user = JSON.parse(localStorage.getItem('user'));
  const currentRole = localStorage.getItem('currentRole');

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState(null);
  const open = Boolean(anchorEl);
  const mobileMenuOpen = Boolean(mobileMenuAnchor);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    handleProfileMenuClose();
    handleMobileMenuClose();
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Render common user menu items (Profile and Logout)
  const userMenuItems = (
    <>
      <MenuItem
        onClick={() => {
          handleProfileMenuClose();
          handleMobileMenuClose();
          navigate('/profile');
        }}
        aria-label="Go to Profile"
      >
        <AccountCircleIcon fontSize="small" sx={{ mr: 1 }} />
        Profile
      </MenuItem>
      <Divider />
      <MenuItem
        onClick={handleLogout}
        aria-label="Logout"
      >
        <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
        Logout
      </MenuItem>
    </>
  );

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        backgroundColor: '#fff',
        color: '#333',
        borderBottom: '1px solid #e0e0e0',
        width: '100%',
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Typography
          variant="h5"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            cursor: 'pointer',
            textDecoration: 'none',
            background: 'linear-gradient(45deg, #1565c0 30%, #42a5f5 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            userSelect: 'none',
          }}
          aria-label="Go to home"
        >
          Indent Management System
        </Typography>

        {user ? (
          <>
            {/* Desktop Menu */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  component={RouterLink}
                  to="/dashboard"
                  startIcon={<DashboardIcon />}
                  sx={{
                    color: '#1565c0',
                    textTransform: 'none',
                    fontWeight: 600,
                    transition: 'background-color 0.3s',
                    '&:hover': {
                      backgroundColor: 'rgba(21, 101, 192, 0.12)',
                    },
                    '&:focus-visible': {
                      outline: `2px solid ${theme.palette.primary.main}`,
                      outlineOffset: 2,
                    },
                  }}
                  aria-label="Go to Dashboard"
                >
                  Dashboard
                </Button>

                <Tooltip title={`${user.name} — ${currentRole}`}>
                  <Button
                    id="profile-button"
                    aria-controls={open ? 'profile-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleProfileMenuOpen}
                    endIcon={<KeyboardArrowDownIcon />}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      color: '#333',
                      border: '1px solid #e0e0e0',
                      px: 1.5,
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                      '&:focus-visible': {
                        outline: `2px solid ${theme.palette.primary.main}`,
                        outlineOffset: 2,
                      },
                    }}
                    aria-label="User profile menu"
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: '#1565c0',
                          fontSize: '0.875rem',
                          userSelect: 'none',
                        }}
                        aria-hidden="true"
                      >
                        {getInitials(user.name)}
                      </Avatar>
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {user.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          {currentRole}
                        </Typography>
                      </Box>
                    </Box>
                  </Button>
                </Tooltip>

                <Menu
                  id="profile-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleProfileMenuClose}
                  MenuListProps={{
                    'aria-labelledby': 'profile-button',
                    role: 'menu',
                  }}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  PaperProps={{
                    elevation: 2,
                    sx: {
                      minWidth: 180,
                      borderRadius: 2,
                      mt: 1,
                    },
                  }}
                >
                  {userMenuItems}
                </Menu>
              </Box>
            )}

            {/* Mobile Menu */}
            {isMobile && (
              <>
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="open menu"
                  aria-controls={mobileMenuOpen ? 'mobile-menu' : undefined}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  size="large"
                >
                  <MenuIcon />
                </IconButton>

                <Menu
                  id="mobile-menu"
                  anchorEl={mobileMenuAnchor}
                  open={mobileMenuOpen}
                  onClose={handleMobileMenuClose}
                  PaperProps={{
                    elevation: 2,
                    sx: { minWidth: 200, borderRadius: 2 },
                  }}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem
                    component={RouterLink}
                    to="/dashboard"
                    onClick={handleMobileMenuClose}
                    aria-label="Go to Dashboard"
                  >
                    <DashboardIcon sx={{ mr: 1 }} /> Dashboard
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      handleMobileMenuClose();
                      navigate('/profile');
                    }}
                    aria-label="Go to Profile"
                  >
                    <AccountCircleIcon sx={{ mr: 1 }} /> Profile
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} aria-label="Logout">
                    <LogoutIcon sx={{ mr: 1 }} /> Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </>
        ) : (
          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            sx={{
              borderRadius: 2,
              bgcolor: '#1565c0',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1,
              transition: 'background-color 0.3s',
              '&:hover': {
                bgcolor: '#0d47a1',
              },
              '&:focus-visible': {
                outline: `2px solid ${theme.palette.primary.main}`,
                outlineOffset: 2,
              },
            }}
            aria-label="Login"
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
