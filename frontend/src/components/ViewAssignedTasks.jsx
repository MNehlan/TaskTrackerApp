import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, MenuItem, Select } from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';

const ViewAssignedTasks = ({ user, updateTaskStatus }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/tasks');
        const assigned = res.data.filter(task => task.assignedTo === user.name);
        setTasks(assigned);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };
    fetchTasks();
  }, [user.name]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { status: newStatus });
      setTasks(prev =>
        prev.map(task =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const getProgress = () => {
    const completed = tasks.filter(task => task.status === 'Done').length;
    return `${completed} of ${tasks.length} tasks completed`;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        px: 2,
        py: 4,
        background: 'linear-gradient(to bottom, #f5f7fa, #e4ecf7)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          My Assigned Tasks
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {getProgress()}
        </Typography>
      </motion.div>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: '1fr 1fr 1fr',
          },
          gap: 3,
          width: '100%',
          maxWidth: 1200,
        }}
      >
        {tasks.map((task) => (
          <motion.div
            key={task._id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              elevation={5}
              sx={{
                borderRadius: 3,
                p: 2,
                bgcolor: '#ffffff',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {task.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Project: {task.project}
                </Typography>

                <Select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  sx={{
                    mt: 2,
                    width: '100%',
                    bgcolor: '#f3f4f6',
                    borderRadius: 2,
                    '&:hover': { bgcolor: '#e5e7eb' },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <MenuItem value="To Do">📝 To Do</MenuItem>
                  <MenuItem value="In Progress">⏳ In Progress</MenuItem>
                  <MenuItem value="Done">✅ Done</MenuItem>
                </Select>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};

export default ViewAssignedTasks;
