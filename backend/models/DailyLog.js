const mongoose = require('mongoose');

// TODO: Kyle
const DailyLogSchema = new mongoose.Schema({
    familyCode: {
        type: String, 
        required: true
    },
    member: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true
    },
    // bp: {
    //     systolic: Number,  numerator
    //     diastolic: Number
    // },
    bp: String,
    heartRate: Number,
    bloodSugar: Number,
    waterIntake: Number,
    notes: String
}, {timestamps: true})

module.exports = mongoose.model("DailyLog", DailyLogSchema);