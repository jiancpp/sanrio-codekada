const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    familyCode: String,
    member: String,
    message: String,

    // Auto-deletes after 24 hours  => change to two weeks
    createdAt: { 
        type: Date, 
        default: Date.now, 
        expires: 2592000 // 30 days in seconds 
    } 
})

