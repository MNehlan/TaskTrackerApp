const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: String,
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Done'],
    default: 'To Do',
  },
  assignedTo: String,
  project: String,
});

module.exports = mongoose.model('Task', taskSchema);