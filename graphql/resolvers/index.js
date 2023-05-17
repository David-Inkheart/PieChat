const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const messagesResolvers = require('./messages');
const chatroomResolvers = require('./chatroom');

module.exports = {
    Query: {
        ...postsResolvers.Query,
        ...messagesResolvers.Query,
        ...chatroomResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...messagesResolvers.Mutation,
        ...chatroomResolvers.Mutation
    }
};