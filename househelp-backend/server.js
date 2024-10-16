const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const requestRoutes = require('./routes/request');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const acceptedRequestRoutes = require('./acceptedRequestRoutes'); 
const User = require('./userModel'); 
const AcceptedRequest = require('./AcceptedRequest'); 
const Request = require('./requestModel'); 

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = 'mongodb+srv://kriyaoswal:admin@cluster0.cfjlf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; 

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch((error) => console.log('MongoDB connection error:', error));

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    socket.on('registerMaid', async (maidUsername) => {
        try {
            const maid = await User.findOne({ username: maidUsername });
            if (maid) {
                maid.socketId = socket.id; 
                await maid.save();
                console.log(`Maid ${maidUsername} registered with socket ID ${socket.id}`);
            }
        } catch (error) {
            console.error('Error registering maid:', error);
        }
    });

    socket.on('maidRequest', async (requestData) => {
        try {
            const newRequest = new Request(requestData);
            await newRequest.save();

            const maids = await User.find({ userType: 'maid' });
            maids.forEach((maid) => {
                if (maid.socketId) {
                    io.to(maid.socketId).emit('maidRequest', requestData);
                }
            });
        } catch (error) {
            console.error('Error sending maid request:', error);
        }
    });

    socket.on('acceptRequest', async ({ maidUsername, requestData }) => {
      if (!requestData || !requestData._id) {
        console.error('Request data is missing or invalid');
        return;
      }
    
      console.log('Incoming data:', { requestData });

      try {
        // Update the request status in the database using requestId
        await Request.findByIdAndUpdate(requestData._id, { status: 'accepted' });

        // Fetch the maid's details to get the maidId
        const maid = await User.findOne({ username: maidUsername });
        if (!maid) {
          console.error(`Maid not found for username: ${maidUsername}`);
          return;
        }

        console.log('Accepting request for maid:', maid.username);

        const acceptedRequest = new AcceptedRequest({
          requestId: requestData._id,
          maidId: maid._id,
          maidUsername: maid.username, // Use the username from the maid
          maidPhone: maid.phone, // Get maid's phone from the maid document
          userId: requestData.userId,
          username: requestData.username,
          phone: requestData.phone,
          address: requestData.address,
          date: requestData.date,
          time: requestData.time,
          details: requestData.details,
        });

        await acceptedRequest.save();

        io.to(requestData.userId).emit('maidAccepted', {
          maidUsername: maid.username,
          maidPhone: maid.phone,
          userId: requestData.userId,
        });
      } catch (error) {
        console.error('Error in accepting request:', error);
      }
    });

    socket.on('disconnect', async () => {
        console.log('A user disconnected: ' + socket.id);
        await User.updateMany({ socketId: socket.id }, { $unset: { socketId: "" } });
    });
});

// Routes
app.use('/requests', requestRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/accepted-requests', acceptedRequestRoutes);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
