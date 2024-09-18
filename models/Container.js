const mongoose = require('mongoose');
const cardSchema = require('./Card').schema;

const containerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  cards: [cardSchema]
});

const Container = mongoose.model('Container', containerSchema);
module.exports = Container;


