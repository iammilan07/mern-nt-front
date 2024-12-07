const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            // console.log('User found:', req.user); // Add log to check user data
            next();
        } catch (error) {
            // console.error('Not authorized, token failed', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        // console.log('No token provided');
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = protect;
