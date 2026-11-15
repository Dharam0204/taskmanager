
const Task = require('../models/Task');

const getTasks = async (req, res) => {
    try {
        const role = req.user.role || 'helpSeeker';

        let filter;

        if (role === 'helper') {
            filter = {
                acceptedBy: req.user.id,
                status: { $in: ['accepted', 'completed'] }
            };
        } else {
            filter = { userId: req.user.id };
        }

        const tasks = await Task.find(filter);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAvailableTasks = async (req, res) => {
    try {
        if ((req.user.role || 'helpSeeker') !== 'helper') {
            return res.status(403).json({
                message: 'Only Helpers can browse available requests'
            });
        }

        const tasks = await Task.find({
            userId: { $ne: req.user.id },
            acceptedBy: null,
            status: 'available'
        }).populate('userId', 'name');

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addTask = async (req, res) => {
    try {
        if ((req.user.role || 'helpSeeker') !== 'helpSeeker') {
            return res.status(403).json({
                message: 'Only Help Seekers can create requests'
            });
        }

        const { title, description, category, deadline } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ message: 'Request title is required' });
        }

        const task = await Task.create({
            userId: req.user.id,
            title: title.trim(),
            description,
            category,
            deadline,
            status: 'available',
            acceptedBy: null,
            completed: false
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        if ((req.user.role || 'helpSeeker') !== 'helpSeeker') {
            return res.status(403).json({
                message: 'Only Help Seekers can update their requests'
            });
        }

        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.acceptedBy || task.status === 'accepted' || task.status === 'completed') {
            return res.status(400).json({
                message: 'An accepted or completed request cannot be edited'
            });
        }

        const { title, description, category, deadline } = req.body;

        if (title !== undefined) {
            if (!title.trim()) {
                return res.status(400).json({ message: 'Request title is required' });
            }
            task.title = title.trim();
        }

        if (description !== undefined) task.description = description;
        if (category !== undefined) task.category = category;
        if (deadline !== undefined) task.deadline = deadline;

        const updatedTask = await task.save();
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        if ((req.user.role || 'helpSeeker') !== 'helpSeeker') {
            return res.status(403).json({
                message: 'Only Help Seekers can delete their requests'
            });
        }

        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.acceptedBy || task.status === 'accepted' || task.status === 'completed') {
            return res.status(400).json({
                message: 'An accepted or completed request cannot be deleted'
            });
        }

        await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        res.status(200).json({ message: 'Request deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const acceptTask = async (req, res) => {
    try {
        if ((req.user.role || 'helpSeeker') !== 'helper') {
            return res.status(403).json({
                message: 'Only Helpers can accept requests'
            });
        }

        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: { $ne: req.user.id },
                acceptedBy: null,
                status: 'available'
            },
            {
                $set: {
                    acceptedBy: req.user.id,
                    status: 'accepted',
                    completed: false
                }
            },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({
                message: 'Request is unavailable or has already been accepted'
            });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const completeTask = async (req, res) => {
    try {
        if ((req.user.role || 'helpSeeker') !== 'helper') {
            return res.status(403).json({
                message: 'Only Helpers can complete accepted requests'
            });
        }

        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                acceptedBy: req.user.id,
                status: 'accepted'
            },
            {
                $set: {
                    status: 'completed',
                    completed: true
                }
            },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({
                message: 'Accepted request not found'
            });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTasks,
    getAvailableTasks,
    addTask,
    updateTask,
    deleteTask,
    acceptTask,
    completeTask
};
