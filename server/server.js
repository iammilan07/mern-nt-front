const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/note'); // Import note routes

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', (req, res, next) => {
    // console.log('API AUTH ROUTE HIT');
    next();
}, authRoutes);
app.use('/api/notes', (req, res, next) => {
    // console.log('API NOTES ROUTE HIT');
    next();
}, noteRoutes); // Register note routes

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    // console.log(`Server running on port ${PORT}`);
});
