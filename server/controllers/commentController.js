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

console.log('Comment Controller Functions Defined'); // Debug log

module.exports = {
    createComment,
    getComments
};
