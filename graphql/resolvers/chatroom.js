const Chatroom = require('../../models/Chatroom');
const { UserInputError } = require('apollo-server');
module.exports = {
    Query: {
        async getChatrooms() {
            try {
                const chatrooms = await Chatroom.find();
                return chatrooms;
            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async createChatroom(_, { name }, context) {
            // Validate if chatroom already exists
            const existingChatroom = await Chatroom.findOne({ name });
            if (existingChatroom) {
                throw new UserInputError('Chatroom already exists', {
                    errors: {
                        name: 'This chatroom already exists'
                    }
                });
            }
            // Check authentication and permissions here if needed
            const newChatroom = new Chatroom({
                name,
                createdAt: new Date().toISOString(),
                users: [], // Add user references if needed
                messages: [] // Add message references if needed
            });

            const chatroom = await newChatroom.save();
            return chatroom;
        }
    }
};