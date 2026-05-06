const mongoose = require('mongoose');
const { Schema } = mongoose;

const ActivitySchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        index: true // Crucial for fast lookups
    },
    familyId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Family', 
        index: true 
    },
    familyCode: {
        type: String
    },
    type: { 
        type: String, 
        enum: ['LOGGED_VITAL', 'MISSED_MEDS', 'LAB_RESULT', 'GOAL_ACHIEVED', 'LOG_VITAL'],
        required: true 
    },
    description: String,   // e.g., "Logged Blood Pressure: 120/80"

    createdAt: { 
        type: Date, 
        default: Date.now,
        expires: '7d' // Optional: Automatically delete logs older than 30 days
    }
});

module.exports = mongoose.model('RecentActivity', ActivitySchema);