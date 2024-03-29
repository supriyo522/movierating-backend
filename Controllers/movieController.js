const Movie = require('../Models/movie');

exports.createMovie = async (req, res) => {
  try {
    const { title, director, genre, releaseYear, description } = req.body;
    const movie = new Movie({ title, director, genre, releaseYear, description });
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create movie' });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const { title, director, genre, releaseYear, description } = req.body;
    const { id } = req.params;
    const updatedMovie = await Movie.findByIdAndUpdate(id, { title, director, genre, releaseYear, description }, { new: true });
    if (!updatedMovie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(updatedMovie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update movie' });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMovie = await Movie.findByIdAndDelete(id);
    if (!deletedMovie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(deletedMovie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete movie' });
  }
};

exports.getMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get movie details' });
  }
};

exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    movie.ratings.push({ user: req.user._id, rating, review });
    await movie.save();
    res.status(201).json(movie.ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add review' });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { movieId, reviewId } = req.params;
    const { rating, review } = req.body;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    const targetReview = movie.ratings.find(r => r._id.equals(reviewId) && r.user.equals(req.user._id));
    if (!targetReview) {
      return res.status(404).json({ error: 'Review not found' });
    }
    targetReview.rating = rating;
    targetReview.review = review;
    await movie.save();
    res.json(targetReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update review' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { movieId, reviewId } = req.params;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    movie.ratings = movie.ratings.filter(r => !r._id.equals(reviewId) || !r.user.equals(req.user._id));
    await movie.save();
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(movie.ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get reviews' });
  }
};

exports.getAverageRating = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    const totalRatings = movie.ratings.length;
    if (totalRatings === 0) {
      return res.json({ averageRating: 0 });
    }
    const sumRatings = movie.ratings.reduce((acc, cur) => acc + cur.rating, 0);
    const averageRating = sumRatings / totalRatings;
    res.json({ averageRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to calculate average rating' });
  }
};