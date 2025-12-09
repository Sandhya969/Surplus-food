const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VolunteerAssignmentSchema = new Schema({
  donation: { type: Schema.Types.ObjectId, ref: 'FoodDonation', required:true },
  volunteer: { type: Schema.Types.ObjectId, ref: 'User', required:true },
  status: { type:String, enum:['accepted','picked','delivered','cancelled'], default:'accepted' },
  acceptedAt: Date,
  pickedAt: Date,
  deliveredAt: Date,
  createdAt: { type:Date, default: Date.now }
});

module.exports = mongoose.model('VolunteerAssignment', VolunteerAssignmentSchema);
