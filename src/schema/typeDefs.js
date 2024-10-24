const { gql } = require('apollo-server');

const typeDefs = gql`
  scalar Upload

  type Post {
    id: ID!
    caption: String!
    image_url: String!
    user_id: ID!
    likes_count: Int
    comments_count: Int
    createdAt: String 
    likes: [Like!]! 
    comments: [Comment!]! 
  }
  
  type Like {
    user_id: ID!
    post_id: ID!
    createdAt: String
  }
  
  type Comment {
    user_id: ID!
    post_id: ID!
    comment: String!
    createdAt: String 
  }

  type Query {
    getPost(id: ID!): Post
    getPosts: [Post]
  }

  type Mutation {
    createPost(files: Upload!, user_id: ID!, caption: String!): Post
    updatePost(id: ID!, caption: String!): Post
    deletePost(id: ID!): Post
    createLike(user_id: ID!, post_id: ID!): Like
    unLike(user_id: ID!, post_id: ID!): Boolean
    createComment(user_id: ID!, post_id: ID!, comment: String!): Comment
    updateComment(user_id: ID!, post_id: ID!, comment: String!): Comment
    deleteComment(user_id: ID!, post_id: ID!): Comment 
  }
`;

module.exports = typeDefs;
