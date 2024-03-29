// Import necessary modules
require('dotenv').config();
const express = require('express');

const apiRoutes = require('./Routes/apiRoutes');

// Connect to MongoDB
// const DB_URI="mongodb://127.0.0.1:27017/movie_rating_app";
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(() => console.log('Failed to connect to MongoDB'));

// Initialize Express app
const app = express();
app.use(express.json());
app.use('/api', apiRoutes);
const port = process.env.PORT || 3000;

 // Start the server after successful database connection
 app.listen(port, () => console.log(`Server is running on port ${port}`));


