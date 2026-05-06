const mongoose = require('mongoose');
const constants = require('../constants')


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
    testName: { 
        type: String, 
        enum: constants.testNames 
    },    
    testDate: { type: Date, default: Date.now },
    items: [{
        name: String,   // e.g., "LDL Cholesterol"
        result: Number, // e.g., 130
        unit: String,   // e.g., "mg/dL"
        referenceRange: String // e.g., "<100" (Optional but helpful)
    }],
    findingsSummary: String
})

module.exports = mongoose.model("LabTest", LabTestSchema);