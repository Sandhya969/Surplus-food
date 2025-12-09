// backend/models/FoodDonation.js
const mongoose = require("mongoose");

const FoodDonationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  foodName: { type: String, required: true },
  quantity: { type: Number, required: true }, // numeric
  foodType: { type: String, enum: ["cooked", "raw", "packaged"], required: true },

  allergens: [{ type: String }], // array of strings

  address: { type: String, required: true }, // pickup address provided by donor

  status: {
    type: String,
    enum: ["available", "claimed", "assigned", "picked-up", "delivered"],
    default: "available"
  },

  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // receiver
  volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

  pickedAt: { type: Date },
  deliveredAt: { type: Date },

}, { timestamps: true });

module.exports = mongoose.model("FoodDonation", FoodDonationSchema);
