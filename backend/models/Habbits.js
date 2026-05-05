const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const habbitsSchema = new Schema({
    title: {type: String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, 
{ timestamps: true });  

const Habbits = mongoose.model('Habbits', habbitsSchema);

module.exports = Habbits;
