const express = require('express');
const Expenses = require('../models/Expenses');

const router = express.Router();

router.post('/expenses', async (req, res) => {
    if (!req.session.user) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
    }
    try {
        const { total, content } = req.body;
        const expense = new Expenses({ total, content, user: req.session.user.id });
        await expense.save();
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: 'Error creating expense' });
    }
});

router.get('/expenses', async (req, res) => {
    if (!req.session.user) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
    }
    try {
        const expenses = await Expenses.find({ user: req.session.user.id });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expenses' });
    }
});

module.exports = router;