const express = require('express');
const postController = require('../controllers/postController'); // Import the entire controller module
const protect = require('../middleware/authMiddleware'); // Import protect middleware


// Extract functions from the postController
const { createPost, getPosts, deletePost, updatePost } = postController;


const router = express.Router();

// Log to verify route registration process
router.route('/').post(protect, createPost).get(getPosts);
// console.log('Route / registered for POST and GET'); // Debug log

router.route('/:postId').delete(protect, deletePost).put(protect, updatePost);
// console.log('Route /:postId registered for DELETE and PUT'); // Debug log

// console.log('Post Routes Defined'); // Debug log

module.exports = router;
