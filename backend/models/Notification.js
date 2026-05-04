const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    family: String,
    message: String,

    // Auto-deletes after 24 hours  => change to two weeks
    createdAt: { type: Date, default: Date.now, expires: 86400 } 
})