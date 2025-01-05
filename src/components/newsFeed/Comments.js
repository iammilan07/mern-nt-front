import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import './comments.css'; // Import the CSS file for comments

const Comments = ({ postId, user, postUserId, updateCommentCount }) => {
    const [commentContent, setCommentContent] = useState('');
    const [comments, setComments] = useState([]);
    const [editingComment, setEditingComment] = useState(null);

    const fetchComments = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/posts/${postId}/comments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComments(response.data);
            updateCommentCount(response.data.length); // Update comment count
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }, [postId, updateCommentCount]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleCommentCreate = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`/api/posts/${postId}/comments`, { content: commentContent }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCommentContent('');
            fetchComments();
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/posts/${postId}/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleEditComment = async (commentId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/posts/${postId}/comments/${commentId}`, { content: commentContent }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCommentContent('');
            setEditingComment(null);
            fetchComments();
        } catch (error) {
            console.error('Error editing comment:', error);
        }
    };

    const handleCommentEditClick = (comment) => {
        setCommentContent(comment.content);
        setEditingComment(comment);
    };

    const handleCommentSubmit = async () => {
        if (editingComment) {
            await handleEditComment(editingComment._id);
        } else {
            await handleCommentCreate();
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="comments-section">
            <div className="comments-list">
                {comments.map(comment => (
                    <div key={comment._id} className="comment">
                        <p><strong>{comment.user.username}:</strong> {comment.content}</p>
                        <p className="comment-date">Updated at: {formatDate(comment.updatedAt || comment.createdAt)}</p>
                        <div className="comment-actions">
                            {comment.user._id === user._id && (
                                <>
                                    <button onClick={() => handleCommentEditClick(comment)}><FaEdit /> Edit</button>
                                    <button onClick={() => handleDeleteComment(comment._id)}><FaTrashAlt /> Delete</button>
                                </>
                            )}
                            {comment.user._id !== user._id && user._id === postUserId && (
                                <button onClick={() => handleDeleteComment(comment._id)}><FaTrashAlt /> Delete</button>
                            )}
                        </div>
                    </div>
                ))}
                <textarea
                    placeholder="Write a comment..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                ></textarea>
                <button onClick={handleCommentSubmit} className="submit-comment">
                    {editingComment ? 'Save Changes' : 'Submit'}
                </button>
            </div>
        </div>
    );
};

export default Comments;
