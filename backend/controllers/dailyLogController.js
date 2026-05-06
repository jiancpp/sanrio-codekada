const DailyLog = require('../models/DailyLog');
const User = require('../models/User');

// Create a new daily log and update streak
exports.createLog = async (req, res) => {
    try {
        const { userId } = req.body;
        const today = new Date().toISOString().split('T')[0];

        // Look for user's log today -> update if log exists | create if not
        const log = await DailyLog.findOneAndUpdate(
            { userId, date: today },
            { $set: { ...req.body, date: today } },
            { upsert: true, new: true, runValidators: true, rawResult: true }
        );

        if (!log.lastErrorObject.updatedExisting) {
            const user = await User.findById(userId);
            
            if (user) {
                user.streak = (user.streak || 0) + 1;
                await user.save();
            }
        }

        res.status(200).json(log.value);
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

// Get User's Log for a specific day
exports.getDailyLog = async (req, res) => {
    try {
        const {userId, date } = req.params;

        const log = await DailyLog.findOne({
            userId: userId,
            date: date
        });

        if (!log) {
            return res.status(200).json(null);
        }

        res.json(log);
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
        const streaks = members.map(user => user.streak || 0);
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

        const formattedMonth = month.padStart(2, '0');
        const searchPattern = new RegExp(`^${year}-${formattedMonth}`);

        const logs = await DailyLog.find({
            userId,
            date: {
                $regex: searchPattern
            }
        }).sort({ date: 1 }); // Sort by oldest to newest

        res.status(200).json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}