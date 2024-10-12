const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const requestRoutes = require('./routes/request');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const User = require('./userModel');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 5000;
const MONGO_URI = 'mongodb+srv://kriyaoswal:admin@cluster0.cfjlf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((error) => console.log('MongoDB connection error:', error));

// Track connected sockets
const maidSockets = {}; // Store maid usernames and socket IDs

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Store the maid's username and socket ID
  socket.on('registerMaid', (maidUsername) => {
    maidSockets[maidUsername] = socket.id;
    console.log(`${maidUsername} is connected with socket ID ${socket.id}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    // Remove from the maidSockets
    Object.keys(maidSockets).forEach((username) => {
      if (maidSockets[username] === socket.id) {
        delete maidSockets[username];
      }
    });
  });
});

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/requests', requestRoutes);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
