
const mongoose = require('mongoose');
const { Schema } = mongoose;

const forgetPasswordSchema = new Schema({
    id: String,
    isactive: { type: Boolean, default: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const ForgetPassword = mongoose.model('ForgetPassword', forgetPasswordSchema);

module.exports = ForgetPassword;
