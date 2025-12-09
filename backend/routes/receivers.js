const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const ReceiverRequest = require('../models/ReceiverRequest');
const FoodDonation = require('../models/FoodDonation');

// request donation
router.post('/request/:donationId', auth, role(['receiver']), async (req, res) => {
  const donation = await FoodDonation.findById(req.params.donationId);
  if (!donation || donation.status !== 'available') return res.status(400).json({ message: 'Not available' });

  const existing = await ReceiverRequest.findOne({ receiver: req.user._id, donation: donation._id });
  if (existing) return res.status(400).json({ message: 'Already requested' });

  const reqDoc = new ReceiverRequest({ receiver: req.user._id, donation: donation._id, status: 'pending' });
  await reqDoc.save();
  res.json(reqDoc);
});

// receiver can view their requests
router.get('/my', auth, role(['receiver']), async (req, res) => {
  const items = await ReceiverRequest.find({ receiver: req.user._id }).populate('donation');
  res.json(items);
});

// update feedback
router.post('/feedback/:requestId', auth, role(['receiver']), async (req, res) => {
  const rr = await ReceiverRequest.findById(req.params.requestId);
  if (!rr) return res.status(404).json({ message: 'Not found' });
  if (rr.receiver.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
  rr.feedback = req.body.feedback;
  await rr.save();
  res.json(rr);
});

module.exports = router;
