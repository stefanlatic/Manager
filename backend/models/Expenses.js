const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const expensesSchema = new Schema({
    title: {type: String, required: true},
    content: { type: String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, 
{ timestamps: true });

const Expenses = mongoose.model('Expenses', expensesSchema);


module.exports = Expenses;