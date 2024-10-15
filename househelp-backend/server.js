const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const requestRoutes = require('./routes/request'); // Import the request route
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const User = require('./userModel');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = 'mongodb+srv://kriyaoswal:admin@cluster0.cfjlf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((error) => console.log('MongoDB connection error:', error));

// Socket.IO connection
io.on('connection', async (socket) => {
  console.log('A user connected: ' + socket.id);

  socket.on('maidRequest', async (requestData) => {
    try {
      // Find all maids
      const maids = await User.find({ userType: 'maid' });

      if (maids.length === 0) {
        socket.emit('noMaidFound');
        return;
      }

      // Send request to all maids
      maids.forEach((maid) => {
        if (maid.socketId) {
          io.to(maid.socketId).emit('maidRequest', requestData);
        }
      });
    } catch (error) {
      console.error('Error sending maid request:', error);
    }
  });

  socket.on('acceptRequest', async ({ maidId, requestData }) => {
    try {
      const maid = await User.findById(maidId);
      if (maid) {
        io.to(requestData.userId).emit('maidAccepted', { maidId: maid._id, maidName: maid.username });
      }
    } catch (error) {
      console.error('Error in accepting request:', error);
    }
  });

  socket.on('disconnect', async () => {
    console.log('A user disconnected: ' + socket.id);
    await User.updateOne({ socketId: socket.id }, { $unset: { socketId: "" } });
  });
});

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/requests', requestRoutes); // Register the request route

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
