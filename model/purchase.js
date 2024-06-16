const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    orderid: String,
    paymentid: String,
    status: String,
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
