import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem, IconButton, Divider } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const currentRole = localStorage.getItem('currentRole');
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Get initials for the avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={1}
      sx={{ 
        backgroundColor: '#fff',
        color: '#333',
        borderBottom: '1px solid #e0e0e0',
        width: '100%',
        zIndex: 1100
      }}
    >
      <Toolbar>
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 600,
            background: 'linear-gradient(45deg, #1565c0 30%, #42a5f5 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Indent Management System
        </Typography>

        {/* If logged in, show user info and logout */}
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button 
              component={Link} 
              to="/dashboard" 
              startIcon={<DashboardIcon />}
              sx={{ 
                color: '#1565c0',
                '&:hover': {
                  backgroundColor: 'rgba(21, 101, 192, 0.08)'
                }
              }}
            >
              Dashboard
            </Button>
            
            <Button
              id="profile-button"
              aria-controls={open ? 'profile-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              endIcon={<KeyboardArrowDownIcon />}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                color: '#333',
                border: '1px solid #e0e0e0',
                '&:hover': {
                  backgroundColor: '#f5f5f5'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: '#1565c0',
                    fontSize: '0.875rem'
                  }}
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
            
            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'profile-button',
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
                }
              }}
            >
              <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
                <AccountCircleIcon fontSize="small" sx={{ mr: 1 }} /> Profile
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => { handleClose(); handleLogout(); }}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          // If not logged in, just show login button
          <Button 
            component={Link} 
            to="/" 
            variant="contained"
            sx={{ 
              borderRadius: 2,
              bgcolor: '#1565c0',
              '&:hover': {
                bgcolor: '#0d47a1'
              }
            }}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;