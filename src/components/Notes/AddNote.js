import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaMicrophone, FaTimes } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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

const AddNote = ({ notes = [], addNote, updateNote }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState(colors[0].value);
    const [loading, setLoading] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const navigate = useNavigate();
    const recognitionRef = useRef(null);
    const silenceTimerRef = useRef(null);
    const { id } = useParams();

    useEffect(() => {
        if (id) {
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
                } catch (error) {
                    toast.error('Failed to load note');
                    navigate('/');
                }
            };

            fetchNote();
        }
    }, [id, navigate]);

    const handleAddOrEditNote = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
        const noteData = { title, description, color, noteType: 'text' };

        try {
            if (id) {
                await axios.put(`/api/notes/${id}`, noteData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Note updated successfully');
            } else {
                await axios.post('/api/notes', noteData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Note added successfully');
            }
            navigate('/');
        } catch (error) {
            setLoading(false);
            toast.error('Failed to save note');
        }
    };

    const startRecognition = () => {
        if (!recognitionRef.current) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                if (event.results[event.resultIndex].isFinal) {
                    const speechToText = event.results[event.resultIndex][0].transcript;
                    setDescription(prevDescription => prevDescription + ' ' + speechToText);
                    setIsSpeaking(true);
                    resetSilenceTimer();
                }
            };

            recognitionRef.current.onsoundend = () => {
                setIsSpeaking(false);
            };

            recognitionRef.current.onend = () => {
                if (isRecording) {
                    recognitionRef.current.start();
                }
            };
        }
        recognitionRef.current.start();
        setIsRecording(true);
        startSilenceTimer();
    };

    const stopRecognition = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsRecording(false);
        setIsSpeaking(false);
        clearSilenceTimer();
    };

    const startSilenceTimer = () => {
        clearSilenceTimer();
        silenceTimerRef.current = setTimeout(() => {
            setIsPopupVisible(false);
            stopRecognition();
        }, 5000);
    };

    const resetSilenceTimer = () => {
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            startSilenceTimer();
        }
    };

    const clearSilenceTimer = () => {
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
        }
    };

    const togglePopup = () => {
        setIsPopupVisible(prev => !prev);
        if (!isPopupVisible) {
            startRecognition();
        } else {
            stopRecognition();
        }
    };

    const closePopup = () => {
        setIsPopupVisible(false);
        stopRecognition();
    };

    return (
        <div className="note-container full-screen">
            <form onSubmit={handleAddOrEditNote} className="note-form full-screen">
                <h2>{id ? 'Edit Note' : 'Add Note'}</h2>
                <div className="title-container">
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                /></div>
                <div className="description-container">
                    <ReactQuill
                        value={description}
                        onChange={setDescription}
                        theme="snow"
                        placeholder="Description"
                    />
                    <button className="mic-button" type="button" onClick={togglePopup}>
                        <FaMicrophone size={20} />
                    </button>
                </div>
                {isPopupVisible && (
                    <div className="mic-popup">
                        <button className="close-popup-button" onClick={closePopup}>
                            <FaTimes size={20} />
                        </button>
                        <p>Speak</p>
                        <div className="mic-popup-controls">
                            <button className="mic-popup-button" onClick={isRecording ? stopRecognition : startRecognition}>
                                {isSpeaking ? <FaMicrophone size={20} className="recording" /> : <FaMicrophone size={20} />}
                            </button>
                        </div>
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

export default AddNote;
