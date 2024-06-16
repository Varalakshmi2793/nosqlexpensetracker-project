const Tracker = require('../model/tracker');
const User = require('../model/user');
const S3service = require('../services/S3services');
const UserServices = require('../services/userservices');
const FileUrl = require('../model/fileUrl');
const mongoose = require('mongoose');
exports.download = async (req, res) => {
    try {
        const userId = req.user._id;
        const expenses = await UserServices.getExpenses(req);
        const stringifyExpenses = JSON.stringify(expenses);
        const filename = `Tracker${req.user._id}/${new Date()}.txt`;

        const fileURL = await S3service.uploadtoS3(stringifyExpenses, filename);

        console.log('File URL:', fileURL);

        await FileUrl.create({ url: fileURL, userId: userId });
        res.status(200).json({ fileURL, success: true });
    } catch (err) {
        console.error('Error in file download:', err);
        res.status(500).json({ message: "Error in file download", error: err });
    }
};

exports.fetchUrls = async (req, res) => {
    try {
        const userId = req.user._id;
        const urlFiles = await FileUrl.find({ userId });
        if (urlFiles.length > 0) {
            res.status(200).json({ urlFiles, message: "URLs fetched from the database" });
        } else {
            res.status(404).json({ message: "No URLs found for the user" });
        }
    } catch (err) {
        console.error("Error fetching URLs:", err);
        res.status(500).json({ message: 'Failed to fetch URLs', error: err });
    }
};

exports.createtracker = async (req, res) => {
    try {
        const { expenseamount, description, category } = req.body;
        const userId = req.user._id;
        let totalexpense = req.user.totalexpense;
        let totalExpenseNum = parseInt(totalexpense || 0);
        const expenseAmountNum = parseInt(expenseamount);

        totalExpenseNum += expenseAmountNum;

        const expensedetails = new Tracker({
            expenseamount,
            description,
            category,
            userId
        });

        await expensedetails.save();
        await User.findByIdAndUpdate(userId, { totalexpense: totalExpenseNum });

        res.status(201).json({ message: 'Expense created successfully', expense: expensedetails });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create expense' });
    }
};

exports.getallexpense = async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const count = await Tracker.countDocuments({ userId });
        const expenses = await Tracker.find({ userId }).skip(skip).limit(limit);

        const totalPages = Math.ceil(count / limit);

        res.status(200).json({
            expenses,
            totalExpenses: count,
            totalPages,
            currentPage: page
        });
    } catch (err) {
        console.error('Error fetching expenses:', err);
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
};
exports.deletetracker = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user._id;
        console.log(id)
        console.log(userId);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid tracker ID' });
        }
        const tracker = await Tracker.findById(id);
        console.log(tracker);

        if (!tracker || tracker.userId.toString() !== userId.toString()) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        const expenseAmount = tracker.expenseamount;
        const totalExpenseNum = Number(req.user.totalexpense) - Number(expenseAmount);
        await User.findByIdAndUpdate(userId, { totalexpense: totalExpenseNum });

        await Tracker.deleteOne({ _id: id });
 
        res.json({ message: 'Expense deleted successfully' });
    } catch (err) {
        console.error('Error deleting expense:', err);
        res.status(500).json({ error: 'Failed to delete expense' });
    }
};