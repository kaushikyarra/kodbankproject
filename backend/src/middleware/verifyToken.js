const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided. Please login.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Session expired. Please login again.'
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Invalid token. Please login.'
        });
    }
};

module.exports = verifyToken;
