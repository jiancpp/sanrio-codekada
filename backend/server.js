const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); 
const { Server } = require('socket.io'); 
const socketService = require('./services/socketService');
require('dotenv').config();

const initCronJobs = require('./services/cronTasks');

const CLIENT_URL = process.env.NODE_ENV === 'production' 
  ? process.env.FRONTEND_URL 
  : 'http://localhost:5173';

const app = express()
const server = http.createServer(app); // Create the HTTP server

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"]
  }
});
socketService.init(io);

// Middleware
app.use(cors({
  origin: CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-system-key'] // <--- Add your custom headers here!
}));
app.use(express.json());

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB")

    // Start cron ONLY after DB is ready
    console.log("Initializing Cron Jobs...");
    initCronJobs();
  })
  .catch(err => console.log(err));

// Socket.io Logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    if (!socket.rooms.has(userId)) {
      socket.join(userId);
      console.log(`Joined user room: ${userId}`);
    }
  });

  socket.on("join-family", (familyCode) => {
    if (!socket.rooms.has(familyCode)) {
      socket.join(familyCode);
      console.log(`Joined family room: ${familyCode}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Use Routes
const path = require('path');
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/daily-log', require('./routes/dailyLogRoutes'));
app.use('/api/family', require('./routes/familyRoutes'));
app.use('/api/lab-tests', require('./routes/labTestRoutes'));
app.use('/api/system', require('./routes/systemRoutes'));

// Export 'io' globally
app.set('io', io);

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');

  app.use(express.static(distPath));

  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }

    res.sendFile(path.join(distPath, 'index.html'));
  });
}
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server on port ${PORT}`));