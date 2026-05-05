const mongoose = require('mongoose');

const FamilySchema = new mongoose.Schema({
    familyCode: {
        type: String,
        unique: true,
        required: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

modules.exports = mongoose.model("Family", FamilySchema);