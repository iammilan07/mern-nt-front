import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './newsFeed.css';

const NewsFeed = () => {
    const [user, setUser] = useState('');
    const [posts, setPosts] = useState([]);
    const [postContent, setPostContent] = useState('');
    const [commentContent, setCommentContent] = useState('');
    const [showComments, setShowComments] = useState(null);
    const [comments, setComments] = useState({});
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [editingComment, setEditingComment] = useState(null);
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

    const fetchComments = async (postId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/posts/${postId}/comments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComments(prevComments => ({ ...prevComments, [postId]: response.data }));
        } catch (error) {
            console.error('Error fetching comments:', error);
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

    const handleCommentCreate = async (postId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`/api/posts/${postId}/comments`, { content: commentContent }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCommentContent('');
            fetchComments(postId);
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    const handleDeleteComment = async (commentId, postId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/posts/${postId}/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchComments(postId);
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleEditComment = async (commentId, postId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/posts/${postId}/comments/${commentId}`, { content: commentContent }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCommentContent('');
            setEditingComment(null);
            fetchComments(postId);
        } catch (error) {
            console.error('Error editing comment:', error);
        }
    };

    const openEditPopup = (post) => {
        setPostContent(post.content);
        setEditingPost(post);
        setIsPopupVisible(true);
    };

    const toggleComments = (postId) => {
        if (showComments === postId) {
            setShowComments(null);
        } else {
            setShowComments(postId);
            fetchComments(postId);
        }
    };

    const handleCommentEditClick = (comment) => {
        setCommentContent(comment.content); // Set the content to be edited
        setEditingComment(comment);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
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
                        <p>Created on: {formatDate(post.createdAt)}</p>
                        {post.user?.username === user && (
                            <div className="post-actions">
                                <button onClick={() => openEditPopup(post)}>Edit</button>
                                <button onClick={() => handleDeletePost(post._id)}>Delete</button>
                            </div>
                        )}
                        <button onClick={() => toggleComments(post._id)}>
                            {showComments === post._id ? 'Hide Comments' : 'Show Comments'}
                        </button>
                        {showComments === post._id && (
                            <div className="comments-section">
                                {comments[post._id]?.map(comment => (
                                    <div key={comment._id} className="comment">
                                        <p><strong>{comment.user.username}:</strong> {comment.content}</p>
                                        <p>Updated at: {formatDate(comment.updatedAt || comment.createdAt)}</p>
                                        {comment.user.username === user && (
                                            <div className="comment-actions">
                                                <button onClick={() => handleCommentEditClick(comment)}>Edit</button>
                                                <button onClick={() => handleDeleteComment(comment._id, post._id)}>Delete</button>
                                            </div>
                                        )}
                                        {post.user.username === user && comment.user.username !== user && (
                                            <div className="comment-actions">
                                                <button onClick={() => handleDeleteComment(comment._id, post._id)}>Delete</button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <textarea
                                    placeholder="Write a comment..."
                                    value={commentContent}
                                    onChange={(e) => setCommentContent(e.target.value)}
                                ></textarea>
                                <button onClick={() => handleCommentCreate(post._id)}>Submit</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsFeed;
