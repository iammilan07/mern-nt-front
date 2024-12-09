const Post = require('../models/Post');

// Function to create a new post
const createPost = async (req, res) => {
    const { content } = req.body;
    try {
        const post = new Post({ user: req.user.id, content });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error });
    }
};

// Function to get all posts
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('user', 'username');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
};

// Function to delete a post
const deletePost = async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        await Post.deleteOne({ _id: postId });
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error });
    }
};

// Function to update a post
const updatePost = async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (post.user.toString() !== req.user.id) return res.status(401).json({ message: 'Unauthorized' });
        post.content = content;
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error updating post', error });
    }
};

module.exports = {
    createPost,
    getPosts,
    deletePost,
    updatePost
};
