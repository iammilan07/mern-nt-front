import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NotesList from './Notes/NotesList';
import './MainContent.css';

const MainContent = () => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.username) {
                    setUsername(response.data.username);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className="main-content">
            <h1>Welcome, {username} to the Note Taking System!</h1>
            <NotesList />
        </div>
    );
};

export default MainContent;
