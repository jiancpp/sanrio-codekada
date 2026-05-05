const Notification = require('../models/Notification')
const Family = require('../models/Family');
const { findOne } = require('../models/User');

exports.notifyMember = async(req, res) => {
    try {
        const notif = new Notification(req.body);
        await notif.save();
        res.status(201).json(notif)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.notifyFamily = async(req, res) => {
    try {
        const { familyCode, message } = req.body;
        const family = await Family.findOne({familyCode: familyCode});

        if (!family) {
            return res.status(403).json({ message: "Family record not found" })
        }

        const savePromises = family.members.map(member => {
            const notif = new Notification({ familyCode, member, message });
            return notif.save(); 
        });
        
        // Waits for ALL of them to finish at the same time
        await Promise.all(savePromises);
        res.status(200).json({ message: `Notifications sent to ${family.members.length} members.` });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.removeNotif = async(req, res) => {
    try {
        const { id } = req.params;
        const notif = await Notification.findById(id)

        if (!notif) {
            return res.status(404).json({ message: "Notification not found" });
        }

        const isSelf = req.user._id.toString() === notif.member.toString();
        if (!isSelf) {
            return res.status(403).json({ message: "Not authorized to delete others' notification" })
        }

        await notif.deleteOne();
        res.status(200).json({ message: "Notification removed"});

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}