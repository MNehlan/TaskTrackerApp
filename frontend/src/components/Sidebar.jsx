import React from 'react';
import {Box,Typography, List,ListItemButton, ListItemText,ListItemIcon, Divider,} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TaskIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';


const Sidebar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
    },
    {
      text: 'My Tasks',
      icon: <TaskIcon />,
      path: '/tasks',
    },
  ];

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <Box
      sx={{
        width: 240,
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1200,
        background: 'linear-gradient(180deg, #1e3a8a 0%, #3b82f6 100%)',
        height: '100vh',
        p: 2,
        boxShadow: 3,
        color: 'white',
        overflowY: 'auto',
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: 'bold', letterSpacing: 1 }}
      >
        Task Tracker - Team Member
      </Typography>
      <Typography variant="body2" gutterBottom sx={{ opacity: 0.9 }}>
        Welcome, {user.name}!
      </Typography>
      <Divider sx={{ my: 1, bgcolor: 'rgba(255, 255, 255, 0.3)' }} />
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              color: 'white',
              backgroundColor:
                location.pathname === item.path
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateX(5px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}

        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 1,
            mt: 2,
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transform: 'translateX(5px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );
};

export default Sidebar;
