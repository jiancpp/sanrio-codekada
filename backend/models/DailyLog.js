const mongoose = require('mongoose');

const DailyLogSchema = new mongoose.Schema({
    family: {
        type: String, 
        required: true
    },
    member: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true
    },
    bp: {
        systolic: Number,
        diastolic: Number
    },
    heartRate: Number,
    bloodSugar: Number,
    // waterIntake: Number,
    notes: String
}, {timestamps: true})

module.exports = mongoose.model("DailyLog", DailyLogSchema);