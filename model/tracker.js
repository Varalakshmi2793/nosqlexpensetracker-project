const mongoose = require('mongoose');
const { Schema } = mongoose;

const trackerSchema = new Schema({
    expenseamount: Number,
    description: String,
    category: String,
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Tracker = mongoose.model('Tracker', trackerSchema);

module.exports = Tracker;
