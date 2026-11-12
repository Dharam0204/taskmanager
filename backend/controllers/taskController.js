const Task = require('../models/Task');
const getTasks = async(req,res)=>{
    try{
        const tasks = await Task.find({userId:req.user.id});
        req.json(tasks);
    }catch(error){
        res.status(500).json({message:error.message});
}
};

    const addTasks = async(req,res)=>{
        const {title, description, deadline} = req.body;
        try{
            const tasks = await Task.create({userId:req.user.id, title, description, deadline});
            res.status(201).json(task);
        }catch(error){
            res.status(500).json({message:error.message});
    }
    };

const updateTasks = async(req,res)=>{
    const {title, description, completed, deadline} = req.body;
    try{
        const tasks = await Task.findByID(req.params.id);
        if(!task)return res.status(404).json({message:'Task not found'});
        task.title = title || task.title;
        task.description = description || task.description;
        task.completed = completed ?? task.completed;
        task.deadline = deadline || task.deadline;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({message:error.message});
}
};

const deleteTasks = async(req,res)=>{
        try{
            const tasks = await Task..findByID(req.params.id);
             if(!task)return res.status(404).json({message:'Task not found'});
            await task.remove();
            res.json({message:'Task deleted'});
        }catch(error){
            res.status(500).json({message:error.message});
    }
    };

module.exports = { getTask, addTask, updateTask, deleteTask };