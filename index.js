const { ApolloServer } = require('apollo-server');
// const { PubSub } = require("graphql-subscriptions")
const mongoose = require('mongoose');

// Import graphql schema
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { MONGODB } = require('./config.js');

// const pubsub = new PubSub();

// Create an instance of Apollo server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req})
  });

// connect to MongoDB Database and start the server
mongoose
    .connect(MONGODB, { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDB Connected');
        return server.listen({ port: 5000 });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  });