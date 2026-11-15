
const express = require('express');

const {
    getTasks,
    getAvailableTasks,
    addTask,
    updateTask,
    deleteTask,
    acceptTask,
    completeTask
} = require('../controllers/taskController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// View the logged-in user's requests or accepted requests
router.get('/', protect, getTasks);

// Browse requests available to Helpers
router.get('/available', protect, getAvailableTasks);

// Create a new help request
router.post('/', protect, addTask);

// Accept a request
router.put('/:id/accept', protect, acceptTask);

// Mark an accepted request as completed
router.put('/:id/complete', protect, completeTask);

// Update or delete an existing request
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;
