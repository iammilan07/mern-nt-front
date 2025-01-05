const express = require('express');
const { createComment, getComments, deleteComment, editComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');


const router = express.Router({ mergeParams: true });



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


module.exports = router;
