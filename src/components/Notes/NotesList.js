import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NoteCard from './NoteCard';
import { FaSearch } from 'react-icons/fa';
import './Notes.css';

const NotesList = () => {
    const [notes, setNotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/notes', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNotes(response.data);
            } catch (error) {
                console.error('Failed to fetch notes', error);
            }
        };

        fetchNotes();
    }, []);

    const handleUpdate = (updatedNote, isDelete = false) => {
        if (isDelete) {
            setNotes(notes.filter(note => note._id !== updatedNote));
        } else {
            setNotes(notes.map(note => note._id === updatedNote._id ? updatedNote : note));
        }
    };

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="notes-list-container">
            <div className="all-notes">
        <h1>All Notes</h1>
        {/* <NotesList /> */}
    </div>
            <div className="search-bar">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="notes-list">
                {filteredNotes.map(note => (
                    <NoteCard key={note._id} note={note} onUpdate={handleUpdate} />
                ))}
            </div>
        </div>
    );
};

export default NotesList;
