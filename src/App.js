import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import MainContent from './components/MainContent';
import AddNote from './components/Notes/AddNote';
import NoteView from './components/Notes/NoteView';
import NewsFeed from './components/newsFeed/newsFeed';
import AllNotes from './components/Notes/AllNotes';
import SpeakType from './components/utils/SpeakType';
import Welcome from './components/Welcome';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const App = () => {
    const [notes, setNotes] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const addNote = (note) => {
        setNotes([...notes, note]);
    };

    const updateNote = (updatedNote) => {
        const updatedNotes = notes.map(note => note._id === updatedNote._id ? updatedNote : note);
        setNotes(updatedNotes);
    };

    return (
        <Router>
            <ToastContainer />
            {isLoggedIn && <Navbar />}
            <div className={`container ${isLoggedIn ? 'with-navbar' : ''}`}>
                <Routes>
                    <Route path="/" element={isLoggedIn ? <MainContent /> : <Welcome />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/add-note" element={<AddNote addNote={addNote} />} />
                    <Route path="/edit-note/:id" element={<AddNote notes={notes} updateNote={updateNote} />} />
                    <Route path="/view/:id" element={<NoteView />} />
                    <Route path="/news-feed" element={<NewsFeed />} /> 
                    <Route path="/all-notes" element={<AllNotes/>} />
                    <Route path="/speak-type" element={<SpeakType addVoiceNote={addNote} />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
