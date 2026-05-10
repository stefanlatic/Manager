const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const habitItemSchema = new Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

const habitsSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    habits: [habitItemSchema],

    refreshMode: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        default: 'daily'
    },

    lastRefreshed: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Habbits = mongoose.model('Habbits', habitsSchema);

module.exports = Habbits;