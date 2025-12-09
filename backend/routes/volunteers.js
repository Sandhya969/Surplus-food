// backend/routes/volunteers.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const FoodDonation = require("../models/FoodDonation");

// GET /api/volunteers/tasks
router.get("/tasks", auth, async (req, res) => {
  try {
    const tasks = await FoodDonation.find({
      $or: [
        { status: "claimed", volunteerId: null },
        { volunteerId: req.user.id }
      ]
    })
    .populate("donorId", "name email address")
    .populate("claimedBy", "name email");

    res.json(tasks);
  } catch (err) {
    console.error("Volunteer tasks error:", err);
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/volunteers/accept/:id
router.put("/accept/:id", auth, async (req, res) => {
  try {
    if (req.user.role.toLowerCase() !== "volunteer") {
      return res.status(403).json({ message: "Only volunteers can accept" });
    }

    const donation = await FoodDonation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: "Donation not found" });

    // Check donation is claimed and not already assigned
    if (donation.status !== "claimed") return res.status(400).json({ message: "Donation not in claimed state" });
    if (donation.volunteerId) return res.status(400).json({ message: "Already assigned" });

    // Warn if required fields are missing
    if (!donation.donorId || !donation.address) {
      return res.status(400).json({ message: "Donation missing donorId or address. Cannot accept." });
    }

    donation.status = "assigned";
    donation.volunteerId = req.user.id;

    await donation.save();

    const updatedDonation = await FoodDonation.findById(donation._id)
      .populate("donorId", "name email address")
      .populate("claimedBy", "name email");

    res.json(updatedDonation);
  } catch (err) {
    console.error("Volunteer accept error:", err);
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/volunteers/update-status/:id
router.put("/update-status/:id", auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["picked-up", "delivered"].includes(status)) return res.status(400).json({ message: "Invalid status" });

    const donation = await FoodDonation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: "Donation not found" });

    donation.status = status;
    if (status === "picked-up") donation.pickedAt = new Date();
    if (status === "delivered") donation.deliveredAt = new Date();

    await donation.save();
    res.json(donation);
  } catch (err) {
    console.error("Volunteer update status error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
