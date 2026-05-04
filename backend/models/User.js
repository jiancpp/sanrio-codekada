const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    birthdate: Date,
    familyCode: String,
    bloodType: String,
    allergies: [String],
    medicalConditions: [String],
    maintenanceMeds: [{name: String, frequency: String}]
});

module.exports = mongoose.model('User', UserSchema);