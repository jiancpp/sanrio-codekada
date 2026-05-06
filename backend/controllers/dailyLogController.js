const DailyLog = require('../models/DailyLog');
const User = require('../models/User');

const formatLocalDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

const toPHDate = (rawDate) => {
    const date = new Date(rawDate);

    // Convert UTC → PH time (+8 hours)
    const phDate = new Date(date.getTime() + (8 * 60 * 60 * 1000));

    return formatLocalDate(phDate);
};

// Create a new daily log and update streak
exports.createLog = async (req, res) => {
    try {
        const { userId } = req.body;
        const today = new Date().toISOString().split('T')[0];
        console.log(today);

        // Look for user's log today -> update if log exists | create if not
        const log = await DailyLog.findOneAndUpdate(
            { userId, date: today },
            { $set: { ...req.body, date: today } },
            { upsert: true, new: true, runValidators: true, rawResult: true }
        );

        if (!log.lastErrorObject?.updatedExisting) {
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
        const { familyCode } = req.params;
        const { weekStart, weekEnd } = req.query;

        let query = { familyCode };
        if (weekStart && weekEnd) {
            query.date = { 
                $gte: weekStart, // e.g., "2024-03-25"
                $lte: weekEnd    // e.g., "2024-03-31"
            };
        }

        const logs = await DailyLog.find(query)
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
      const memberCount = members.length;
  
      if (memberCount === 0) {
        return res.status(404).json({ message: "No family members found" });
      }
  
      const memberIds = members.map(m => m._id);
  
      // ✅ FIXED aggregation
      const logsByDate = await DailyLog.aggregate([
        { $match: { userId: { $in: memberIds } } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$date",
                timezone: "Asia/Manila"
              }
            },
            uniqueUsers: { $addToSet: "$userId" }
          }
        },
        {
          $project: {
            date: "$_id",
            count: { $size: "$uniqueUsers" },
            _id: 0
          }
        },
        { $sort: { date: -1 } }
      ]);
  
      let familyStreak = 0;
  
      const today = new Date().toLocaleDateString("en-CA");
      const yesterday = new Date(Date.now() - 86400000).toLocaleDateString("en-CA");
  
      if (logsByDate.length === 0) {
        return res.status(200).json({ familyCode, familyStreak: 0 });
      }
  
      // latest log check
      const latestLogDate = logsByDate[0].date;
  
      if (latestLogDate !== today && latestLogDate !== yesterday) {
        return res.status(200).json({ familyCode, familyStreak: 0 });
      }
  
      // streak calculation
      for (let i = 0; i < logsByDate.length; i++) {
        const { date, count } = logsByDate[i];
  
        if (count === memberCount) {
          familyStreak++;
        } else {
          // allow today to still be incomplete
          if (date === today) continue;
          break;
        }
      }
  
      return res.status(200).json({
        familyCode,
        familyStreak
      });
  
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };

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