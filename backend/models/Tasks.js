const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tasksSchema = new Schema({
    title: {type: String, required: true},
    description: { type: String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, 
{ timestamps: true });


const Tasks = mongoose.model('Tasks', tasksSchema);

module.exports = Tasks;