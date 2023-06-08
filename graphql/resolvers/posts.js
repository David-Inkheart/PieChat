const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    async getPosts () {
      try {
        // sort post by latest first
        const Posts = await Post.find().sort({ createdAt: -1 });
        return Posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPost (_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error('Post not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async createPost (_, { body }, context) {
      const user = checkAuth(context);

      if (body.trim() === '') {
        throw new UserInputError('Post body must not be empty');
      }

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      });

      const post = await newPost.save();

      context.pubsub.publish('NEW_POST', {
        newPost: post
      });

      return post;
    },
    async updatePost (_, { postId, body }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (post) {
          if (user.username === post.username) {
            post.body = body;
            await post.save();
            return post;
          } else {
            throw new AuthenticationError('Action not allowed');
          }
        } else {
          throw new UserInputError('Post not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async deletePost (_, { postId }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (post) {
          if (user.username === post.username) {
            await post.deleteOne();
            return 'Post deleted successfully';
          } else {
            throw new AuthenticationError('Action not allowed');
          }
        } else {
          throw new UserInputError('Post not found');
        }
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    async likePost (_, { postId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);

      if (post) {
        if (post.likes.find(like => like.username === username)) {
          // Post already liked, unlike it
          post.likes = post.likes.filter(like => like.username !== username);
        } else {
          // Not liked, like post
          post.likes.push({
            username,
            createdAt: new Date().toISOString()
          });
        }
        await post.save();

        context.pubsub.publish('NEW_LIKE', {
          newLike: post
        });
        return post;
      } else throw new UserInputError('Post not found');
    }
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
    },
    newComment: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_COMMENT')
    },
    newLike: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_LIKE')
    },
    newMessage: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_MESSAGE')
    }
  }
};
