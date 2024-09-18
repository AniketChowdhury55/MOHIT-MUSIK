const mongoose = require('mongoose');

const ConfigSchema = new mongoose.Schema({
  iframeSrc: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Config', ConfigSchema);