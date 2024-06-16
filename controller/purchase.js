const Razorpay = require('razorpay');
const Order = require('../model/purchase');
const User = require('../model/user');
exports.createPurchase = async (req, res) => {
    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const amount = 10000; 
        const currency = 'INR';

        const order = await rzp.orders.create({ amount, currency });

        const userId = req.user._id;

        await Order.create({ orderid: order.id, status: 'PENDING', userId });

        res.status(201).json({ order, key_id: process.env.RAZORPAY_KEY_ID });
    } catch (error) {
        console.error('Error creating purchase:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

exports.transaction = async (req, res) => {
    try {
        const { payment_id, order_id } = req.body;

        const order = await Order.findOne({ orderid: order_id });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await Order.findByIdAndUpdate(order._id, { paymentid: payment_id, status: 'SUCCESSFUL' });

        await User.findByIdAndUpdate(req.user._id, { ispremiumuser: true });

        res.status(202).json({ success: true, message: 'Transaction successful' });
    } catch (error) {
        console.error('Error processing transaction:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
