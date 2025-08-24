import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { motion } from 'framer-motion';

const ProjectManager = () => {
  const theme = useTheme(); // Access MUI theme
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await axios.get('http://localhost:5000/api/projects');
    setProjects(res.data);
  };

  const handleAddOrUpdate = async () => {
    if (!projectName.trim()) return;
    if (editId) {
      await axios.put(`http://localhost:5000/api/projects/${editId}`, { name: projectName });
      setEditId(null);
    } else {
      await axios.post('http://localhost:5000/api/projects', { name: projectName });
    }
    setProjectName('');
    fetchProjects();
  };

  const handleEdit = (project) => {
    setProjectName(project.name);
    setEditId(project._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/projects/${id}`);
    fetchProjects();
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        p: 3,
        ml: { md: '240px' },
        width: { md: 'calc(100% - 240px)' },
        boxSizing: 'border-box',
        bgcolor: 'background.default',
        minHeight: '100vh',
        color: 'text.primary',
      }}
    >
      <Box sx={{ maxWidth: '900px', mx: 'auto' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Project Manager
        </Typography>

        {/* Stat Card */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr' },
            gap: 2,
            mb: 3,
          }}
        >
          <Paper
            elevation={4}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            }}
          >
            <Typography variant="h6">Total Projects</Typography>
            <Typography variant="h3" fontWeight="bold">
              {projects.length}
            </Typography>
          </Paper>
        </Box>

        {/* Form Section */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '3fr 1fr' },
              gap: 2,
            }}
          >
            <TextField
              label="Project Name"
              fullWidth
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleAddOrUpdate}
              sx={{ height: '100%' }}
            >
              {editId ? 'Update' : 'Add'} Project
            </Button>
          </Box>
        </Paper>

        {/* Project Table */}
        <Paper
          elevation={4}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            color: 'text.primary',
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    fontWeight: 'bold',
                  }}
                >
                  Project Name
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    fontWeight: 'bold',
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project._id}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(project)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(project._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {projects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No projects found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  );
};

export default ProjectManager;