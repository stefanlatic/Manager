const express = require('express');
const Habbits = require('../models/Habbits');

const router = express.Router();

// create habbit

router.post('/habbits', async (req, res) => {
    if(!req.session.user){
        res.status(401).json({message: 'Not authenticated'});
        return;
    }
    try {
        const { title } = req.body;
        const habbit = await Habbits.create({ title, user: req.session.user.id });
        res.status(201).json(habbit);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// get habbits

router.get('/habbits', async (req, res) => {
    if(!req.session.user){
        res.status(401).json({message: 'Not authenticated'});
        return;
    }
    try {
        const habbits = await Habbits.find({ user: req.session.user.id });
        res.json({ habbits });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;