// backend/routes/donations.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const FoodDonation = require("../models/FoodDonation");

// POST /api/donations/add  => donor creates donation (address required)
router.post("/add", auth, async (req, res) => {
  try {
    const { foodName, quantity, foodType, allergens = [], address } = req.body;

    if (!foodName || !quantity || !foodType || !address) {
      return res.status(400).json({ message: "foodName, quantity, foodType and address are required" });
    }

    const donation = new FoodDonation({
      donorId: req.user.id,
      foodName,
      quantity,
      foodType,
      allergens,
      address,
      status: "available"
    });

    await donation.save();
    res.status(201).json(donation);
  } catch (err) {
    console.error("Add donation error:", err);
    res.status(500).json({ message: "Error adding donation", details: err.message });
  }
});

// GET /api/donations/my-donations  => donor's own donations
router.get("/my-donations", auth, async (req, res) => {
  try {
    const list = await FoodDonation.find({ donorId: req.user.id }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error("Fetch donations error:", err);
    res.status(500).json({ message: "Error fetching donations" });
  }
});

// GET /api/donations/available  => for receivers to browse available items
router.get("/available", auth, async (req, res) => {
  try {
    const list = await FoodDonation.find({ status: "available" }).populate("donorId", "name email address");
    res.json(list);
  } catch (err) {
    console.error("Get available donations:", err);
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/donations/claim/:id => receiver claims a donation
router.put("/claim/:id", auth, async (req, res) => {
  try {
    const donation = await FoodDonation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: "Donation not found" });
    if (donation.status !== "available") return res.status(400).json({ message: "Donation not available" });

    donation.status = "claimed";
    donation.claimedBy = req.user.id;
    await donation.save();

    res.json(donation);
  } catch (err) {
    console.error("Claim error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
