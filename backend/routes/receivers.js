const express = require('express');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const ReceiverRequest = require('../models/ReceiverRequest');
const FoodDonation = require('../models/FoodDonation');
const router = express.Router();

router.post('/:donationId/request', auth, role('receiver'), async (req,res) => {
  const donation = await FoodDonation.findById(req.params.donationId);
  if(!donation || donation.status !== 'available') return res.status(400).json({ msg:'Not available' });
  const existing = await ReceiverRequest.findOne({ donation: donation._id, receiver: req.user._id });
  if(existing) return res.status(400).json({ msg:'Already requested' });
  const request = new ReceiverRequest({ donation: donation._id, receiver: req.user._id });
  await request.save();
  req.io.to(String(donation.donor)).emit('receiver-request', request);
  res.json(request);
});

router.get('/my', auth, role('receiver'), async (req,res) => {
  const reqs = await ReceiverRequest.find({ receiver: req.user._id }).populate('donation');
  res.json(reqs);
});

module.exports = router;
