const mongoose = require('mongoose');

const VolunteerAssignmentSchema = new mongoose.Schema({
  donation: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodDonation', required: true },
  volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['accepted','picked','delivered'], default: 'accepted' },
  acceptedAt: { type: Date, default: Date.now },
  pickedAt: { type: Date },
  deliveredAt: { type: Date }
});

module.exports = mongoose.model('VolunteerAssignment', VolunteerAssignmentSchema);
