const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const movieController = require('../Controllers/movieController');
const authenticateToken = require('../Middleware/authenticateToken');

// Define routes for user authentication
router.post('/users/register', userController.registerUser);
router.post('/users/login', userController.loginUser);

// Define routes for movies CRUD operations
router.post('/movies', authenticateToken, movieController.createMovie);
router.put('/movies/:id', authenticateToken, movieController.updateMovie);
router.delete('/movies/:id', authenticateToken, movieController.deleteMovie);
router.get('/movies/:id', movieController.getMovie);
router.get('/movies', movieController.getAllMovies);

// Define routes for ratings and reviews
router.post('/movies/:id/reviews', authenticateToken, movieController.addReview);
router.put('/movies/:movieId/reviews/:reviewId', authenticateToken, movieController.updateReview);
router.delete('/movies/:movieId/reviews/:reviewId', authenticateToken, movieController.deleteReview);
router.get('/movies/:id/reviews', movieController.getReviews);
router.get('/movies/:id/averageRating', movieController.getAverageRating);

module.exports = router;
