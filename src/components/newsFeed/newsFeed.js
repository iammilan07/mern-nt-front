import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './newsFeed.css';

const NewsFeed = () => {
    const [user, setUser] = useState('');
    const [posts, setPosts] = useState([]);
    const [postContent, setPostContent] = useState('');
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.username) {
                    setUser(response.data.username);
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

    return (
        <div className="news-feed">
            <div className="create-post-card" onClick={() => { setIsPopupVisible(true); setEditingPost(null); }}>
                <textarea placeholder={`What's on your mind, ${user}?`} readOnly></textarea>
            </div>
            {isPopupVisible && (
                <div className="popup-card">
                    <div className="popup-header">
                        <h2>{editingPost ? 'Edit Post' : 'Create Post'}</h2>
                        <button onClick={() => { setIsPopupVisible(false); setEditingPost(null); }}>&times;</button>
                    </div>
                    <div className="popup-body">
                        <p>{user}</p>
                        <textarea
                            placeholder={`What's on your mind, ${user}?`}
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
                        <p>{post.user?.username || 'Unknown User'} added a post</p>
                        <p>{post.content}</p>
                        {post.user?.username === user && (
                            <div className="post-actions">
                                <button onClick={() => openEditPopup(post)}>Edit</button>
                                <button onClick={() => handleDeletePost(post._id)}>Delete</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsFeed;
