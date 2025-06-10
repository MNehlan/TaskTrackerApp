import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Select,MenuItem, Typography,Card, CardContent, CardActions, Chip, IconButton, InputLabel, FormControl} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

const TaskManager = ({ team, projects }) => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ name: '', status: '', assignedTo: '', project: '' });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get('http://localhost:5000/api/tasks');
    setTasks(res.data);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.status || !form.assignedTo || !form.project) return;

    if (editIndex !== null) {
      const id = tasks[editIndex]._id;
      const res = await axios.put(`http://localhost:5000/api/tasks/${id}`, form);
      const updated = [...tasks];
      updated[editIndex] = res.data;
      setTasks(updated);
      setEditIndex(null);
    } else {
      const res = await axios.post('http://localhost:5000/api/tasks', form);
      setTasks([...tasks, res.data]);
    }

    setForm({ name: '', status: '', assignedTo: '', project: '' });
  };

  const handleEdit = (index) => {
    setForm(tasks[index]);
    setEditIndex(index);
  };

  const handleDelete = async (index) => {
    const id = tasks[index]._id;
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'To Do':
        return 'default';
      case 'In Progress':
        return 'warning';
      case 'Done':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3, ml: { md: '240px' }, width: { md: 'calc(100% - 240px)' } }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Task Manager
      </Typography>

      {/* Task Form */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: 500,
          mb: 4,
          p: 3,
          borderRadius: 3,
          boxShadow: 3,
          bgcolor: 'background.paper',
        }}
      >
        <TextField
          label="Task Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            label="Status"
          >
            <MenuItem value="To Do">To Do</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Assign To</InputLabel>
          <Select
            value={form.assignedTo}
            onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
            label="Assign To"
          >
            {team.map((t) => (
              <MenuItem key={t._id} value={t.name}>
                {t.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Project</InputLabel>
          <Select
            value={form.project}
            onChange={(e) => setForm({ ...form, project: e.target.value })}
            label="Project"
          >
            {projects.map((p) => (
              <MenuItem key={p._id} value={p.name}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" size="large" onClick={handleSubmit}>
          {editIndex !== null ? 'Update Task' : 'Add Task'}
        </Button>
      </Box>

      {/* Task Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
          gap: 3,
        }}
      >
        {tasks.map((task, index) => (
          <Card key={task._id} elevation={4} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                {task.name}
              </Typography>
              <Chip
                label={task.status}
                color={getStatusColor(task.status)}
                sx={{ mt: 1, mb: 1 }}
              />
              <Typography variant="body2">
                <strong>Assigned To:</strong> {task.assignedTo}
              </Typography>
              <Typography variant="body2">
                <strong>Project:</strong> {task.project}
              </Typography>
            </CardContent>
            <CardActions>
              <IconButton onClick={() => handleEdit(index)} color="primary">
                <Edit />
              </IconButton>
              <IconButton onClick={() => handleDelete(index)} color="error">
                <Delete />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default TaskManager;
