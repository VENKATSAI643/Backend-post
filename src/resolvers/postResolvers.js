const Post = require('../models/Post');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const { GraphQLUpload } = require('graphql-upload');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const path = require('path');

const postResolvers = {
  Upload: GraphQLUpload,

  Query: {
    getPost: async (_, { id }) => {
      return await Post.findById(id);
    },
    getPosts: async () => {
      return await Post.find();
    },
  },

  Post: {
    likes: async (post) => {
      return await Like.find({ post_id: post.id }); 
    },
    comments: async (post) => {
      return await Comment.find({ post_id: post.id });
    },
  },

  Mutation: {
    createPost: async (_, { files, caption, user_id }) => {
      const unique = uuid();
      const { createReadStream, filename } = await files;
      const uploadDir = path.join(__dirname, '../../uploads');

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }

      const filePath = path.join(uploadDir, `${unique}-${filename}`);
      const stream = createReadStream();
      const out = fs.createWriteStream(filePath);
      stream.pipe(out);

      try {
        await new Promise((resolve, reject) => {
          out.on('finish', resolve);
          out.on('error', reject);
        });

        const newPost = new Post({
          caption,
          image_url: `http://localhost:4000/uploads/${unique}-${filename}`,
          user_id,
        });

        return await newPost.save();
      } catch (error) {
        throw new Error('File upload failed');
      }
    },

    updatePost: async (_, { id, caption }) => {
      return await Post.findByIdAndUpdate(id, { caption }, { new: true });
    },

    deletePost: async (_, { id }) => {
      const deletedPost = await Post.findByIdAndDelete(id);
      if (!deletedPost) {
        throw new Error(`Post with ID ${id} not found.`);
      }
      return deletedPost; 
    },

    createLike: async (_, { user_id, post_id }) => {
      const existingLike = await Like.findOne({ user_id, post_id });
      if (existingLike) {
        throw new Error("User already liked this post");
      }

      const likedPost = new Like({
        user_id,
        post_id,
      });

      await Post.findByIdAndUpdate(
        post_id,
        { $inc: { likes_count: 1 } }, 
        { new: true }
      );

      return await likedPost.save();
    },

    unLike: async (_, { user_id, post_id }) => {
      try {
        const like = await Like.findOneAndDelete({ user_id, post_id });
    
        if (!like) {
          return false;
        }
    
        await Post.findByIdAndUpdate(
          post_id,
          { $inc: { likes_count: -1 } }, 
          { new: true }
        );
    
        return true; 
      } catch (error) {
        console.error(error);
        return false; 
      }
    },

    createComment: async (_, { user_id, post_id, comment }) => {
      const existingComment = await Comment.findOne({ user_id, post_id });
      if (existingComment) {
        throw new Error("User already commented");
      }

      const commentPost = new Comment({
        user_id,
        post_id,
        comment,
      });

      await Post.findByIdAndUpdate(
        post_id,
        { $inc: { comments_count: 1 } }, 
        { new: true }
      );

      return await commentPost.save();
    },

    updateComment: async (_, { user_id, post_id, comment }) => {
      try {
        const existingComment = await Comment.findOne({ user_id, post_id });

        if (!existingComment) {
          throw new Error("Comment not found");
        }

        existingComment.comment = comment;

        return await existingComment.save();
      } catch (error) {
        throw new Error("Failed to update comment");
      }
    },

    deleteComment: async (_, { user_id, post_id }) => {
      try {
        const deletedComment = await Comment.findOneAndDelete({ user_id, post_id });

        if (!deletedComment) {
          throw new Error("Comment not found or already deleted");
        }

        await Post.findByIdAndUpdate(
          post_id,
          { $inc: { comments_count: -1 } }, 
          { new: true }
        );

        return deletedComment;
      } catch (error) {
        throw new Error("Failed to delete comment");
      }
    },
  },
};

module.exports = postResolvers;
