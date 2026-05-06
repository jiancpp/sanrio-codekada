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
 * GET - Get one family member
 * 
 * @param {*} req 
 * @param {*} res
 */
exports.getMemberInfo = async(req, res) => {
    try {
        const { id } = req.params
        const member = await User.findById(id);

        if (!member) {
            return res.status(403).json({ message: "User not found "})
        }
        if (req.user.familyCode !== member.familyCode) {
            return res.status(403).json({ message: "Not authorized to see info"})
        }

        res.json(member);
    } catch (err) {
        res.status(500).json({ error: err.message });
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

/**
 * Handle user login and token
 * 
 * @param {*} req 
 * @param {*} res  
 */
exports.loginUser = async(req, res) => {
    try {
        // const { name, familyCode, password } = req.body;
        // const user = await User.findOne({ name, familyCode });

        const { email, password } = req.body;
        const user = await User.findOne({ email });

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
        // Check family code
        if (!req.user.familyCode) return res.status(403).json({ message: "Cannot edit. Not in a family yet." });

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isSelf = req.user._id.toString() === user._id.toString();
        const isManager = req.user.role === 'Manager'

        // Authorization Check
        if (!isSelf && !isManager) {
            return res.status(403).json({ message: "Not authorized to edit other family members." });
        }

        if (isManager && req.user.familyCode !== user.familyCode) {
            return res.status(403).json({ message: "You can only edit members of your own family." });
        }

        const { name, birthdate, bloodType, allergies, medicalConditions, maintenanceMeds } = req.body;

        user.name = name || user.name;
        user.birthdate = birthdate || user.birthdate;
        user.bloodType = bloodType || user.bloodType;
        user.allergies = allergies || user.allergies;
        user.medicalConditions = medicalConditions || user.medicalConditions;
        user.maintenanceMeds = maintenanceMeds || user.maintenanceMeds;

        await user.save();
        res.status(200).json(user);
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.template = async(req, res) => {
    try {

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}