const { model, Schema } = require('mongoose');

const chatRoomSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        required: true
    },
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    messages: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Message'
        }
    ]
});

module.exports = model('Chatroom', chatRoomSchema);