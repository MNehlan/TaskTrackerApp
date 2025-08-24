import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, TextField, Typography, ThemeProvider, CssBaseline, IconButton, Alert, InputAdornment } from '@mui/material';
import axios from 'axios';
import { createTheme } from '@mui/material/styles';
import { Brightness4, Brightness7, Visibility, VisibilityOff } from '@mui/icons-material';
import getDesignTokens from './theme/getDesignTokens';

import Sidebar from './components/Sidebar';
import AdminSidebar from './components/AdminSidebar';
import TeamMemberDashboard from './components/TeamMemberDashboard';
import ViewAssignedTasks from './components/ViewAssignedTasks';
import AdminDashboard from './components/AdminDashboard';
import ProjectManager from './components/ProjectManager';
import TeamManager from './components/TeamManager';
import TaskManager from './components/TaskManager';

const App = () => {
  const [mode, setMode] = useState('light');
  const theme = createTheme(getDesignTokens(mode));
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (user?.role === 'Admin') {
      fetchInitialData();
    }
  }, [user]);

  const fetchInitialData = async () => {
    try {
      const [tasksRes, projectsRes, teamRes] = await Promise.all([
        axios.get('http://localhost:5000/api/tasks'),
        axios.get('http://localhost:5000/api/projects'),
        axios.get('http://localhost:5000/api/team'),
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setTeam(teamRes.data);
    } catch (err) {
      console.error('Error fetching initial data:', err);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setLoginError('Please enter both email and password');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const teamRes = await axios.get('http://localhost:5000/api/team');
      const matchedMember = teamRes.data.find(member => member.email === email);
      if (res.data?.user) {
        const enrichedUser = {
          ...res.data.user,
          name: matchedMember?.name,
        };
        setUser(enrichedUser);
        localStorage.setItem('user', JSON.stringify(enrichedUser));
        setLoginError('');
        if (enrichedUser.role === 'Admin') {
          await fetchInitialData();
          navigate('/admin/dashboard');
        } else if (enrichedUser.role === 'Team Member') {
          const tasksRes = await axios.get('http://localhost:5000/api/tasks');
          setTasks(tasksRes.data);
          navigate('/dashboard');
        }
      } else {
        setLoginError('Login failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setLoginError('Invalid email or password');
    }
  };

  const handleRegister = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { email, password });
      if (res.data.success) {
        alert('Registration successful! You can now login.');
        setShowRegister(false);
      } else {
        alert(res.data.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      alert('Registration failed. Try again.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setEmail('');
    localStorage.removeItem('user');
    setMode('light');
    navigate('/');
  };

  const updateTaskStatus = (taskIndex, newStatus) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].status = newStatus;
    setTasks(updatedTasks);
  };

  const addTask = (newTask) => setTasks([...tasks, newTask]);
  const deleteTask = (index) => {
    const updated = [...tasks];
    updated.splice(index, 1);
    setTasks(updated);
  };

  const isAuthPage = location.pathname === '/' || location.pathname === '/register';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!isAuthPage && user?.role === 'Team Member' && <Sidebar user={user} onLogout={handleLogout} />}
      {!isAuthPage && user?.role === 'Admin' && <AdminSidebar user={user} onLogout={handleLogout} />}
      <IconButton
        sx={{ position: 'absolute', top: 10, right: 10 }}
        onClick={() => setMode(prev => (prev === 'light' ? 'dark' : 'light'))}
        color="inherit"
      >
        {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: !isAuthPage && user ? ((user.role === 'Admin' || user.role === 'Team Member') ? '240px' : 0) : 0,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'background.default',
          p: { xs: 2, md: 4 },
          overflow: 'auto',
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              showRegister ? (
                <Box sx={{ ...fullScreenBg }}>
                  <Box sx={authBox}>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Register</Typography>
                    <TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" />
                    <TextField
                      fullWidth
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      margin="normal"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleRegister}>Register</Button>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Already have an account?{' '}
                      <Button variant="text" onClick={() => setShowRegister(false)}>Back to Login</Button>
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ ...fullScreenBg }}>
                  <Box sx={authBox}>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Login</Typography>
                    {loginError && <Alert severity="error" sx={{ mb: 2 }}>{loginError}</Alert>}
                    <TextField fullWidth label="Email" value={email} onChange={(e) => { setEmail(e.target.value); if (loginError) setLoginError(''); }} margin="normal" />
                    <TextField
                      fullWidth
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); if (loginError) setLoginError(''); }}
                      margin="normal"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleLogin}>Login</Button>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Don’t have an account?{' '}
                      <Button variant="text" onClick={() => setShowRegister(true)}>Register</Button>
                    </Typography>
                  </Box>
                </Box>
              )
            }
          />
          <Route path="/admin/dashboard" element={user?.role === 'Admin' ? (
            <AdminDashboard tasks={tasks} team={team} projects={projects} addTask={addTask} deleteTask={deleteTask} />
          ) : <Navigate to="/" />} />
          <Route path="/admin/projects" element={<ProjectManager projects={projects} setProjects={setProjects} />} />
          <Route path="/admin/team" element={<TeamManager team={team} setTeam={setTeam} />} />
          <Route path="/admin/tasks" element={<TaskManager team={team} projects={projects} tasks={tasks} addTask={addTask} deleteTask={deleteTask} />} />
          <Route path="/dashboard" element={<TeamMemberDashboard user={user} tasks={tasks} />} />
          <Route path="/tasks" element={<ViewAssignedTasks user={user} tasks={tasks} updateTaskStatus={updateTaskStatus} />} />
        </Routes>
      </Box>
    </ThemeProvider>
  );
};

const fullScreenBg = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'linear-gradient(180deg, #1e3a8a 0%, #3b82f6 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const authBox = {
  maxWidth: 400,
  width: '100%',
  bgcolor: 'background.paper',
  p: 4,
  borderRadius: 2,
  boxShadow: 3,
  textAlign: 'center',
};

export default App;
