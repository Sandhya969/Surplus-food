const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
  donation: { type: Schema.Types.ObjectId, ref: 'FoodDonation' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  rating: Number,
  comment: String,
  createdAt: { type:Date, default: Date.now }
});
module.exports = mongoose.model('Feedback', FeedbackSchema);
