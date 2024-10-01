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
    origin: "https://snaptalks.vercel.app",
    methods: ["GET", "POST"],
}));
app.use(express.json());

// setup socket io server
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: ["https://snaptalks.vercel.app"], // Make sure this is correct
    methods: ["GET", "POST"],
    credentials: true
  }
});


// socket io 
io.on('connection', function(socket){
	console.log('A user connected');
	socket.on('createRoom', function(data){
		var {RoomId} = data;
		console.log('Room created:', RoomId); // Add this log to verify
		socket.join(RoomId);
	    socket.emit('myRoom', {RoomId})
	})
    

	socket.on('disconnect', function() {
		console.log('A user disconnected')
	})
})

// Connect to MongoDB
const ConnectDB = async () => {
    try {
        await mongoose.connect(uri);
    } finally {
        console.log('Connected to MongoDB...');
    }
};
ConnectDB();
app.use('/', router);

// Express Server
server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('This is the backend');
});
