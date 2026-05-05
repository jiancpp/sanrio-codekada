const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, trim: true, lowercase: true},
    name: { type: String, required: true, trim: true},
    password: { type: String, required: true },
    familyCode: { type: String, index: true, trim: true, uppercase: true}, 

    role: {
        type: String,
        enum: ['Manager', 'Member'],  // What's a more fitting role name
        default: 'Member', 
        required: true
    },

    // Medical Info filled in 
    birthdate: Date,
    bloodType: String,
    allergies: { type: [String], default: [] },
    medicalConditions: { type: [String], default: [] },
    maintenanceMeds: [{
        name: String, 
        days: { type: [String], enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']},
        time: [String]
    }],

    // Med Archive
    labTests: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },

    currentStreak: { type: Number, default: 0 },
    lastLogDate: { type: Date, default: null },
    finishedAccountSetup: { type: Boolean, default: false }
});

// Partial Index: Only enforces unique names WITHIN the same family
// This allows many "New Users" with the same name to exist BEFORE they join families
UserSchema.index(
    { name: 1, familyCode: 1 }, 
    { unique: true, partialFilterExpression: { familyCode: { $type: "string" } } }
);

// Hash password before saving
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    
    // Generate salt and hash
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return;
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);