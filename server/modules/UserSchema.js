const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
	Name: {type:String, unique: true, required: true},
    Email: {type:String, unique: true,  required: true},
    Password: {type:String, required: true},
    Color: {type: String},
    Friends: {type: [String], default: []},
    outgoingRequests: { type: [String], default: [] }, 
    incomingRequests: { type: [String], default: [] },
})

module.exports = mongoose.model('users', UserSchema)