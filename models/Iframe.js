// models/Iframe.js
const mongoose = require('mongoose');

const IframeSchema = new mongoose.Schema({
  iframeSrc: {
    type: String,
    required: true,
  }
  // Add any other fields you need for the iframe
});

module.exports = mongoose.model('Iframe', IframeSchema);  