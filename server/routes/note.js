const express = require('express');
const router = express.Router();
const { addNote, getNotes, getNoteById, updateNote, deleteNote } = require('../controllers/noteController');
const protect = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, addNote)
    .get(protect, getNotes);

router.route('/:id')
    .get(protect, getNoteById)
    .put(protect, updateNote)
    .delete(protect, deleteNote);

module.exports = router;
