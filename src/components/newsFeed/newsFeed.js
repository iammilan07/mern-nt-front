import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEllipsisH, FaCommentAlt } from 'react-icons/fa';
import Comments from './Comments'; // Import the Comments component
import './newsFeed.css';
import { useNavigate } from 'react-router-dom';

const NewsFeed = () => {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [postContent, setPostContent] = useState('');
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [showMenu, setShowMenu] = useState(null);
    const [expandedPosts, setExpandedPosts] = useState([]); // Correct the state definition here
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.username) {
                    setUser(response.data);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchPosts = async () => {
            try {
                const response = await axios.get('/api/posts');
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchUserData();
        fetchPosts();
    }, []);

    const refetchPosts = async () => {
        try {
            const response = await axios.get('/api/posts');
            setPosts(response.data);
        } catch (error) {
            console.error('Error refetching posts:', error);
        }
    };

    const handlePostCreate = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/posts', { content: postContent }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPostContent('');
            setIsPopupVisible(false);
            refetchPosts();
            navigate('/news-feed');
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/posts/${postId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(posts.filter(post => post._id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleEditPost = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/posts/${editingPost._id}`, { content: postContent }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPostContent('');
            setIsPopupVisible(false);
            setEditingPost(null);
            refetchPosts();
            navigate('/news-feed');
        } catch (error) {
            console.error('Error editing post:', error);
        }
    };

    const openEditPopup = (post) => {
        setPostContent(post.content);
        setEditingPost(post);
        setIsPopupVisible(true);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const toggleMenu = (postId) => {
        setShowMenu(prev => (prev === postId ? null : postId));
    };

    const toggleComments = (postId) => {
        setExpandedPosts(prev =>
            prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
        );
    };

    const updateCommentCount = (postId, count) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post._id === postId ? { ...post, commentCount: count } : post
            )
        );
    };

    return (
        <div className="news-feed">
            <div className="create-post-card" onClick={() => { setIsPopupVisible(true); setEditingPost(null); }}>
                <textarea placeholder={user ? `What's on your mind, ${user.username}?` : "Loading..."} readOnly></textarea>
            </div>
            {isPopupVisible && (
                <div className="popup-card">
                    <div className="popup-header">
                        <h2>{editingPost ? 'Edit Post' : 'Create Post'}</h2>
                        <button onClick={() => { setIsPopupVisible(false); setEditingPost(null); }}>&times;</button>
                    </div>
                    <div className="popup-body">
                        <p>{user?.username}</p>
                        <textarea
                            placeholder={user ? `What's on your mind, ${user.username}?` : "Loading..."}
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                        ></textarea>
                        <button onClick={editingPost ? handleEditPost : handlePostCreate}>
                            {editingPost ? 'Save Changes' : 'Create'}
                        </button>
                    </div>
                </div>
            )}
            <div className="posts">
                {posts.map(post => (
                    <div key={post._id} className="post-card">
                        <div className="post-header">
                            <p>{post.user?.username || 'Unknown User'} added a post</p>
                            <p className="post-date">Created at {formatDate(post.createdAt)}</p>
                            {post.user && post.user._id === user?._id && (
                                <span className="post-options">
                                    <FaEllipsisH onClick={() => toggleMenu(post._id)} />
                                    {showMenu === post._id && (
                                        <div className="dropdown-menu">
                                            <button onClick={() => openEditPopup(post)}>Edit</button>
                                            <button onClick={() => handleDeletePost(post._id)}>Delete</button>
                                        </div>
                                    )}
                                </span>
                            )}
                        </div>
                        <p>{post.content}</p>
                        <div className="post-footer">
                            <button onClick={() => toggleComments(post._id)} className="comment-button">
                                <FaCommentAlt /> <span>Comment ({post.commentCount || 0})</span>
                            </button>
                        </div>
                        {expandedPosts.includes(post._id) && post.user && (
                            <Comments postId={post._id} user={user} postUserId={post.user._id} updateCommentCount={(count) => updateCommentCount(post._id, count)} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsFeed;
