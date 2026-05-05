const Family = require('../models/Family');
const User = require('../models/User');

exports.createFamily = async (req, res) => {
    try {
        const { familyName, userId } = req.body;

        let familyCode;
        let isUnique = false;

        while (!isUnique) {
            // Generate a 6-character code
            familyCode = Math.floor(100000 + Math.random() * 900000).toString();
            const existing = await Family.findOne({ familyCode });
            if (!existing) {
                isUnique = true;
            }
        }

        const newFamily = new Family({
            familyCode,
            familyName,
            members: [userId]
        });

        await newFamily.save();
        // Update user to have this family code
        await User.findByIdAndUpdate(userId, { familyCode });

        res.status(201).json({ message: "Family created!", family: newFamily });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.joinFamily = async (req, res) => {
    try {
        const { userId, familyCode } = req.body;

        const family = await Family.findOne({ familyCode });
        if (!family) {
            return res.status(404).json({ error: "Invalid invite code" });
        }

        const user = await User.findById(userId);
        if (user.familyCode) {
            return res.status(400).json({ error: "You are already in a family!" });
        }

        if (!family.members.includes(userId)) {
            family.members.push(userId);
            await family.save();
        }

        user.familyCode = familyCode;
        await user.save();

        res.status(200).json({ message: `Welcome to ${family.familyName}`, familyCode});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.updateFamilyName = async (req, res) => {
    try {
        const { familyCode, userId, newFamilyName } = req.body;

        const family = await Family.findOne({ familyCode });
        if (!family) {
            return res.status(404).json({ error: "Family not found!" });
        }

        if (family.members[0].toString() !== userId) {
            return res.status(403).json({ error: "Only the creator can change the family name!" });
        }

        family.familyName = newFamilyName;
        await family.save();

        res.status(200).json({ message: "Family name updated successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}