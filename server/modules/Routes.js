const express = require('express');
const router = express.Router();
const UserSchema = require('./UserSchema');
const MessageSchema = require('./MessageSchema');

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
router.get('/getAllUsers', async (req,res) => {
    try {
        const Users = await UserSchema.find({})
        res.json(Users)
    } catch(error) {
        console.error(error)
    }
})
router.post('/sendreq', async (req,res)=> {
    try {
        const {userFrom, userTo} = req.body;
        // if userFrom alredy have userTo in friend list return error
        const user = await UserSchema.findOne({ Name: userFrom });

        if (user && user.Friends.includes(userTo)) {
            res.json('User already exists');
        } else {
            const sender = await UserSchema.findOne({Name: userFrom});
            sender.outgoingRequests.push(userTo);
            sender.save()

            const reciver = await UserSchema.findOne({Name: userTo});
            reciver.incomingRequests.push(userFrom);
            reciver.save()

            res.status(200).json('ok')
        }

    } catch(error) {
        console.log(error)
    }
})
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
        console.log(error)
    }
})
router.post('/acceptRequest', async (req,res)=> {
    try {
        const {Acceptor, AcceptOf} = req.body;
        // Check if AcceptOf is already a friend of Acceptor
        const acceptorUser = await UserSchema.findOne({ Name: Acceptor });
        if (acceptorUser && acceptorUser.Friends.includes(AcceptOf)) {
            return res.status(400).send('Already in your friend list'); // Send response if already friends
        }

        // Check if Acceptor is already a friend of AcceptOf
        const acceptOfUser = await UserSchema.findOne({ Name: AcceptOf });
        if (acceptOfUser && acceptOfUser.Friends.includes(Acceptor)) {
            return res.status(400).send('Already in your friend list'); // Send response if already friends
        }


        // Remove AcceptOf in the Incomming list of Acceptor
        await UserSchema.updateOne(
            {Name: Acceptor}, 
            {
                $pull: {incomingRequests: AcceptOf},
                // Add Acceptor to the friends of AcceptOf
                $addToSet: {Friends: AcceptOf}
            }
        );
        // Remove Acceptor from the Outgoing List Of AcceptOf
        await UserSchema.updateOne(
            {Name: AcceptOf}, 
            {
                $pull: {outgoingRequests: Acceptor},
                // Add AcceptOf to the friends of Acceptor
                $addToSet: {Friends: Acceptor}
            }
        );

        res.status(200).json('success');
    } catch(error) {
        console.log(error)
        res.status(500).json('An error occurred');
    }
})
router.post('/getFriends', async (req,res)=> {
    try {
        const {OfFriends} = req.body
        const ofUserFriends = await UserSchema.findOne({Name: OfFriends})
        res.status(200).json(ofUserFriends.Friends)
    } catch(error) {
        console.log(error)
        res.status(500).json('error');
    }
})
router.post('/postMessages', async (req,res)=> {
    try {
        const {RoomIdFromClient, messagesFromClient, nameFromClient} = req.body;

        const currentUser = nameFromClient
        const otherUser = RoomIdFromClient.split('_').find((user) => user !== currentUser);
        
        messagesFromClient.map(message => {
            if(message.type == 'outgoing') {
                delete message.type
                message.sender = currentUser
                message.recipient = otherUser
            } else {
                delete message.type
                message.sender = otherUser
                message.recipient = currentUser
            }
        })

        const MessageRoom = await MessageSchema.findOne({RoomId: RoomIdFromClient})
        if(!MessageRoom) {
            const MessageRoomNew = new MessageSchema({RoomId: RoomIdFromClient, messages: messagesFromClient});
            MessageRoomNew.save();
            console.log('messages created')
        } else {
            MessageRoom.messages.push(...messagesFromClient);
            MessageRoom.save()
        }


        req.io.to(RoomIdFromClient).emit('messageUpdate', true);
        console.log("successfully added messages and sent bullean true to other client")
    } catch(error) {
        console.error(error)
    }
})
router.post('/getMessages', async (req,res)=> {
    const {idFromClient} = req.body
    const roomMessages = await MessageSchema.findOne({RoomId: idFromClient})
    console.log(roomMessages)
    res.send(roomMessages);
})

module.exports = router;
