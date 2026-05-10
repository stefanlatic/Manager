const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    completed: { type: Boolean, default: false }
});

const archivedTaskSchema = new Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

const tasksSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    title: { type: String, default: 'My Tasks' },

    tasks: [taskSchema],

    refreshMode: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'never'],
        default: 'never'
    },

    lastRefreshed: {
        type: Date,
        default: Date.now
    },

    archivedLists: [{
        savedAt: { type: Date, default: Date.now },
        tasks: [archivedTaskSchema],
        completed: Number,
        total: Number
    }]
}, { timestamps: true });

module.exports = mongoose.model('Tasks', tasksSchema);