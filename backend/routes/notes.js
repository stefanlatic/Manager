const express = require('express');
const Note = require('../models/Note');

const router = express.Router();

router.post('/notes', async (req, res) => {
   
        if (!req.session.user) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        try{
        const { title, content } = req.body;

        const note = await Note.create({title, content, user: req.session.user.id});      
        res.json(note);

    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

router.get('/notes', async (req, res) => {
        if (!req.session.user) {
             res.status(401).json({ message: 'Not authenticated' });
            return;
        }
          try {
            const notes = await Note.find({user: req.session.user.id});
            res.json({notes});
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

module.exports = router;