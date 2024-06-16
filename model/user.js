const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    ispremiumuser: { type: Boolean, default: false },
    totalexpense: { type: Number, default: 0 }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
