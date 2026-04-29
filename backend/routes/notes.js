const express = require('express');
const Note = require('../models/Note');

const router = express.Router();

router.post('/notes', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const { title, content } = req.body;

        const note = new Note({
            title,
            content,
            user: req.session.userId
        });

        await note.save();

        res.status(201).json(note);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/notes', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const notes = await Note.find({ user: req.session.userId })
                                .sort({ createdAt: -1 });

        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;