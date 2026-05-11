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
// Edit reminder
router.patch('/reminders/:id', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
        const { title, content, date } = req.body;

        const reminder = await Reminder.findOneAndUpdate(
            { _id: req.params.id, user: req.session.user.id },
            { title, content, date },
            { new: true }
        );

        if (!reminder) {
            return res.status(404).json({ message: 'Reminder not found' });
        }

        res.json(reminder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Delete reminder
router.delete('/reminders/:id', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
        await Reminder.findOneAndDelete({
            _id: req.params.id,
            user: req.session.user.id
        });

        res.json({ message: 'Reminder deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
module.exports = router;