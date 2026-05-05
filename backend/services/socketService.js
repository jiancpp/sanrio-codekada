module.exports = {
    // This is called once in server.js to store the instance
    init: (socketIoInstance) => {
        io = socketIoInstance;
        return io;
    },
    // This is called anywhere else (Cron, Services, etc.) to get it
    getIO: () => {
        if (!io) {
            throw new Error("Socket.io not initialized!");
        }
        return io;
    }
};