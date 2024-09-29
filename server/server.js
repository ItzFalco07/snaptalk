require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const UserSchema = require('./modules/UserSchema');
const cors = require('cors');
const PORT = process.env.PORT;
const uri = process.env.MONGO_URI;
const router = require('./modules/Routes');

// Middleware
const app = express();
app.use(cors({
    credentials: true,
    origin: "https://snaptalks.vercel.app"
}));
app.use(express.json());

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
	app.listen(PORT, () => {
	    console.log(`Server is running on port: ${PORT}`);
	});

	app.get('/', (req, res) => {
	    res.send('This is the backend');
	});
