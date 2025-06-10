const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: {
    type: String,
    enum: ['Admin', 'Team Member'],
    default: 'Team Member',
  },
});

module.exports = mongoose.model('TeamMember', teamMemberSchema);
