const express = require('express');
const { createComment, getComments, deleteComment, editComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

console.log('Comment Routes Loaded'); // Debug log

const router = express.Router({ mergeParams: true });

console.log('createComment:', createComment);
console.log('getComments:', getComments);
console.log('deleteComment:', deleteComment);
console.log('editComment:', editComment);
console.log('protect:', protect);

if (!createComment) {
    console.log('createComment is undefined');
}

if (!getComments) {
    console.log('getComments is undefined');
}

if (!deleteComment) {
    console.log('deleteComment is undefined');
}

if (!editComment) {
    console.log('editComment is undefined');
}

if (!protect) {
    console.log('protect is undefined');
}

router.route('/').post(protect, createComment).get(protect, getComments);
router.route('/:commentId').delete(protect, deleteComment).put(protect, editComment);

console.log('Comment Routes Defined'); // Debug log

module.exports = router;
