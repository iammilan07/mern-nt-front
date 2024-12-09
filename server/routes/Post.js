const express = require('express');
const postController = require('../controllers/postController'); // Import the entire controller module
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware correctly

// Extract functions from the postController
const { createPost, getPosts, deletePost, updatePost } = postController;

const router = express.Router();

// Log to verify route registration process
router.route('/').post(protect, createPost).get(getPosts);
router.route('/:postId').delete(protect, deletePost).put(protect, updatePost);

module.exports = router;
