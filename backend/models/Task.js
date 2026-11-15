
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    category: {
        type: String,
        enum: ['Gardening', 'Shopping', 'Transport', 'General Help'],
        default: 'General Help'
    },
    completed: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['available', 'accepted', 'completed'],
        default: 'available'
    },
    acceptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    deadline: {
        type: Date
    }
});

module.exports = mongoose.model('Task', taskSchema);
