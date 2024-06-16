const Tracker = require('../model/tracker');

exports.getExpenses = async (req) => {
    try {
        const userId = req.user.id; 
        const expenses = await Tracker.find({ userId }); 
        return expenses;
    } catch (error) {
        console.error('Error fetching expenses:', error);
        throw error;
    }
};
