const LabTest = require('../models/LabTest');
const User = require('../models/User');

exports.createLabTest = async (req, res) => {
    try {
        const { familyCode, member, testName, testDate, findingsSummary, attachments } = req.body;

        const newTest = new LabTest({
            familyCode,
            member,
            testName,
            testDate,
            findingsSummary,
            attachments
        });

        const savedTest = await newTest.save();

        await User.findByIdAndUpdate(member, {
            $push: { labTests: savedTest._id }
        });

        res.status(201).json(savedTest);
    } catch (error) {
        res.status(500).json({ message: "Error saving lab test", error: error.message });
    }
};

exports.getMemberTests = async (req, res) => {
    try {
        const { familyCode, member } = req.params;
        
        const tests = await LabTest.find({ familyCode, member })
            .populate('member', 'name') 
            .sort({ testDate: -1 }); // Newest first

        res.status(200).json(tests);
    } catch (error) {
        res.status(500).json({ message: "Error fetching member tests", error: error.message });
    }
};

exports.getFamilyTests = async (req, res) => {
    try {
        const { familyCode } = req.params;
        
        const tests = await LabTest.find({ familyCode })
            .populate('member', 'name') 
            .sort({ testDate: -1 }); // Newest first

        res.status(200).json(tests);
    } catch (error) {
        res.status(500).json({ message: "Error fetching family tests", error: error.message });
    }
};

exports.deleteLabTest = async (req, res) => {
    try {
        const { id } = req.params;
        
        const test = await LabTest.findById(id);
        if (!test) return res.status(404).json({ message: "Test not found" });

        // Remove the reference from the User's array first
        await User.findByIdAndUpdate(test.member, {
            $pull: { labTests: id }
        });

        await LabTest.findByIdAndDelete(id);
        
        res.status(200).json({ message: "Lab test deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting test", error: error.message });
    }
};


