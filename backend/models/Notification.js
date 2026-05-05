const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    familyCode: {
        type: String,
        required: true
    },
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },

    // Auto-deletes after 24 hours  => change to two weeks
    createdAt: { 
        type: Date, 
        default: Date.now, 
        expires: 2592000 // 30 days in seconds 
    } 
})

module.exports = mongoose.model('Notification', NotificationSchema);
