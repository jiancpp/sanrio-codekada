const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    birthdate: Date,
    familyCode: String,
    bloodType: String,
    allergies: [String],
    medicalConditions: [String],
    maintenanceMeds: [{name: String, frequency: String}],
    currentStreak: Number,
    lastLogDate: Date,

    labTests: [mongoose.Schema.Types.ObjectId]
});

module.exports = mongoose.model('User', UserSchema);