// config.js
module.exports = {
    mongoURI: process.env.MONGO_URI || 'your-mongo-connection-string',
    jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret-key'
  };
  