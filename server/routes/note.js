const express = require('express');
const router = express.Router();
const { addNote, getNotes, getNoteById, updateNote, deleteNote } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware'); // Ensure correct import

if (!addNote) {
    console.log('addNote is undefined');
}

if (!getNotes) {
    console.log('getNotes is undefined');
}

if (!getNoteById) {
    console.log('getNoteById is undefined');
}

if (!updateNote) {
    console.log('updateNote is undefined');
}

if (!deleteNote) {
    console.log('deleteNote is undefined');
}

if (!protect) {
    console.log('protect is undefined');
}

router.route('/')
    .post(protect, addNote)
    .get(protect, getNotes);

router.route('/:id')
    .get(protect, getNoteById)
    .put(protect, updateNote)
    .delete(protect, deleteNote);


module.exports = router;
