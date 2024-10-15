const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const User = require('./userModel'); // Ensure this model is correctly defined
const requestRoutes = require('./routes/request');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

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

app.use(cors({ origin: '*', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((error) => console.log('MongoDB connection error:', error));

io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);

  // Assign socket ID to maids when they connect
  socket.on('registerMaid', async (maidUsername) => {
    try {
      await User.findOneAndUpdate({ username: maidUsername }, { socketId: socket.id });
      console.log(`Maid ${maidUsername} is now registered with socket ID ${socket.id}`);
    } catch (error) {
      console.error('Error registering maid:', error);
    }
  });

  // Handle maid request from users
  socket.on('maidRequest', async (requestData) => {
    try {
      const maids = await User.find({ userType: 'maid' });
      if (maids.length === 0) {
        socket.emit('noMaidFound');
        return;
      }

      maids.forEach((maid) => {
        if (maid.socketId) {
          io.to(maid.socketId).emit('maidRequest', requestData);
        }
      });
    } catch (error) {
      console.error('Error sending maid request:', error);
    }
  });

  // Listen for maid accepting the request
  socket.on('acceptRequest', async ({ maidId, requestData }) => {
    try {
      const maid = await User.findOne({ username: maidId });
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

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/requests', requestRoutes);
