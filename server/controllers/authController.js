const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Ensure password is hashed
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        // console.error('Error in registerUser:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        // console.error('Error in loginUser:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const logoutUser = (req, res) => {
    res.status(200).json({ message: 'User logged out successfully' });
};

const getUser = async (req, res) => {
    try {
        // console.log('Fetching user data for ID:', req.user.id); // Add log to check user ID
        const user = await User.findById(req.user.id).select('-password');
        // console.log('User data:', user); // Add log to check user data
        res.json(user);
    } catch (error) {
        // console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser, loginUser, logoutUser, getUser };
