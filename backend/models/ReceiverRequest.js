const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReceiverRequestSchema = new Schema({
  donation: { type: Schema.Types.ObjectId, ref: 'FoodDonation', required:true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required:true },
  status: { type:String, enum:['requested','approved','rejected','collected'], default:'requested' },
  createdAt: { type:Date, default: Date.now }
});

module.exports = mongoose.model('ReceiverRequest', ReceiverRequestSchema);
