const express = require('express');
const router = express.Router();
const UserSchema = require('./UserSchema');

// User creation route
router.post('/createUser', async (req, res) => {
    try {
        const { Name, Email, Password, Color } = req.body;
        const existingUser = await UserSchema.findOne({ Email });

        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const User = new UserSchema({ Name, Email, Password, Color });
        await User.save(); // Save the new user

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.log(error); // Log the error for debugging
        res.status(500).json('error');
    }
});

// get all users from DB
router.get('/getAllUsers', async (req,res) => {
    try {
        const Users = await UserSchema.find({})
        res.json(Users)
    } catch(error) {
        console.error(error)
    }
})

// handle Requests
router.post('/sendreq', async (req,res)=> {
    try {
        const {userFrom, userTo} = req.body;
        const sender = await UserSchema.findOne({Name: userFrom});
        sender.outgoingRequests.push(userTo);
        sender.save()

        const reciver = await UserSchema.findOne({Name: userTo});
        reciver.incomingRequests.push(userFrom);
        reciver.save()

        res.status(200).json('ok')
    } catch(error) {
        console.error(error)
    }
})

// get Incomming and Outgoing requests of user
router.post('/getRequests', async (req,res) => {
    try {
        const {userName} = req.body
        console.log(userName)
        let user = await UserSchema.findOne({ Name: userName }); // Pass the name as a string
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Respond with the user's incoming and outgoing requests
        return res.status(200).json({
            outgoingRequests: user.outgoingRequests,
            incomingRequests: user.incomingRequests,
        });
    } catch(error) {
        console.error(error)
    }
})


module.exports = router;
