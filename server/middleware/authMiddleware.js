const jwt = require('jsonwebtoken');
const User = require('../models/User');

console.log('Auth Middleware Loaded'); // Debug log

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            console.log('User authenticated:', req.user); // Debug log
            next();
        } catch (error) {
            console.error('Not authorized, token failed', error); // Debug log
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        console.log('No token provided'); // Debug log
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

console.log('Protect middleware defined'); // Debug log

module.exports = { protect }; // Ensure correct export
