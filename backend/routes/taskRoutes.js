
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

router.get('/', protect, getTasks);
router.get('/available', protect, getAvailableTasks);

router.post('/', protect, addTask);

router.put('/:id/accept', protect, acceptTask);
router.put('/:id/complete', protect, completeTask);

router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;
