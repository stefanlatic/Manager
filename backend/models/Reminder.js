const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reminderSchema = new Schema({
    title: {type: String, required: true},
    content: { type: String, required: true},
    date: { type: Date, required: true },
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, 
{ timestamps: true });  

const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;