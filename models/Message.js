const { model, Schema } = require('mongoose');

const messageSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    chatroom: {
        type: Schema.Types.ObjectId,
        ref: 'Chatroom'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});

module.exports = model('Message', messageSchema);