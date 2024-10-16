const mongoose = require('mongoose');

const acceptedRequestSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, required: true },
  maidId: { type: mongoose.Schema.Types.ObjectId, required: true },
  maidUsername: { type: String, required: true },
  maidPhone: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  username: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  details: { type: String, required: true },
}, { timestamps: true });

const AcceptedRequest = mongoose.model('AcceptedRequest', acceptedRequestSchema);

module.exports = AcceptedRequest;
