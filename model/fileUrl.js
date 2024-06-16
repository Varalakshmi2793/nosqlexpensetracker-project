
const mongoose = require('mongoose');
const { Schema } = mongoose;

const fileUrlSchema = new Schema({
    url: String,
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const FileUrl = mongoose.model('FileUrl', fileUrlSchema);

module.exports = FileUrl;
