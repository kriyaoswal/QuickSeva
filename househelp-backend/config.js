module.exports = {
  mongoURI: process.env.MONGO_URI || 'mongodb+srv://kriyaoswal:admin@cluster0.cfjlf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  jwtSecret: process.env.JWT_SECRET || 'f5bc1ef2bb9c1b490fa946f2aeb7e4a7f27bd81ff07a4dba76fe6d5df65d47c42cc9808f4f1b0b4d35d116ab4c1f4f9be3e9a11b0f7ecb3a8bb4cf4343471fb9'
};
