const { gql } = require('apollo-server');

const typeDefs = gql`
  scalar Upload

  type File {
    status: Int!
    url: String!
  }

  type Post {
    id: ID!
    caption: String!
    image_url: String!
    user_id: ID!
  }

  type Query {
    getPost(id: ID!): Post
    getPosts: [Post]
  }

  type Mutation {
    uploadFile(file: Upload!): File
    createPost(files: Upload!, user_id: ID!, caption: String!): Post
    updatePost(id: ID!, caption: String, image_url: String): Post
    deletePost(id: ID!): Post
  }
`;

module.exports = typeDefs;
