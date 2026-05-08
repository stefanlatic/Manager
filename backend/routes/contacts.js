const express = require('express');
const Contact = require('../models/Contacts');
const router = express.Router();

// Create a new contact

router.post('/contacts', async (req, res) => {
    if(!req.session.user){
        res.status(401).json({message: 'Not authenticated'});
        return;
    }
    try {
        const { name, phone, date } = req.body;
        const contact = await Contact.create({ name, phone, date, user: req.session.user.id });
        res.status(201).json(contact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all contacts

router.get('/contacts', async (req, res) => {
    if(!req.session.user){
        res.status(401).json({message: 'Not authenticated'});
        return;
    }
    try {
        const contacts = await Contact.find({ user: req.session.user.id });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
});

module.exports = router;
