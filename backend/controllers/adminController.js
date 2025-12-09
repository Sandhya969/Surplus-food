const User = require("../models/User");
const FoodDonation = require("../models/FoodDonation");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("Admin Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllDonations = async (req, res) => {
  try {
    const donations = await FoodDonation.find().populate("donor", "name email");
    res.json(donations);
  } catch (err) {
    console.error("Admin Donation Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
