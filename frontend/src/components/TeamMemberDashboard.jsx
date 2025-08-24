import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Paper,
  useTheme,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const TeamMemberDashboard = ({ user }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks');
      const assigned = res.data.filter((task) => task.assignedTo === user.name);
      setTasks(assigned);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const assignedTasks = tasks;
  const completed = assignedTasks.filter((task) => task.status === 'Done').length;
  const inProgress = assignedTasks.filter((task) => task.status === 'In Progress').length;
  const toDo = assignedTasks.filter((task) => task.status === 'To Do').length;
  const total = assignedTasks.length;
  const completion = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: 800 }}
      >
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            sx={{
              background: 'linear-gradient(to right, #1e3a8a, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Welcome, {user.name}!
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            Your Progress: {completed} of {total} tasks completed
          </Typography>

          <LinearProgress
            variant="determinate"
            value={completion}
            sx={{
              height: 12,
              borderRadius: 6,
              mb: 4,
              backgroundColor: theme.palette.grey[300],
              '& .MuiLinearProgress-bar': {
                backgroundColor: theme.palette.primary.main,
              },
            }}
          />

          <Box
            display="grid"
            gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr 1fr' }}
            gap={3}
            mb={4}
          >
            <StatCard icon={<AssignmentIcon />} label="To Do" value={toDo} color="#1e3a8a" />
            <StatCard icon={<HourglassBottomIcon />} label="In Progress" value={inProgress} color="#f9a825" />
            <StatCard icon={<DoneAllIcon />} label="Completed" value={completed} color="green" />
          </Box>

          <Button
            variant="contained"
            color="primary"
            sx={{
              mt: 2,
              px: 5,
              py: 1.5,
              fontWeight: 'bold',
              borderRadius: 3,
              boxShadow: 3,
            }}
            onClick={() => navigate('/tasks')}
          >
            View My Tasks
          </Button>
        </Paper>
      </motion.div>
    </Box>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          textAlign: 'center',
          borderRadius: 3,
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        }}
      >
        <Box display="flex" justifyContent="center" mb={1}>
          {React.cloneElement(icon, { sx: { fontSize: 40, color } })}
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {label}
        </Typography>
        <Typography variant="h6" fontWeight="bold">
          {value}
        </Typography>
      </Paper>
    </motion.div>
  );
};

export default TeamMemberDashboard;