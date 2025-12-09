const User = require("../models/User");

exports.getReceivers = async (req, res) => {
  try {
    const receivers = await User.find({ role: "receiver" }).select("-password");
    res.json(receivers);
  } catch (err) {
    console.error("Receiver Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
