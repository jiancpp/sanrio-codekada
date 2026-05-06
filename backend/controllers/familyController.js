const Family = require('../models/Family');
const User = require('../models/User');
const words = ['PUSO', 'LAYA', 'BUHAY', 'TAHANAN', 'BIGAY', 'YAKAP', 'TULONG', 'LIGTAS'];

exports.createFamily = async (req, res) => {
    try {
        const { familyName, userId } = req.body;

        const word = words[Math.floor(Math.random() * words.length)];
        const nums = Math.floor(1000 + Math.random() * 9000);
        const familyCode = `${word}-${nums}`.trim().toUpperCase();

        const newFamily = await Family.create({
            familyCode,
            familyName,
            members: [userId]
        });

        await User.findByIdAndUpdate(userId, { familyCode });

        res.status(201).json({ message: "Family created!", family: newFamily });

    } catch (err) {
        // handle duplicate key error
        if (err.code === 11000) {
            return res.status(409).json({ error: "Code collision, retry request" });
        }

        res.status(500).json({ error: err.message });
    }
};

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

        res.status(200).json({ message: `Welcome to ${family.familyName}`, family});
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

exports.getFamily = async(req, res) => {
    try {
        if (req.user.familyCode !== req.params.code) {
            return res.status(400).json({ message: 'You are not part of this family' });
        }

        const family = await Family
            .findOne({ familyCode: req.params.code })
            .populate('members', '-password');

        if (!family) return res.status(400).json({ message: 'Family not found!' });

        res.json(family);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
