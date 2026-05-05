const mongoose = require('mongoose');

const FamilySchema = new mongoose.Schema({
    familyCode: {
        type: String,
        required: true,
    },
    familyName: {
        type: String,
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

FamilySchema.index({ familyCode: 1 }, { unique: true })

module.exports = mongoose.model("Family", FamilySchema);