const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/note');
const postRoutes = require('./routes/Post'); // Ensure correct import path and casing
const commentRoutes = require('./routes/comment'); // Ensure correct import path
const summarizeRoutes = require('./routes/summarize'); // Import the summarize routes

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

console.log('Server Setup Initialized'); // Debug log

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts/:postId/comments', commentRoutes); // Ensure correct route definition
app.use('/api/summarize', summarizeRoutes); // Add the summarize route

console.log('Routes Registered'); // Debug log

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
