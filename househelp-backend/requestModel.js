const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestSchema = new Schema({
  maidUsernames: [{ type: String }],  // Array of maid usernames
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  requestTime: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
});

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;
