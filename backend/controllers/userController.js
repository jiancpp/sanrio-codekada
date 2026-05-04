const User = require('../models/User');

exports.registerUser = async(req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// Get all family members by code
exports.getFamily = async(req, res) => {
    try {
        const members = await User.find({ familyCode: req.params.code });
        res.json(members);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.functionTemplate = async(req, res) => {
    try {
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}