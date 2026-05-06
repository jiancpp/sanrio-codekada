const cron = require('node-cron');
const { getIO } = require('./socketService');
const User = require('../models/User');
const Notification = require('../models/Notification');

/**
 * Schedules tasks and functions
 * 
 * @note Every Minute	* * * * *
 * @note Every Hour	    0 * * * *
 * @note Midnight	    0 0 * * *
 * @note Twice a Day	0 9,21 * * *
 * @note Every Monday	0 0 * * 1
 */
const initCronJobs = () => {
    // Streak reset at 00:00 (Midnight)
    cron.schedule('0 0 * * *', async () => {
        // const io = getIO(); // No 'req' needed!
        console.log('Running midnight streak reset...');
        
        try {
            // Find users who didn't log anything the day before
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            await User.updateMany(
                { lastLogDate: { $lt: today } },   // $lt checks if lastLogDate is less than today
                { $set: { currentStreak: 0 } }     // reset streak
            );
            console.log('Streaks updated successfully.');
        } catch (err) {
            console.error('Error in cron job:', err);
        }
    }, {
        scheduled: true,
        timezone: "Asia/Manila" // This forces PH time
    });

    // Notify about Monthly Summary on 12:00 AM on the 1st of every month
    cron.schedule('0 0 1 * *', async () => {
        const families = await Family.find();
        
        // Get the first and last day of the PREVIOUS month
        const now = new Date();
        const firstDayPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDayPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

        for (const family of families) {
            const logs = await Log.find({ 
                familyCode: family.familyCode,
                createdAt: { $gte: firstDayPrevMonth, $lte: lastDayPrevMonth }
            });

            if (logs.length === 0) continue; // Skip if no activity

            // const summaryText = generateSummaryLogic(logs); 

            // const summary = await Summary.create({
            //     familyCode: family.familyCode,
            //     content: summaryText,
            //     month: now.getMonth(), // The month that just passed
            //     year: now.getFullYear()
            // });
            
            // Push a real-time "toast" or alert to everyone online in the family
            getIO().to(family.familyCode).emit('new_summary', { 
                message: `The summary for ${firstDayPrevMonth.toLocaleString('default', { month: 'long' })} is ready!`,
                summaryId: summary._id
            });

            // OPTIONAL: Also save a Notification document for each member
            // so they see a "red dot" next time they log in
            const memberNotifications = family.members.map(memberId => ({
                familyCode: family.familyCode,
                member: memberId,
                message: "A new monthly summary has been generated."
            }));
            await Notification.insertMany(memberNotifications);
        }
    });
};

module.exports = initCronJobs;