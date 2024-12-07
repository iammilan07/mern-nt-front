import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiSave } from 'react-icons/fi';
import { FaMicrophone, FaFileAlt } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Notes.css';

const NoteCard = ({ note, onUpdate }) => {
    const [showDescription] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(note.title);
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/notes/${note._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Note deleted successfully');
            onUpdate(note._id, true);
        } catch (error) {
            toast.error('Failed to delete note');
        }
    };

    const handleEditClick = () => {
        if (note.noteType === 'voice') {
            setIsEditing(true);
        } else {
            navigate(`/edit-note/${note._id}`);
        }
    };

    const handleSaveClick = async () => {
        try {
            const token = localStorage.getItem('token');
            const updatedNote = { 
                title: newTitle, 
                noteType: note.noteType // Preserve the noteType
            };

            await axios.put(`/api/notes/${note._id}`, updatedNote, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success('Note updated successfully');
            setIsEditing(false);
            onUpdate(updatedNote);
        } catch (error) {
            toast.error('Failed to update note');
        }
    };

    const handleViewClick = () => {
        navigate(`/view/${note._id}`);
    };

    return (
        <div className="note-card" style={{ backgroundColor: note.color }}>
            <div className="note-header">
                <div className="note-type-icon">
                    {note.noteType === 'voice' ? <FaMicrophone /> : <FaFileAlt />}
                </div>
                {isEditing && note.noteType === 'voice' ? (
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                ) : (
                    <h3 onClick={handleViewClick}>{note.title}</h3>
                )}
                <span className="note-type-label">{note.noteType === 'voice' ? 'Voice Note' : 'Text Note'}</span>
            </div>
            {showDescription && (
                <>
                    <p>{note.description}</p>
                    {note.audioUrl && (
                        <audio controls>
                            <source src={note.audioUrl} type="audio/mp3" />
                            Your browser does not support the audio element.
                        </audio>
                    )}
                </>
            )}
            <div className="note-icons">
                {isEditing && note.noteType === 'voice' ? (
                    <FiSave onClick={handleSaveClick} />
                ) : (
                    <FiEdit onClick={handleEditClick} />
                )}
                <FiTrash2 onClick={handleDelete} />
            </div>
            <small>Last modified: {new Date(note.updatedAt).toLocaleString()}</small>
        </div>
    );
};

export default NoteCard;
