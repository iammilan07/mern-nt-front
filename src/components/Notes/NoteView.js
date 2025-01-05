import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './NoteView.css';

function NoteView() {
    const { id } = useParams();
    const [note, setNote] = useState(null);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [summary, setSummary] = useState(null); // Add state for summary
    const [loading, setLoading] = useState(false); // Add state for loading
    const audioRef = useRef(null);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`/api/notes/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNote(response.data);
            } catch (error) {
                console.error('Error fetching note:', error);
            }
        };

        fetchNote();
    }, [id]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.playbackRate = playbackRate;
        }
    }, [playbackRate]);

    const handlePlaybackRateChange = (rate) => {
        setPlaybackRate(rate);
        if (audioRef.current) {
            audioRef.current.playbackRate = rate;
        }
    };

    const handleSummarize = async () => {
        if (!note || !note.description) return;

        setLoading(true);
        try {
            const response = await axios.post('/api/summarize', { text: note.description });
            setSummary(response.data.summary);
        } catch (error) {
            console.error('Error summarizing note:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!note) {
        return <p>Note not found.</p>;
    }

    return (
        <div className="note-view">
            {note.noteType === 'voice' ? (
                <div className="audio-note">
                    <h2>{note.title}</h2>
                    <p className="note-date">{new Date(note.updatedAt).toLocaleString()}</p>
                    <audio controls src={note.audioUrl} ref={audioRef}></audio>
                    <div className="playback-controls">
                        <button onClick={() => handlePlaybackRateChange(1)}>1x</button>
                        <button onClick={() => handlePlaybackRateChange(1.2)}>1.2x</button>
                        <button onClick={() => handlePlaybackRateChange(1.5)}>1.5x</button>
                        <button onClick={() => handlePlaybackRateChange(2)}>2x</button>
                    </div>
                </div>
            ) : (
                <div className="text-note">
                    <h2>{note.title}</h2>
                    <p className="note-date">updated at {new Date(note.updatedAt).toLocaleString()}</p>
                    <div 
                        className="note-description" 
                        dangerouslySetInnerHTML={{ __html: summary || note.description }} // Display summary if available
                    />
                    <button onClick={handleSummarize} className="summarize-button">
                        {loading ? "Summarizing..." : "Summarize"}
                    </button>
                </div>
            )}
        </div>
    );
}

export default NoteView;
