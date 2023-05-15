const { model, Schema } = require('mongoose');

const chatRoomSchema = new Schema({
    name: String,
    createdAt: String,
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