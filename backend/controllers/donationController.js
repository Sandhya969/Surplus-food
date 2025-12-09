// backend/controllers/donationController.js
const FoodDonation = require("../models/FoodDonation");

// addDonation, getDonorDonations, getAvailableDonations remain as before...
// (keep your existing handlers for add/get — only claimDonation shown/updated)

exports.addDonation = async (req, res) => {
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
};

exports.getDonorDonations = async (req, res) => {
  try {
    const list = await FoodDonation.find({ donorId: req.user.id }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error("Get donor donations:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getAvailableDonations = async (req, res) => {
  try {
    const list = await FoodDonation.find({ status: "available" }).populate("donorId", "name email");
    res.json(list);
  } catch (err) {
    console.error("Get available donations:", err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATED: claimDonation now requires deliveryAddress in body
exports.claimDonation = async (req, res) => {
  try {
    const { deliveryAddress } = req.body;

    if (!deliveryAddress) {
      return res.status(400).json({ message: "Delivery address is required" });
    }

    const donation = await FoodDonation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: "Donation not found" });
    if (donation.status !== "available") return res.status(400).json({ message: "Donation not available" });

    donation.status = "claimed";
    donation.claimedBy = req.user.id;
    donation.claimedAt = new Date();
    donation.deliveryAddress = deliveryAddress;

    await donation.save();

    // Optionally: populate donor info before returning
    await donation.populate("donorId", "name email").execPopulate?.();

    res.json(donation);
  } catch (err) {
    console.error("Claim error:", err);
    res.status(500).json({ message: err.message });
  }
};
