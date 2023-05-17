const { ApolloError, AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');

module.exports = {
Query: {
    async getPosts(){
         try {
            // sort post by latest first
            const Posts = await Post.find().sort({ createdAt: -1 });
            return Posts;
        } catch(err) {
            throw new Error(err);
         }
     },
    async getPost(_, { postId }){
        try{
            const post = await Post.findById(postId);
            if(post){
                return post;
            } else {
                throw new Error('Post not found');
            }
        } catch(err){
            throw new Error(err);
        }
    }
 },
    Mutation: {
        async createPost(_, { body }, context){
            const user = checkAuth(context);
            console.log(user);
            
            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            });
            
            const post = await newPost.save();
            
            return post;
        },
        async deletePost(_, { postId }, context){
            const user = checkAuth(context);
            
            try{
                const post = await Post.findById(postId);
                if (post){
                    if(user.username === post.username){
                        await post.deleteOne();
                        return 'Post deleted successfully';
                    } else {
                        throw new AuthenticationError('Action not allowed');
                    }
                } else {
                    throw new UserInputError('Post not found');
                }
            } catch(err){
                throw new ApolloError(err);
            }
        }
    }
};