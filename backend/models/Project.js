const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: String,
});

module.exports = mongoose.model('Project', projectSchema);
