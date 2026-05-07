const Notification = require('../models/Notification')
const Family = require('../models/Family');

exports.notifyMember = async (req, res) => {
    try {
      const { to, from = null, message, familyCode } = req.body;
  
      const notif = await Notification.create({
        to,
        from,
        familyCode,
        message,
      });
  
      // emit to recipient user room
      const io = req.app.get("io");
      io.to(to).emit("notification", notif);
  
      res.status(201).json(notif);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  exports.notifyFamily = async (req, res) => {
    try {
      const { familyCode, from = null, message } = req.body;
  
      const family = await Family.findOne({ familyCode });
  
      if (!family) {
        return res.status(403).json({ message: "Family record not found" });
      }
  
      const io = req.app.get("io");
  
      const savePromises = family.members.map(async (memberId) => {
        const notif = await Notification.create({
          familyCode,
          from,
          to: memberId,   
          message,
        });
  
        // emit per user
        io.to(memberId.toString()).emit("notification", notif);
  
        return notif;
      });
  
      await Promise.all(savePromises);
  
      res.status(200).json({
        message: `Notifications sent to ${family.members.length} members.`,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

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

exports.getNotifications = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const notifications = await Notification.find({
        to: userId,
      })
        .sort({ createdAt: -1 })
        .limit(6)
        .populate("from", "name");
  
      res.status(200).json(notifications);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };