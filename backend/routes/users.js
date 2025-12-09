const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const FoodDonation = require("../models/FoodDonation");
const User = require("../models/User");

// GET /api/users/me
// Returns profile + last delivery address if user has previously received/claimed food
router.get("/me", auth, async (req, res) => {
  try {
    // User without password
    const user = await User.findById(req.user.id).select("-password");

    // Last claimed donation that contains a deliveryAddress
    const last = await FoodDonation.findOne({
      claimedBy: req.user.id,
      deliveryAddress: { $ne: null }
    })
      .sort({ claimedAt: -1 })
      .select("deliveryAddress claimedAt");

    res.json({
      user,
      lastDeliveryAddress: last ? last.deliveryAddress : null,
      lastDeliveryAt: last ? last.claimedAt : null
    });
  } catch (err) {
    console.error("Get user me error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
