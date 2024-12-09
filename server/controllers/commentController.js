const Comment = require('../models/Comment');
const Post = require('../models/Post');

console.log('Comment Controller Loaded'); // Debug log

// Function to create a new comment
const createComment = async (req, res) => {
    const { content } = req.body;
    const { postId } = req.params;
    try {
        console.log('Attempting to create comment for post:', postId); // Debug log
        console.log('Comment content:', content); // Debug log

        const comment = new Comment({
            user: req.user.id,
            post: postId,
            content
        });
        await comment.save();
        console.log('Comment saved:', comment); // Debug log

        const post = await Post.findById(postId);
        console.log('Fetched post:', post); // Debug log

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (!post.comments) {
            post.comments = [];
        }

        post.comments.push(comment._id); // Ensure post object is correctly populated
        await post.save();
        console.log('Post updated with new comment:', post); // Debug log

        res.status(201).json(comment);
    } catch (error) {
        console.error('Error creating comment:', error); // Debug log
        res.status(500).json({ message: 'Error creating comment', error });
    }
};

// Function to get comments for a post
const getComments = async (req, res) => {
    const { postId } = req.params;
    try {
        console.log('Fetching comments for post:', postId); // Debug log
        const comments = await Comment.find({ post: postId }).populate('user', 'username');
        console.log('Comments fetched:', comments); // Debug log
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error); // Debug log
        res.status(500).json({ message: 'Error fetching comments', error });
    }
};

// Function to delete a comment
const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        // Check if the user is authorized to delete the comment
        const post = await Post.findById(comment.post);
        if (comment.user.toString() !== req.user.id && post.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        await Comment.deleteOne({ _id: commentId }); // Correctly use deleteOne
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error); // Debug log
        res.status(500).json({ message: 'Error deleting comment', error });
    }
};

// Function to edit a comment
const editComment = async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    try {
        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        comment.content = content;
        comment.updatedAt = new Date();
        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        console.error('Error editing comment:', error); // Debug log
        res.status(500).json({ message: 'Error editing comment', error });
    }
};

console.log('Comment Controller Functions Defined'); // Debug log

module.exports = {
    createComment,
    getComments,
    deleteComment,
    editComment
};
