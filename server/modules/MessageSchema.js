const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    RoomId: {
        type: String,
        required: true,
        unique: true
    },
    messages: {
        type: [Object],
        required: true,
    }
})

module.exports = mongoose.model('messages', MessageSchema)