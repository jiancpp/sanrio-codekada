const mongoose = require('mongoose');
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
                    from: "users", // make sure this matches your User collection name
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
                    "userDoc._id": 1,
                }
            }
        ])

        if (activities.length === 0) return res.status(403).json({ message: "Did not return anything" })
        res.status(200).json(activities);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.postRecentActivity = async (req, res) => {
    try {
        const { userId, familyId, familyCode, type, description } = req.body
        const newActivity = new RecentActivity({
            userId,
            familyId,
            familyCode,
            type,
            description
        })
        await newActivity.save();
        res.status(200).json(newActivity);
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}