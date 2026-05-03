const express = require('express');
const Task = require ('../models/Tasks');

const router = express.Router();
// create task
router.post('/tasks', async (req, res) => {
    if(!req.session.user){
        res.status(401).json({message: 'Not authenticated'});
        return;
    }
    try {
        const { title, description } = req.body;
        const task = await Task.create({ title, description, user: req.session.user.id });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

});

// get tasks
router.get('/tasks', async (req, res) => {
    if(!req.session.user){
        res.status(401).json({message: 'Not authenticated'});
        return;
    }   
    try {
        const tasks = await Task.find({ user: req.session.user.id });
        res.json({ tasks });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;