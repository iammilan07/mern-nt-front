const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/note');
const postRoutes = require('./routes/Post'); // Ensure correct casing

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());


// Routes
app.use('/api/auth', authRoutes);

app.use('/api/notes', noteRoutes);

app.use('/api/posts', postRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
