const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const User = require('../models/User');
const FoodDonation = require('../models/FoodDonation');
const Allergen = require('../models/Allergen');

// basic analytics
router.get('/analytics', auth, role(['admin']), async (req, res) => {
  const totalDonated = await FoodDonation.countDocuments();
  const activeVolunteers = await User.countDocuments({ role: 'volunteer' });
  const delivered = await FoodDonation.countDocuments({ status: 'delivered' });
  res.json({ totalDonated, activeVolunteers, delivered });
});

// manage users
router.get('/users', auth, role(['admin']), async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

router.delete('/user/:id', auth, role(['admin']), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// approve/reject donation
router.post('/donation/:id/approve', auth, role(['admin']), async (req, res) => {
  const donation = await FoodDonation.findById(req.params.id);
  if (!donation) return res.status(404).json({ message: 'Not found' });
  donation.status = 'available';
  await donation.save();
  res.json(donation);
});

router.post('/donation/:id/reject', auth, role(['admin']), async (req, res) => {
  const donation = await FoodDonation.findById(req.params.id);
  if (!donation) return res.status(404).json({ message: 'Not found' });
  donation.status = 'rejected';
  await donation.save();
  res.json(donation);
});

// allergen CRUD
router.get('/allergens', auth, role(['admin']), async (req, res) => {
  const list = await Allergen.find();
  res.json(list);
});
router.post('/allergens', auth, role(['admin']), async (req, res) => {
  const item = new Allergen({ name: req.body.name });
  await item.save();
  res.json(item);
});
router.delete('/allergens/:id', auth, role(['admin']), async (req, res) => {
  await Allergen.findByIdAndDelete(req.params.id);
  res.json({ message: 'deleted' });
});

module.exports = router;
