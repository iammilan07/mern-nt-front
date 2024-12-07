const Note = require('../models/Note');

// Add a new note (text or voice)
const addNote = async (req, res) => {
    const { title, description, audioUrl, color, noteType } = req.body;
    const userId = req.user.id;
    // console.log(req.body);

    try {
        const newNote = new Note({
            title,
            description,
            audioUrl,
            color,
            noteType,
            user: userId
        });

        await newNote.save();
        res.status(201).json(newNote);
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({ message: 'Failed to add note' });
    }
};

// Get all notes for the logged-in user
const getNotes = async (req, res) => {
    const userId = req.user.id;

    try {
        const notes = await Note.find({ user: userId });
        res.status(200).json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ message: 'Failed to fetch notes' });
    }
};

// Get a note by ID
const getNoteById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const note = await Note.findOne({ _id: id, user: userId });
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json(note);
    } catch (error) {
        console.error('Error fetching note:', error);
        res.status(500).json({ message: 'Failed to fetch note' });
    }
};

// Update a note
const updateNote = async (req, res) => {
    const { id } = req.params;
    const { title, description, audioUrl, color, noteType } = req.body;
    const userId = req.user.id;

    try {
        const note = await Note.findOneAndUpdate(
            { _id: id, user: userId },
            { title, description, audioUrl, color, noteType, updatedAt: Date.now() },
            { new: true }
        );
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json(note);
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ message: 'Failed to update note' });
    }
};

// Delete a note
const deleteNote = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const note = await Note.findOneAndDelete({ _id: id, user: userId });
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status500.json({ message: 'Failed to delete note' });
    }
};

module.exports = { addNote, getNotes, getNoteById, updateNote, deleteNote };
