const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema/typeDefs');
const resolvers = require('./resolvers/postResolvers');
const connectDB = require('./config/db');
const { graphqlUploadExpress } = require('graphql-upload');
const path = require('path');

// Port number (ensure it's defined)
const PORT = process.env.PORT || 4000;

// Connect to the database
connectDB();

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  const app = express();

  // File upload middleware
  app.use(graphqlUploadExpress());

  // Serve static files from 'uploads' directory
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  server.applyMiddleware({ app });

  await new Promise((resolve) => app.listen({ port: PORT }, resolve));
  console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
}

startServer();
