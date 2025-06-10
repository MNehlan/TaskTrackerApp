const express = require('express');
const router = express.Router();
const TeamMember = require('../models/TeamMember');


router.get('/', async (req, res) => {
  try {
    const team = await TeamMember.find();
    res.json(team);
  } catch (err) {
    console.error('Error fetching team members:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/', async (req, res) => {
  try {
    const member = new TeamMember(req.body);
    await member.save();
    res.status(201).json(member);
  } catch (err) {
    console.error('Error creating team member:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const updated = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('Error updating team member:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    await TeamMember.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
