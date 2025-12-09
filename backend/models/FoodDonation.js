const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FoodDonationSchema = new Schema({
  donor: { type: Schema.Types.ObjectId, ref: 'User', required:true },
  name: { type:String, required:true },
  quantity: { amount: Number, unit: String },
  foodType: { type:String, enum:['cooked','raw','packaged'], default:'cooked' },
  allergens: [{ type: Schema.Types.ObjectId, ref: 'Allergen' }], // selected allergens
  prepTime: { type: Date },
  location: {
    address: String,
    coordinates: { type:[Number], default:[0,0] }
  },
  imageUrl: String,
  status: { type:String, enum:['available','assigned','picked','delivered','expired'], default:'available' },
  createdAt: { type:Date, default: Date.now },
  expiresAt: { type:Date }
});
FoodDonationSchema.index({ 'location.coordinates': '2dsphere' });
module.exports = mongoose.model('FoodDonation', FoodDonationSchema);
