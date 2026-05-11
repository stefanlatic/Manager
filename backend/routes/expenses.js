const express = require('express');
const Expenses = require('../models/Expenses');
const User = require('../models/User');
const router = express.Router();

const auth = (req, res) => {
    if (!req.session.user) {
        res.status(401).json({ message: 'Not authenticated' });
        return false;
    }
    return true;
};

// GET all expenses + income
router.get('/expenses', async (req, res) => {
    if (!auth(req, res)) return;
    try {
        const expenses = await Expenses.find({ user: req.session.user.id });
        const user = await User.findById(req.session.user.id);
        res.json({ expenses, income: user.income });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST new expense
router.post('/expenses', async (req, res) => {
    if (!auth(req, res)) return;
    try {
        const { total, content } = req.body;
        const expense = await Expenses.create({ total, content, user: req.session.user.id });
        res.status(201).json(expense);
    } catch (e) { res.status(500).json({ message: e.message }); }
});
// PATCH save income
router.patch('/expenses/income', async (req, res) => {
    if (!auth(req, res)) return;
    try {
        const user = await User.findByIdAndUpdate(
            req.session.user.id,
            { income: req.body.income },
            { new: true }
        );
        res.json({ income: user.income });
    } catch (e) { res.status(500).json({ message: e.message }); }
});
// PATCH edit expense
router.patch('/expenses/:id', async (req, res) => {
    if (!auth(req, res)) return;
    try {
        const expense = await Expenses.findOneAndUpdate(
            { _id: req.params.id, user: req.session.user.id },
            { total: req.body.total, content: req.body.content },
            { new: true }
        );
        if (!expense) return res.status(404).json({ message: 'Not found' });
        res.json(expense);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// DELETE one expense
router.delete('/expenses/:id', async (req, res) => {
    if (!auth(req, res)) return;
    try {
        await Expenses.findOneAndDelete({ _id: req.params.id, user: req.session.user.id });
        res.json({ message: 'Deleted' });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// DELETE all expenses
router.delete('/expenses', async (req, res) => {
    if (!auth(req, res)) return;
    try {
        await Expenses.deleteMany({ user: req.session.user.id });
        res.json({ message: 'All deleted' });
    } catch (e) { res.status(500).json({ message: e.message }); }
});



module.exports = router;