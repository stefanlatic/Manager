const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contactSchema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, 
{ timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;