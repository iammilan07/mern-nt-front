import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiHome, FiPlus, FiLogOut } from 'react-icons/fi';
import { MdFeed } from 'react-icons/md'; // Import the news feed icon
import Modal from '../Modal/Modal'; // Import the Modal component
import 'react-toastify/dist/ReactToastify.css';
import { LuNotebookPen } from "react-icons/lu";
import './Navbar.css';

const Navbar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeIcon, setActiveIcon] = useState(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false); // State to control the modal visibility
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate('/');
        setActiveIcon('home');
    };

    const handleAddTextNoteClick = () => {
        navigate('/add-note');
        setActiveIcon('text-note');
    };

    const handleAddVoiceNoteClick = () => {
        navigate('/speak-type');
        setActiveIcon('voice-note');
    };

    const handleNewsFeedClick = () => {
        navigate('/news-feed'); // Navigate to the news feed page
        setActiveIcon('news-feed');
    };


    const handleNotesClick = () => {
        navigate('/all-notes'); // Navigate to the news feed page
        setActiveIcon('all-notes');
    };


    const handleLogoutConfirm = () => {
        localStorage.removeItem('token');
        toast.success('Logged out successfully');
        navigate('/login');
        window.location.reload();
        setActiveIcon('logout');
    };

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false);
    };

    return (
        <div className="navbar">
            <div className="navbar-content">
                <div 
                    className={`icon-container ${activeIcon === 'home' ? 'active' : ''}`} 
                    onClick={handleHomeClick}
                    onMouseEnter={() => setActiveIcon('home')}
                    onMouseLeave={() => setActiveIcon(null)}
                >
                    <FiHome size={24} />
                </div>
                <div 
                    className={`icon-container ${activeIcon === 'news-feed' ? 'active' : ''}`} 
                    onClick={handleNewsFeedClick}
                    onMouseEnter={() => setActiveIcon('news-feed')}
                    onMouseLeave={() => setActiveIcon(null)}
                >
                    <MdFeed size={24} />
                </div>
                <div 
                    className={`icon-container expand-hover ${activeIcon === 'plus' ? 'active' : ''}`} 
                    onMouseEnter={() => setIsExpanded(true)}
                    onMouseLeave={() => setIsExpanded(false)}
                >
                    <FiPlus size={24} />
                    {isExpanded && (
                        <div className="hover-text">
                            <div 
                                className="text-option" 
                                onClick={handleAddTextNoteClick}
                                onMouseEnter={() => setActiveIcon('text-note')}
                                onMouseLeave={() => setActiveIcon(null)}
                            >
                                Add Text Note
                            </div>
                            <div 
                                className="text-option" 
                                onClick={handleAddVoiceNoteClick}
                                onMouseEnter={() => setActiveIcon('voice-note')}
                                onMouseLeave={() => setActiveIcon(null)}
                            >
                                Add Voice Note
                            </div>
                        </div>
                    )}
                </div>

                <div 
                    className={`icon-container ${activeIcon === 'all-notes' ? 'active' : ''}`} 
                    onClick={handleNotesClick}
                    onMouseEnter={() => setActiveIcon('all-notes')}
                    onMouseLeave={() => setActiveIcon(null)}
                >
                    <LuNotebookPen  size={24} />
                </div>


                <div 
                    className={`icon-container logout ${activeIcon === 'logout' ? 'active' : ''}`} 
                    onClick={handleLogoutClick}
                    onMouseEnter={() => setActiveIcon('logout')}
                    onMouseLeave={() => setActiveIcon(null)}
                >
                    <FiLogOut size={24} />
                </div>
            </div>
            <Modal 
                show={showLogoutModal}
                title="Confirm Logout"
                message="Are you sure you want to logout?"
                onConfirm={handleLogoutConfirm}
                onCancel={handleCancelLogout}
            />
        </div>
    );
};

export default Navbar;
