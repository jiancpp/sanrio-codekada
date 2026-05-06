const mongoose = require('mongoose');
const constants = require('../constants')

const MonthlySummarySchema = new mongoose.Schema({
    familyId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Family', 
        required: true 
    },
    month: { 
        type: Date, // Use the first day of the month for easy querying
        required: true 
    },
    memberSummaries: [{
        memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        memberName: String,
        

        // --- Lab Test Comparison ---
        labComparisons: [{
            testName: { type: String, enum: constants.testNames},
            currentResultId: { type: mongoose.Schema.Types.ObjectId, ref: 'LabTest', default: null},
            previousResultId: { type: mongoose.Schema.Types.ObjectId, ref: 'LabTest', default: null},
            comparisonNote: String
        }],

        // --- Daily Logs Summary ---
        logsSummary: {
            totalLogsEntries: Number,
            averageLogs: {
                weight: Number,
                heartRate: Number,
                bloodSugarLevel: Number,
                waterIntake: Number
            },
            // Captures specific instances where thresholds were crossed
            alarmingLevels: [{
                vitalType: { type: String, enum: constants.vitals },
                value: String,
                timestamp: Date,
                severity: { type: String, enum: ['High', 'Low'] }
            }],
            generalObservation: String
        }
    }],
    generatedAt: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

// Indexing for faster reporting
MonthlySummarySchema.index({ familyId: 1, month: -1 });

module.exports = mongoose.model('MonthlySummary', MonthlySummarySchema);