const express = require('express');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const User = require('../models/User');
const FoodDonation = require('../models/FoodDonation');
const Allergen = require('../models/Allergen');
const router = express.Router();

router.get('/users', auth, role('admin'), async (req,res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

router.post('/allergens', auth, role('admin'), async (req,res) => {
  const { name } = req.body;
  const a = new Allergen({ name });
  await a.save();
  res.json(a);
});

router.put('/donation/:id/approve', auth, role('admin'), async (req,res) => {
  const d = await FoodDonation.findById(req.params.id);
  if(!d) return res.status(404).json({ msg:'Not found' });
  d.status = 'available';
  await d.save();
  res.json(d);
});

router.put('/donation/:id/reject', auth, role('admin'), async (req,res) => {
  const d = await FoodDonation.findById(req.params.id);
  if(!d) return res.status(404).json({ msg:'Not found' });
  d.status = 'expired';
  await d.save();
  res.json(d);
});

// analytics simple
router.get('/analytics', auth, role('admin'), async (req,res) => {
  const totalDonated = await FoodDonation.countDocuments();
  const totalVolunteers = await User.countDocuments({ role:'volunteer' });
  const completedDeliveries = await FoodDonation.countDocuments({ status:'delivered' });
  res.json({ totalDonated, totalVolunteers, completedDeliveries });
});

module.exports = router;
