const mongoose = require('mongoose');
const Comment = require('./Comment');

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

postSchema.pre('remove', async function (next) {
    try {
        await Comment.deleteMany({ post: this._id });
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Post', postSchema);
