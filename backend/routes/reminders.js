const express = require('express');
const router = express.Router();

const Reminder = require('../models/Reminder');

// Create a new reminder

router.post('/reminders', async (req, res) => {
    if(!req.session.user){
        res.status(401).json({message: 'Not authenticated'});
        return;
    }   
    try {
        const { title, content, date } = req.body;
        const reminder = await Reminder.create({ title, content, date, user: req.session.user.id });
        res.status(201).json(reminder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all reminders 

router.get('/reminders', async (req, res) => {
    if(!req.session.user){
        res.status(401).json({message: 'Not authenticated'});
        return;
    }
    try {
        const reminders = await Reminder.find({ user: req.session.user.id });
        res.json(reminders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;