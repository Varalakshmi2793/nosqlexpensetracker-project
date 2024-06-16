const User = require('../model/user');

exports.getLeaderboard = async (req, res) => {
    try {
        console.log('Fetching leaderboard data...');
        const usersLeaderboard = await User.find()
            .sort({ totalexpense: -1 })
            .select('username totalexpense')
            .exec();

        res.status(200).json({ success: true, leaderboard: usersLeaderboard });
    } catch (err) {
        console.error('Error fetching leaderboard:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
