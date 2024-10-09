// config.js
module.exports = {
    mongoURI: process.env.MONGO_URI || 'mongodb+srv://kriyaoswal:admin@cluster0.cfjlf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret-key'
  };
  