const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: String,
  director: String,
  genre: String,
  releaseYear: Number,
  description: String,
  ratings: [{ user: mongoose.Types.ObjectId, rating: Number, review: String }]
});

module.exports = mongoose.model('Movie', movieSchema);