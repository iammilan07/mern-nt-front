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

        const user = new User({ username, email, password }); // Pass plain password
        await user.save();
        console.log('User registered:', user); // Debug log
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error in registerUser:', error); // Debug log
        res.status(500).json({ message: 'Server error' });
    }
};


const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Login Request Received:', { email, password }); // Debug log

        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found:', email); // Debug log
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        console.log('Stored Hashed Password:', user.password); // Debug log
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password does not match for user:', email); // Debug log
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Login Successful for user:', email); // Debug log
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error in loginUser:', error); // Debug log
        res.status(500).json({ message: 'Server error' });
    }
};




const logoutUser = (req, res) => {
    res.status(200).json({ message: 'User logged out successfully' });
};

const getUser = async (req, res) => {
    try {
        console.log('Fetching user data for ID:', req.user.id); // Debug log
        const user = await User.findById(req.user.id).select('-password');
        console.log('User data:', user); // Debug log
        res.json(user);
    } catch (error) {
        console.error('Error fetching user data:', error); // Debug log
        res.status(500).json({ message: 'Server error' });
    }
};

console.log('Auth Controller Functions Defined'); // Debug log

module.exports = { registerUser, loginUser, logoutUser, getUser };
