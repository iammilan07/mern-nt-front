const express = require('express');
const { createComment, getComments } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

console.log('Comment Routes Loaded'); // Debug log

const router = express.Router({ mergeParams: true });

console.log('createComment:', createComment);
console.log('getComments:', getComments);
console.log('protect:', protect);

if (!createComment) {
    console.log('createComment is undefined');
}

if (!getComments) {
    console.log('getComments is undefined');
}

if (!protect) {
    console.log('protect is undefined');
}

router.route('/').post(protect, createComment).get(getComments);

console.log('Comment Routes Defined'); // Debug log

module.exports = router;
