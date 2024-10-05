require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const UserSchema = require('./modules/UserSchema');
const cors = require('cors');
const PORT = process.env.PORT;
const uri = process.env.MONGO_URI;
const router = require('./modules/Routes');
const http = require('http')
// Middleware
app.use(cors({
    origin: ["https://snaptalks.vercel.app", "http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
}));
app.use(express.json());

// setup socket io server
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: ["https://snaptalks.vercel.app", "http://localhost:5173", "http://localhost:5174"], // Make sure this is correct
    methods: ["GET", "POST"],
    credentials: true
  }
});


// socket io 
io.on('connection', function(socket) {
  console.log('A user connected');

  socket.on('createRoom', function(data) {
    var { RoomId, FriendName } = data;
    console.log('Room created: ', RoomId);
    
    socket.join(RoomId);
    socket.emit('myRoom', { RoomId, FriendName });

    socket.on('msgpush', function(msg) {
      console.log(msg)
      // This will send the message to everyone in the room except the sender
      socket.to(RoomId).emit('msgincomming', msg);
    });
  });

  socket.on('disconnect', function() {
    console.log('A user disconnected');
  });
});
// Connect to MongoDB
const ConnectDB = async () => {
    try {
        await mongoose.connect(uri);
    } finally {
        console.log('Connected to MongoDB...');
    }
};
ConnectDB();
app.use('/', (req, res, next) => {
    req.io = io;  // Attach the Socket.IO instance to req object
    next();
}, router);

// Express Server
server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('This is the backend');
});
