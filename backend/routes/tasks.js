const express = require('express');
const TaskList = require('../models/Tasks');

const router = express.Router();

const auth = (req, res) => {
    if (!req.session.user) {
        res.status(401).json({ message: 'Not authenticated' });
        return false;
    }
    return true;
};

// Get or create the user's task list
async function getUserList(userId) {
    let list = await TaskList.findOne({ user: userId });
    if (!list) list = await TaskList.create({ user: userId, title: 'My Tasks' });
    return list;
}

// Auto-refresh check
function shouldRefresh(list) {
    if (list.refreshMode === 'never') return false;
    const now = new Date();
    const last = new Date(list.lastRefreshed);
    if (list.refreshMode === 'daily') {
        return now.toDateString() !== last.toDateString();
    }
    if (list.refreshMode === 'weekly') {
        return (now - last) >= 7 * 24 * 60 * 60 * 1000;
    }
    if (list.refreshMode === 'monthly') {
        return now.getMonth() !== last.getMonth() || now.getFullYear() !== last.getFullYear();
    }
    return false;
}

// GET /api/tasks
router.get('/tasks', async (req, res) => {
    if (!auth(req, res)) return;
    try {
        const list = await getUserList(req.session.user.id);
        if (shouldRefresh(list)) {
            list.tasks.forEach(t => t.completed = false);
            list.lastRefreshed = new Date();
            await list.save();
        }
        res.json({ tasks: list.tasks, refreshMode: list.refreshMode, archivedLists: list.archivedLists });
    } catch (e) { res.status(400).json({ message: e.message }); }
});

// POST /api/tasks — add a task
router.post('/tasks', async (req, res) => {
    if (!auth(req, res)) return;
    try {
        const { title, description } = req.body;
        const list = await getUserList(req.session.user.id);
        list.tasks.push({ title, description, completed: false });
        await list.save();
        const newTask = list.tasks[list.tasks.length - 1];
        res.status(201).json(newTask);
    } catch (e) { res.status(400).json({ message: e.message }); }
});
// PATCH /api/tasks/refresh-mode
router.patch('/tasks/refresh-mode', async (req, res) => {
    if (!auth(req, res)) return;
    try {
        const list = await getUserList(req.session.user.id);
        list.refreshMode = req.body.refreshMode;
        await list.save();
        res.json({ refreshMode: list.refreshMode });
    } catch (e) { res.status(400).json({ message: e.message }); }
});

// POST /api/tasks/save-list — archive current list as a snapshot
router.post('/tasks/save-list', async (req, res) => {
    if (!auth(req, res)) return;
    try {
        const list = await getUserList(req.session.user.id);
        const snapshot = {
            savedAt: new Date(),
            tasks: list.tasks.map(t => ({ title: t.title, completed: t.completed })),
            completed: list.tasks.filter(t => t.completed).length,
            total: list.tasks.length,
        };
        list.archivedLists.unshift(snapshot);
        await list.save();
        res.json({ archivedList: list.archivedLists[0] });
    } catch (e) { res.status(400).json({ message: e.message }); }
});
// PATCH /api/tasks/:taskId — toggle complete or edit
router.patch('/tasks/:taskId', async (req, res) => {
    if (!auth(req, res)) return;
    try {
        const list = await getUserList(req.session.user.id);
        const task = list.tasks.id(req.params.taskId);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        if (req.body.completed !== undefined) task.completed = req.body.completed;
        if (req.body.title !== undefined) task.title = req.body.title;
        if (req.body.description !== undefined) task.description = req.body.description;
        await list.save();
        res.json(task);
    } catch (e) { res.status(400).json({ message: e.message }); }
});

// DELETE /api/tasks/:taskId
router.delete('/tasks/:taskId', async (req, res) => {
    if (!auth(req, res)) return;
    try {
        const list = await getUserList(req.session.user.id);
        list.tasks.pull({ id: req.params.taskId });
        await list.save();
        res.json({ message: 'Task deleted' });
    } catch (e) { res.status(400).json({ message: e.message }); }
});



module.exports = router;