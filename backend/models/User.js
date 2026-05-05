const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    familyCode: {
        type: String,
    },
    password: {
        type: String,
        required: true,

    },
    birthdate: Date,
    bloodType: String,
    allergies: [String],
    medicalConditions: [String],
    maintenanceMeds: [{
        name: String, 
        days: { type: [String], enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']},
        time: [String]
    }],
    currentStreak: {
        type: Number,
        default: 0
    },

    lastLogDate: Date,
    labTests: [{type: mongoose.Schema.Types.ObjectId, ref: "LabTest"}]
});

module.exports = mongoose.model('User', UserSchema);