const User = require('../models/User');
const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    const systemKey = req.headers['x-system-key'];

    // If the request has the secret system key, bypass the JWT check
    if (systemKey && systemKey === process.env.SYSTEM_SECRET_KEY) {
        req.user = { role: 'Manager', name: 'System' }; // Mock a manager user
        return next();
    }

    let token;
    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Attach user ID to the request object
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user no longer exists' });
            }
            return next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Role ${req.user.role} is not authorized to access this route` 
            });
        }
        next();
    }
}

module.exports = { protect, authorize };