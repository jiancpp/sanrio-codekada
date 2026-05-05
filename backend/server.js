const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // 1. Import http
const { Server } = require('socket.io'); // 2. Import Socket.io
const socketService = require('./services/socketService');
require('dotenv').config();

const initCronJobs = require('./services/cronTasks');

const app = express()
const server = http.createServer(app); // 3. Create the HTTP server

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.BASE_URL,
    methods: ["GET", "POST"]
  }
});
socketService.init(io);

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

// Socket.io Logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (data) => {
    socket.join(data.userId);      // Private room
    socket.join(data.familyCode);  // Family-wide room
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Use Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/daily-log', require('./routes/dailyLogRoutes'));
app.use('/api/family', require('./routes/familyRoutes'));

// Start scheduler
initCronJobs();

// Export 'io' globally
app.set('io', io);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server on port ${PORT}`));