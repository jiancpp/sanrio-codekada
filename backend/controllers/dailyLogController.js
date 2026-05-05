const DailyLog = require('../models/DailyLog');
const User = require('../models/User');

// Create a new daily log and update streak
exports.createLog = async (req, res) => {
    try {
        const { userId, familyCode } = req.body;
        const today = new Date().toISOString().split('T')[0];

        // Look for user's log today -> update if log exists | create if not
        const log = await DailyLog.findOneAndUpdate(
            { userId, date: today },
            { $set: req.body },
            { upsert: true, new: true, runValidators: true }
        );

        // Log was just created if createdAt matches updatedAt
        const isNewLog = log.createdAt.getTime() === log.updatedAt.getTime();
        if (isNewLog) {
            const user = await User.findById(userId);

            if (user) {
                user.currentStreak++;
                await user.save();
            }
        }

        res.status(200).json(log);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Get the logs of each family member
exports.getFamilyLogs = async (req, res) => {
    try {
        const logs = await DailyLog.find({ familyCode: req.params.familyCode })
            .populate('userId', 'name')
            .sort({ createdAt: -1 });   // Sorted by latest to oldest

        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Get the "Monthly Summary" for a single user
exports.getUserLogs = async (req, res) => {
    try {
        const logs = await DailyLog.find({ userId: req.params.userId })
            .sort({ createdAt: -1 });   // Sorted by latest to oldest

        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getFamilyStreak = async (req, res) => {
    try {
        const { familyCode } = req.params;

        const members = await User.find({ familyCode });
        if (members.length === 0) {
            return res.status(404).json({ message: "No family members found " });
        }

        // Get all members' streaks and find the smallest one
        const streaks = members.map(user => user.currentStreak || 0);
        const familyStreak = Math.min(...streaks); // ... is the Spread Operator. It's like opening your bag and laying all your stuff on the bed

        res.status(200).json({ familyCode, familyStreak });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Get User's Daily Logs by month
exports.getLogsByMonth = async (req, res) => {
    try {
        const { userId, year, month } = req.params;
        const startDate = new Date(year, month - 1, 1); // Months starts at 0
        const endDate = new Date(year, month, 0, 23, 59, 59); // Day 0 of the next month = Last day of month - 1, 23:59:59 is time

        const logs = await DailyLog.find({
            userId,
            date: {
                $gte: startDate,    // Greater than or equal to
                $lte: endDate   // Less than or equal to
            }
        }).sort({ date: 1 }); // Sort by oldest to newest

        res.status(200).json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}