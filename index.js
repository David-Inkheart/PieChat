const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');

const Post = require('./models/Post');
const { MONGODB } = require('./config.js');

// define graphql schema
const typeDefs = gql`
    type Post {
        id: ID!
        body: String!
        createdAt: String!
        username: String!
    }
    type Query {
        getPosts: [Post]
    }
`;

// Define graphql resolver
const resolvers = {
    Query: {
       async getPosts(){
            try{
                const Posts = await Post.find();
                return Posts;
            } catch(err){
                throw new Error(err);
            }
        }
    }
}

// Create an instance of Apollo server
const server = new ApolloServer({
    typeDefs,
    resolvers
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