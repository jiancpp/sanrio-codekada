const RecentActivity = require('../models/RecentActivity');

exports.getRecentActivity = async (req, res) => {
    try {
        const { familyId } = req.params;
        
        const activities = await RecentActivity.aggregate([
            { $match: { familyId: new mongoose.Types.ObjectId(familyId) } },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: "$userId",
                    latestActivity: { $first: "$$ROOT" }
                }
            },

            // Flattens the structure so "latestActivity" becomes the main object
            { $replaceRoot: { newRoot: "$latestActivity" } },

            // Look up user details (since .populate doesn't work inside aggregate)
            {
                $lookup: {
                    from: "User", // make sure this matches your User collection name
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDoc"
                }
            },

            // Clean up the joined user array to a single object
            { $unwind: "$userDoc" },
            {
                $project: {
                    type: 1,
                    description: 1,
                    createdAt: 1,
                    "userDoc.name": 1,
                }
            }
        ])
        res.status(200).json(activities);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.postRecentActivity = async (req, res) => {
    try {
        const { userId, familyId, familyCode, type } = req.body
        const newActivity = new RecentActivity({
            userId,
            familyId,
            familyCode,
            type
        })
        await newActivity.save();
        res.status(200).json(newActivity);
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}