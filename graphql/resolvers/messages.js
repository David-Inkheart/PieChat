const { AuthenticationError } = require('apollo-server');

const Message = require('../../models/Message');
const checkAuth = require('../../util/validators');

module.exports = {
  Query: {
    async getMessages() {
      try {
        const messages = await Message.find().sort({ createdAt: -1 });
        return messages;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getMessage(_, { messageId }) {
      try {
        const message = await Message.findById(messageId);
        if (message) {
          return message;
        } else {
          throw new Error('Message not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async createMessage(_, { recipient, content }, context) {
      // Add authentication logic to ensure the user is authorized to create the message
      const user = checkAuth(context);

      if (content.trim() === '') {
        throw new Error('Message body must not be empty');
      }

      const newMessage = new Message({
        sender: user.id,
        recipient,
        content,
        createdAt: new Date().toISOString()
      });

      const message = await newMessage.save();

      context.pubsub.publish('NEW_MESSAGE', {
        newMessage: message
      });

      return message;
    },
    async deleteMessage(_, { messageId }, context) {
      // Add authentication logic to ensure the user is authorized to delete the message
      const user = checkAuth(context);

      try {
        const message = await Message.findById(messageId);
        if (user.id === message.sender.toString()) {
          await message.delete();
          return 'Message deleted successfully';
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      }
      catch (err) {
        throw new Error(err);
      }
    }
  },
  Subscription: {
    newMessage: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_MESSAGE')
    }
  }
};
