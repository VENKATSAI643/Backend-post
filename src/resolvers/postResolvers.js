const Post = require('../models/Post');
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

  Mutation: {
    uploadFile: async (_, { file }) => {
      const unique = uuid();
      const { createReadStream, filename } = await file;
      const uploadDir = path.join(__dirname, '../../uploads');

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }

      const filePath = path.join(uploadDir, `${unique}-${filename}`);
      const stream = createReadStream();
      const out = fs.createWriteStream(filePath);
      stream.pipe(out);

      await new Promise((resolve, reject) => {
        out.on('finish', resolve);
        out.on('error', reject);
      });

      return {
        status: 200,
        url: `http://localhost:4000/uploads/${unique}-${filename}`, // Return public file URL
      };
    },

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
          image_url: `http://localhost:4000/uploads/${unique}-${filename}`, // Save public image URL
          user_id,
        });

        return await newPost.save(); // Save post in DB and return the created post
      } catch (error) {
        throw new Error('File upload failed');
      }
    },

    updatePost: async (_, { id, caption, image_url }) => {
      return await Post.findByIdAndUpdate(id, { caption, image_url }, { new: true });
    },

    deletePost: async (_, { id }) => {
      return await Post.findByIdAndDelete(id);
    },
  },
};

module.exports = postResolvers;
