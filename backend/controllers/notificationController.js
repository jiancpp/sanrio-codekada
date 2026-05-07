const Notification = require('../models/Notification')
const Family = require('../models/Family');

exports.notifyMember = async(req, res) => {
    try {
        const { member, message, familyCode } = req.body;
        const notif = new Notification({ 
            member, 
            familyCode, 
            message 
        });
        await notif.save();

        // Emit the event to that specific user's room
        const io = req.app.get('io');
        io.to(member).emit('notification');

        res.status(201).json(notif);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.notifyFamily = async(req, res) => {
    try {
        const { familyCode, userId, message } = req.body;
        const family = await Family.findOne({familyCode: familyCode});

        if (!family) {
            return res.status(403).json({ message: "Family record not found" })
        }

        const notif = await Notification.create({
            familyCode,
            from: userId,
            message,
        });
    
        const io = req.app.get("io");
        io.to(familyCode).emit("notification", notif);
      
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