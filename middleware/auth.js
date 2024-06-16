const jwt = require('jsonwebtoken');
const User = require('../model/user');
const { promisify } = require('util');

const verifyToken = promisify(jwt.verify);

const authenticateToken = async (req, res, next) => {
    try {
        const token = req.header('Authorization');

        if (!token) {
            console.error('Token is missing from request headers');
            return res.sendStatus(401);
        }

        console.log('Received token:', token);
        const decoded = await verifyToken(token, process.env.SECRETKEY);

        console.log('Decoded token:', decoded);

        // Check if user still exists and fetch updated user details
        const user = await User.findById(decoded.userId);
        if (!user) {
            console.error('User not found for decoded user ID:', decoded.userId);
            return res.sendStatus(401);
        }

        // Update req.user with the latest user details (optional)
        req.user = user;

        next();
    } catch (error) {
        console.error('Error authenticating token:', error);
        return res.sendStatus(401);
    }
};

module.exports = {
    authenticateToken: authenticateToken
};
