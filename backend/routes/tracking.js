const express = require("express");
const router = express.Router();
const FoodDonation = require("../models/FoodDonation");
const auth = require("../middleware/auth");

// Get tracking updates for a donation
router.get("/:id", auth, async (req, res) => {
  try {
    const donation = await FoodDonation.findById(req.params.id)
      .populate("donor receiver volunteer", "name email");

    res.json(donation);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
