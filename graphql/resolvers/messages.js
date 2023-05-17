const { AuthenticationError } = require('apollo-server');

const Message = require('../../models/Message');
const checkAuth = require('../../util/validators');

module.exports = {
  Mutation: {
    createMessage: async (_, { chatroomId, body }, context) => {
      const user = checkAuth(context);

      if (body.trim() === '') {
        throw new Error('Message body must not be empty');
      }

      try {
        const newMessage = new Message({
          body,
          username: user.username, // Set the username from the authenticated user
          createdAt: new Date().toISOString(),
          chatroom: chatroomId
        });

        const message = await newMessage.save();

        return message;
      } catch (err) {
        throw new Error(err);
      }
    }
  }
};
