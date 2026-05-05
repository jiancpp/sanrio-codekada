const mongoose = require('mongoose');

// TODO: Kyle
const LabTestSchema = new mongoose.Schema({
    familyCode: {
        type: String,
        required: true
    },
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    attachments: [String],
    testName: String,
    testDate: { type: Date, default: Date.now },
    notes: String
})

module.exports = mongoose.model("LabTest", LabTestSchema);