const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * POST - Create new User document in the database
 * 
 * @notes required fields: name, familyCode, password, role
 * @param {*} req 
 * @param {*} res 
 */
exports.registerUser = async(req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

/**
 * GET - Get all family members
 * 
 * @param {*} req 
 * @param {*} res
 */
exports.getFamily = async(req, res) => {
    try {
        const members = await User.find({ familyCode: req.params.code });
        res.json(members);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/************************* Functions ****************************/

exports.loginUser = async(req, res) => {
    try {
        const { name, familyCode, password } = req.body;
        const user = await User.findOne({ name, familyCode });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1w' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                familyCode: user.familyCode,
                role: user.role
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.editMemberInfo = async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { birthdate, bloodType, allergies, medicalConditions } = req.body;

        user.birthdate = birthdate || user.birthdate;
        user.bloodType = bloodType || user.bloodType;
        user.allergies = allergies || user.allergies;
        user.medicalConditions = medicalConditions || user.medicalConditions;

        await user.save();
        res.status(200).json(user);
        
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