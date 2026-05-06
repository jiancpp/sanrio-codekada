const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // 1. Import http
const { Server } = require('socket.io'); // 2. Import Socket.io
const socketService = require('./services/socketService');
require('dotenv').config();

const initCronJobs = require('./services/cronTasks');

const CLIENT_URL = process.env.NODE_ENV === 'production' 
  ? process.env.FRONTEND_URL 
  : 'http://localhost:5173';

const app = express()
const server = http.createServer(app); // 3. Create the HTTP server

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
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
const path = require('path');
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/daily-log', require('./routes/dailyLogRoutes'));
app.use('/api/family', require('./routes/familyRoutes'));
app.use('/api/lab-tests', require('./routes/labTestRoutes'));
app.use('/api/system', require('./routes/systemRoutes'));

// Start scheduler
initCronJobs();

// Export 'io' globally
app.set('io', io);

if (process.env.NODE_ENV === 'production') {
  // Use the built-in __dirname (no extra code needed)
  const distPath = path.join(__dirname, '../dist');
  
  app.use(express.static(distPath));
  app.get('/:path*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 5001;

app.use((req, res, next) => {
  // If the request is for an API or an actual file, skip this
  if (req.path.startsWith('/api') || path.extname(req.path)) {
    return next();
  }
  // Otherwise, send the frontend
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

server.listen(PORT, () => console.log(`Server on port ${PORT}`));