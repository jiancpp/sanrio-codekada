const MonthlySummary = require('../models/MonthlySummary');
const DailyLog = require('../models/DailyLog');
const Family = require('../models/Family'); // To find family members
const LabTest = require('../models/LabTest');

/**
 * Helper to identify alarming vitals
 * @param {*} logs 
 * @returns 
 */
const identifyAlarms = (logs) => {
    const alarms = [];
    logs.forEach(log => {
        // High Blood Pressure check (e.g., Systolic > 140)
        if (log.vitals?.bloodPressure) {
            const systolic = parseInt(log.vitals.bloodPressure.split('/')[0]);
            if (systolic > 140) {
                alarms.push({
                    vitalType: 'bloodPressure',
                    value: log.vitals.bloodPressure,
                    timestamp: log.createdAt,
                    severity: 'High'
                });
            }
        }
        // High Blood Sugar check (e.g., > 140 mg/dL)
        if (log.vitals?.bloodSugarLevel > 140) {
            alarms.push({
                vitalType: 'bloodSugarLevel',
                value: log.vitals.bloodSugarLevel.toString(),
                timestamp: log.createdAt,
                severity: 'High'
            });
        }

        // Low Water Intake check
        if (log.waterIntake && log.waterIntake < 8) {
            alarms.push({
                vitalType: 'waterIntake',
                value: `${log.waterIntake} glasses`,
                timestamp: log.createdAt,
                severity: 'Low'
            });
        }
    });
    return alarms;
};

exports.getMonthlySummary = async (req, res) => {
    try {
        const { familyId, month, year } = req.query;

        // Create a date range for the requested month
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        // Try to find an existing pre-calculated summary
        let summary = await MonthlySummary.findOne({
            familyId,
            month: startDate
        }).populate('memberSummaries.memberId', 'name');

        if (!summary) {
            return res.status(404).json({ message: "Summary not yet generated for this month." });
        }

        res.status(200).json(summary);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.generateMonthlySummary = async (familyId, month, year) => {
    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        // Get all members of the family
        const family = await Family.findById(familyId);
        const currentTests = await LabTest.find({
            member: member._id,
            testDate: { $gte: startDate, $lte: endDate }
        });

        const memberSummaries = [];
        const memberLabComparisons = [];

        for (const member of family.members) {
            // --- Log Summary ---
            // Fetch Daily Logs for this member for the specific month
            const logs = await DailyLog.find({
                userId: member._id,
                createdAt: { $gte: startDate, $lte: endDate }
            });

            // Calculate Averages for the logsSummary
            const totalLogs = logs.length;
            const avgVitals = {
                weight: totalLogs ? logs.reduce((sum, l) => sum + (l.vitals.weight || 0), 0) / totalLogs : 0,
                heartRate: totalLogs ? logs.reduce((sum, l) => sum + (l.vitals.heartRate || 0), 0) / totalLogs : 0,
                bloodSugarLevel: totalLogs ? logs.reduce((sum, l) => sum + (l.vitals.bloodSugarLevel || 0), 0) / totalLogs : 0,
                waterIntake: totalLogs ? logs.reduce((sum, l) => sum + (l.waterIntake || 0), 0) / totalLogs : 0,
            };

            // --- Lab Tests Summary ---
            for (const current of currentTests) {
                // Find the most recent test with the SAME NAME before this month
                const previous = await LabTest.findOne({
                    member: member._id,
                    testName: current.testName,
                    testDate: { $lt: startDate }
                }).sort({ testDate: -1 });
            
                let comparisonNote = "No previous data for comparison.";
                
                // Logic for Auto-Comparison if items exist
                if (previous && current.items.length > 0 && previous.items.length > 0) {
                    // Example: Compare the first item's result
                    const diff = current.items[0].result - previous.items[0].result;
                    comparisonNote = `${current.items[0].name} changed by ${diff}`;
                } else {
                    // Fallback to presenting the summaries side-by-side
                    comparisonNote = `Prev: ${previous?.findingsSummary || 'N/A'} | Curr: ${current.findingsSummary}`;
                }
            
                memberLabComparisons.push({
                    testName: current.testName,
                    currentResultId: current._id,
                    previousResultId: previous ? previous._id : null,
                    comparisonNote
                });
            }
            
            // Build the individual summary object
            memberSummaries.push({
                memberId: member._id,
                memberName: member.name,
                labComparisons: memberLabComparisons,

                logsSummary: {
                    totalLogsEntries: totalLogs,
                    averageVitals: avgVitals,
                    alarmingLevels: identifyAlarms(logs), // Using your helper function
                    generalObservation: totalLogs > 20 ? "Consistent tracking" : "Inconsistent tracking"
                }
            });
        }

        // Save or Update the MonthlySummary document
        const summary = await MonthlySummary.findOneAndUpdate(
            { familyId, month: startDate },
            { 
                memberSummaries,
                generatedAt: new Date()
            },
            { upsert: true, new: true }
        );

        return summary;
    } catch (err) {
        console.error("Generation Error:", err);
        throw err;
    }
};