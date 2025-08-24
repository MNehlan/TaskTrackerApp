import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Box, Typography, Card, CardContent, useTheme, Avatar, Table, TableHead, TableRow, TableCell, TableBody,  Paper} from '@mui/material';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, ResponsiveContainer,} from 'recharts';
import { deepPurple } from '@mui/material/colors';

const AdminDashboard = () => {
  const theme = useTheme();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchTeam();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get('http://localhost:5000/api/tasks');
    setTasks(res.data);
  };

  const fetchProjects = async () => {
    const res = await axios.get('http://localhost:5000/api/projects');
    setProjects(res.data);
  };

  const fetchTeam = async () => {
    const res = await axios.get('http://localhost:5000/api/team');
    setTeam(res.data);
  };

  const pendingTasks = tasks.filter((t) => t.status === 'To Do').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const completedTasks = tasks.filter((t) => t.status === 'Done').length;

  const pieData = [
    { name: 'To Do', value: pendingTasks },
    { name: 'In Progress', value: inProgressTasks },
    { name: 'Done', value: completedTasks },
  ];

  const COLORS = ['#f59e0b', '#f97316', '#10b981'];

  const projectSummary = projects.map((project) => {
    const projectTasks = tasks.filter((task) => task.project === project.name);
    return { name: project.name, tasks: projectTasks.length };
  });

  const recentTasks = [...tasks].reverse().slice(0, 5);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        p: 3,
        ml: { xs: 0, md: '240px' },
        width: { xs: '100%', md: 'calc(100% - 240px)' },
        boxSizing: 'border-box',
        minHeight: '100vh',
        bgcolor: theme.palette.background.default,
      }}
    >
      <Box sx={{ maxWidth: '1440px', mx: 'auto' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          Admin Dashboard
        </Typography>

        {/* Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 2,
            mb: 4,
          }}
        >
          <Card sx={{ bgcolor: '#1e3a8a', color: 'white', borderRadius: 3, boxShadow: 4 }}>
            <CardContent>
              <Typography variant="h6">Projects</Typography>
              <Typography variant="h4">{projects.length}</Typography>
            </CardContent>
          </Card>

          <Card sx={{ bgcolor: '#2563eb', color: 'white', borderRadius: 3, boxShadow: 4 }}>
            <CardContent>
              <Typography variant="h6">Team Members</Typography>
              <Typography variant="h4">{team.length}</Typography>
            </CardContent>
          </Card>

          <Card sx={{ bgcolor: '#10b981', color: 'white', borderRadius: 3, boxShadow: 4 }}>
            <CardContent>
              <Typography variant="h6">Total Tasks</Typography>
              <Typography variant="h4">{tasks.length}</Typography>
            </CardContent>
          </Card>

          <Card sx={{ bgcolor: '#f59e0b', color: 'white', borderRadius: 3, boxShadow: 4 }}>
            <CardContent>
              <Typography variant="h6">Pending Tasks</Typography>
              <Typography variant="h4">{pendingTasks}</Typography>
            </CardContent>
          </Card>

          <Card sx={{ bgcolor: '#f97316', color: 'white', borderRadius: 3, boxShadow: 4 }}>
            <CardContent>
              <Typography variant="h6">In Progress</Typography>
              <Typography variant="h4">{inProgressTasks}</Typography>
            </CardContent>
          </Card>

          <Card sx={{ bgcolor: '#10b981', color: 'white', borderRadius: 3, boxShadow: 4 }}>
            <CardContent>
              <Typography variant="h6">Completed</Typography>
              <Typography variant="h4">{completedTasks}</Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Charts */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3,
            mb: 4,
          }}
        >
          <Paper elevation={4} sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Task Status
            </Typography>
            <PieChart width={300} height={250}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Paper>

          <Paper elevation={4} sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Project Task Summary
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={projectSummary}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="tasks" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Box>

        {/* Team + Recent Tasks */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3,
          }}
        >
          <Paper elevation={4} sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Team Overview
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={2}>
              {team.map((member) => (
                <Box key={member._id} display="flex" alignItems="center" gap={1}>
                  <Avatar sx={{ bgcolor: deepPurple[500] }}>
                    {member.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography>{member.name}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          <Paper elevation={4} sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Tasks
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Assigned</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentTasks.map((task) => (
                  <TableRow key={task._id}>
                    <TableCell>{task.name}</TableCell>
                    <TableCell>{task.status}</TableCell>
                    <TableCell>{task.assignedTo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
