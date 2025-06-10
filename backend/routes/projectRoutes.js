
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');


router.get('/', async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});


router.post('/', async (req, res) => {
  const project = new Project(req.body);
  await project.save();
  res.status(201).json(project);
});


router.put('/:id', async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating project' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project' });
  }
});

module.exports = router;
