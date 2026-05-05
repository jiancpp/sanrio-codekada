const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express()

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

// Use Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/daily-log', require('./routes/dailyLogRoutes'));
app.use('/api/family', require('./routes/familyRoutes'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));