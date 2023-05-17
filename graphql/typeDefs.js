const { gql } = require('apollo-server');

// define graphql schema
module.exports = gql`
    type Post {
        id: ID!
        body: String!
        createdAt: String!
        username: String!
    }
    type User {
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
    }
    type Chatroom {
        id: ID!
        name: String
        createdAt: String!
        users: [User!]!
        messages: [Message!]!
    }
    type Message {
        id: ID!
        body: String!
        createdAt: String!
        username: String!
        chatroom: Chatroom!
    }
    input RegisterInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }
    type Query {
        getPosts: [Post]
        getChatrooms: [Chatroom]
        getMessages: [Message]
    }
    type Mutation{
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
        createChatroom(name: String!): Chatroom!
        createMessage(username: String!, body: String!, chatroomId: ID!): Message!
    }
`;