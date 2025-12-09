const express = require('express');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const VolunteerAssignment = require('../models/VolunteerAssignment');
const router = express.Router();

router.get('/my', auth, role('volunteer'), async (req,res) => {
  const assignments = await VolunteerAssignment.find({ volunteer: req.user._id }).populate('donation');
  res.json(assignments);
});

router.post('/availability', auth, role('volunteer'), async (req,res) => {
  req.user.available = !!req.body.available;
  await req.user.save();
  res.json({ available: req.user.available });
});

module.exports = router;
