const Post = require('../../models/Post');

module.exports = {
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
};