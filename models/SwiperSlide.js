const mongoose = require('mongoose');

const swiperSlideSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  anchorUrl: {
    type: String, // Store the URL for the anchor tag
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const SwiperSlide = mongoose.model('SwiperSlide', swiperSlideSchema);

module.exports = SwiperSlide;
