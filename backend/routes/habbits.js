const express = require('express');
const Habbits = require('../models/Habbits');
const router = express.Router();

const auth = (req, res) => {
    if (!req.session.user) {
        res.status(401).json({ message: 'Not authenticated' });
        return false;
    }
    return true;
};

async function getUserHabbits(userId) {
    let list = await Habbits.findOne({ user: userId });

    if (!list) {
        list = await Habbits.create({
            user: userId
        });
    }

    return list;
}
//refresh check
function shouldRefresh(list) {
    const now = new Date();
    const last = new Date(list.lastRefreshed);

    if (list.refreshMode === 'daily') {
        return now.toDateString() !== last.toDateString();
    }

    if (list.refreshMode === 'weekly') {
        return (now - last) >= 7 * 24 * 60 * 60 * 1000;
    }

    if (list.refreshMode === 'monthly') {
        return now.getMonth() !== last.getMonth()
    }

    return false;
}
//GET
router.get('/habbits', async (req, res) => {
    if (!auth(req, res)) return;
    try {
        const list = await getUserHabbits(req.session.user.id);

        if (shouldRefresh(list)) {
            list.habits.forEach(h => h.completed = false);
            list.lastRefreshed = new Date();
            await list.save();
        }

        res.json({
            habbits: list.habits,
            refreshMode: list.refreshMode
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
//POST add
router.post('/habbits', async (req, res) => {
     if (!auth(req, res)) return;
    const list = await getUserHabbits(req.session.user.id);

    list.habits.push({
        title: req.body.title
    });

    await list.save();

    res.status(201).json(list.habits[list.habits.length - 1]);
});

//refresh mode
router.patch('/habbits/refresh-mode', async (req, res) => {
    if (!auth(req, res)) return;
    const list = await getUserHabbits(req.session.user.id);

    list.refreshMode = req.body.refreshMode;

    await list.save();

    res.json({
        refreshMode: list.refreshMode
    });
});

//PATCH toggle/edit
router.patch('/habbits/:id', async (req, res) => {
        if (!auth(req, res)) return;
    const list = await getUserHabbits(req.session.user.id);

    const habit = list.habits.id(req.params.id);

    if (!habit) {
        return res.status(404).json({ message: 'Habit not found' });
    }

    if (req.body.completed !== undefined) {
        habit.completed = req.body.completed;
    }

    if (req.body.title !== undefined) {
        habit.title = req.body.title;
    }

    await list.save();

    res.json(habit);
});
//DELETE
router.delete('/habbits/:id', async (req, res) => {
    if (!auth(req, res)) return;
    const list = await getUserHabbits(req.session.user.id);

    list.habits.pull({ _id: req.params.id });

    await list.save();

    res.json({ message: 'Deleted' });
});

module.exports = router;