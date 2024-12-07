import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Notes.css';

const colors = [
    { name: 'Light Blue', value: '#ADD8E6' },
    { name: 'Light Yellow', value: '#FFFFE0' },
    { name: 'Light Pink', value: '#FFB6C1' },
    { name: 'Light Red', value: '#FFA07A' },
    { name: 'Light Orange', value: '#FFDAB9' },
    { name: 'Light Violet', value: '#E6E6FA' },
    { name: 'Light White', value: '#F5F5F5' },
];

const EditNote = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState(colors[0].value);
    const [noteType, setNoteType] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const textAreaRef = useRef(null);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`/api/notes/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const note = response.data;
                setTitle(note.title);
                setDescription(note.description);
                setColor(note.color);
                setNoteType(note.noteType); // Set note type
            } catch (error) {
                toast.error('Failed to load note');
                navigate('/');
            }
        };

        fetchNote();
    }, [id, navigate]);

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto';
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    }, [description]);

    const handleEditNote = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/notes/${id}`, { title, description, color }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Note updated successfully');
            navigate('/');
        } catch (error) {
            setLoading(false);
            toast.error('Failed to update note');
        }
    };

    return (
        <div className="note-container full-screen">
            <form onSubmit={handleEditNote} className="note-form full-screen">
                <h2>Edit Note</h2>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                {noteType === 'text' && (
                    <div className="description-container">
                        <textarea
                            ref={textAreaRef}
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="5"
                            required
                        ></textarea>
                    </div>
                )}
                <div className="color-selector">
                    <p>Select Color:</p>
                    <div className="color-options">
                        {colors.map(col => (
                            <div
                                key={col.value}
                                className={`color-block ${color === col.value ? 'selected' : ''}`}
                                style={{ backgroundColor: col.value }}
                                onClick={() => setColor(col.value)}
                            ></div>
                        ))}
                    </div>
                </div>
                <button type="submit" className="save-button" disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                </button>
            </form>
        </div>
    );
};

export default EditNote;
