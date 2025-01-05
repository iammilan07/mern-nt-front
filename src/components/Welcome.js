import React from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
    return (
        <div className="welcome-container">
            <h1>Welcome to Intelligent Note-Taking System for CIHE Students</h1>
            <p>Please log in to the system, or register if you are new.</p>
            <div className="welcome-buttons">
                <Link to="/login" className="button">Login</Link>
                <Link to="/register" className="button">Register</Link>
            </div>
        </div>
    );
};

export default Welcome;
