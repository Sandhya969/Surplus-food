const mongoose = require('mongoose');

const ReceiverRequestSchema = new mongoose.Schema({
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  donation: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodDonation', required: true },
  requestedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending','approved','rejected','fulfilled'], default: 'pending' },
  feedback: { type: String }
});

module.exports = mongoose.model('ReceiverRequest', ReceiverRequestSchema);
