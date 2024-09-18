const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  paragraph: { type: String, required: true },
  linkUrl: { type: String, required: true },
  imageUrl: { type: String, required: true },  // Cloudinary image URL
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Container', required: true }
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;