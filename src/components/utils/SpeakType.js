import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaMicrophone, FaStop, FaPause, FaPlay } from 'react-icons/fa';
import './SpeakType.css';

const SpeakType = ({ addVoiceNote }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [audioUrl, setAudioUrl] = useState('');
    const [elapsedTime, setElapsedTime] = useState(0);
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);

    useEffect(() => {
        if (isRecording && !isPaused) {
            timerRef.current = setInterval(() => {
                setElapsedTime(prevTime => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isRecording, isPaused]);

    const startRecording = () => {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = event => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
                const url = URL.createObjectURL(audioBlob);
                setAudioUrl(url);
            };

            mediaRecorder.start();
            setIsRecording(true);
        });
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
    };

    const pauseRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.pause();
            setIsPaused(true);
        }
    };

    const resumeRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
            mediaRecorderRef.current.resume();
            setIsPaused(false);
        }
    };

    const handleSave = async () => {
        if (!title.trim()) {
            setError('Title is required');
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/notes', {
                title,
                audioUrl,
                noteType: 'voice',
                createdAt: new Date().toISOString()
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Voice note added successfully');
            navigate('/');
        } catch (error) {
            setLoading(false);
            toast.error('Failed to add voice note');
        }
        setTitle('');
        setAudioUrl('');
        setElapsedTime(0);
        setError('');
    };

    const handleReRecord = () => {
        setAudioUrl('');
        setIsPaused(false);
        setElapsedTime(0);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="speak-type">
            <h2>Record Your Voice Note</h2>
            <p>Click the button below to start recording your voice note. When you're done, click stop and save your note.</p>
            <div className="title-input-container">
                <input 
                    type="text"
                    placeholder="Enter title for your voice note..."
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        setError('');
                    }}
                    className="title-input"
                />
            </div>
            {!isRecording && !audioUrl && (
                <button className="record-button start-button" onClick={startRecording}>
                    <FaMicrophone size={20} /> Record
                </button>
            )}
            {isRecording && (
                <div className="recording-controls">
                    <button className="record-button stop-button" onClick={stopRecording}>
                        <FaStop size={20} /> Stop
                    </button>
                    {isPaused ? (
                        <button className="record-button resume-button" onClick={resumeRecording}>
                            <FaPlay size={20} /> Resume
                        </button>
                    ) : (
                        <button className="record-button pause-button" onClick={pauseRecording}>
                            <FaPause size={20} /> Pause
                        </button>
                    )}
                    <div className="recording-animation">
                        Recording... <span>{formatTime(elapsedTime)}</span>
                    </div>
                </div>
            )}
            {audioUrl && !isRecording && (
                <div className="audio-preview">
                    <audio controls src={audioUrl}></audio>
                    <button onClick={handleSave}>{loading ? 'Saving...' : 'Save'}Save</button>
                    <button className="re-record-button" onClick={handleReRecord}>Re-record</button>
                </div>
            )}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default SpeakType;