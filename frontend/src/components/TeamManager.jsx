import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const TeamManager = () => {
  const theme = useTheme(); // Access MUI theme
  const [team, setTeam] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/team');
      setTeam(res.data);
    } catch (err) {
      console.error('Error fetching team:', err);
    }
  };

  const handleSave = async () => {
    if (!name || !email) return;

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/team/${editingId}`, {
          name,
          email,
          role: 'Team Member',
        });
      } else {
        await axios.post('http://localhost:5000/api/team', {
          name,
          email,
          role: 'Team Member',
        });
      }

      setName('');
      setEmail('');
      setEditingId(null);
      fetchTeam();
    } catch (err) {
      console.error('Error saving team member:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/team/${id}`);
      fetchTeam();
    } catch (err) {
      console.error('Error deleting team member:', err);
    }
  };

  const handleEdit = (member) => {
    setName(member.name);
    setEmail(member.email);
    setEditingId(member._id);
  };

  return (
    <Box
      sx={{
        p: 3,
        ml: { md: '240px' },
        width: { md: 'calc(100% - 240px)' },
        bgcolor: 'background.default',
        color: 'text.primary',
        minHeight: '100vh',
      }}
    >
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Team Manager
      </Typography>

      {/* Form Section */}
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {editingId ? 'Edit Team Member' : 'Add Team Member'}
          </Typography>

          <Box
            display="grid"
            gridTemplateColumns={{ xs: '1fr', sm: '5fr 5fr 2fr' }}
            gap={2}
          >
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleSave}
              sx={{ height: '100%' }}
            >
              {editingId ? 'Update' : 'Add'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Team Members Table */}
      <Paper
        elevation={4}
        sx={{
          borderRadius: 3,
          bgcolor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <TableContainer>
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
                  Name
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    fontWeight: 'bold',
                  }}
                >
                  Email
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
              {team.length > 0 ? (
                team.map((member) => (
                  <TableRow key={member._id}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEdit(member)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(member._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No team members found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default TeamManager;