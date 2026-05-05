const mongoose = require('mongoose');

const DailyLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    familyCode: {
        type: String, 
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    vitals: {
        weight: Number,
        bloodPressure: String,
        heartRate: Number,
        bloodSugarLevel: Number,
    },
    medsTaken: [{
        _id: false,
        name: String,
        status: {
            type: Boolean,
            default: false
        }
    }],
    waterIntake: Number,
    notes: String,
    proofImage: String
}, {timestamps: true});

module.exports = mongoose.model("DailyLog", DailyLogSchema);