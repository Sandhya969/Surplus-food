const express = require('express');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const FoodDonation = require('../models/FoodDonation');
const Allergen = require('../models/Allergen');
const VolunteerAssignment = require('../models/VolunteerAssignment');
const cloudinary = require('../utils/cloudinary');
const router = express.Router();

// create donation (donor only)
router.post('/', auth, role('donor'), async (req,res) => {
  try {
    const { name, quantity, unit, foodType, allergens, prepTime, address, coordinates, imageBase64, expiresAt } = req.body;
    let imageUrl = '';
    if (imageBase64) {
      const upload = await cloudinary.uploader.upload(imageBase64, { folder: 'surplus' });
      imageUrl = upload.secure_url;
    }
    const donation = new FoodDonation({
      donor: req.user._id,
      name,
      quantity: { amount: quantity, unit },
      foodType,
      allergens,
      prepTime,
      location: { address, coordinates },
      imageUrl,
      expiresAt
    });
    await donation.save();
    // emit to volunteers
    req.io.emit('new-donation', donation);
    res.json(donation);
  } catch(err){ res.status(500).json({ msg: err.message }); }
});

// get available donations (public for receivers & volunteers)
router.get('/available', auth, async (req,res) => {
  try {
    // filter params optional
    const { foodType, allergenFree, minQty } = req.query;
    const q = { status: 'available' };
    if(foodType) q.foodType = foodType;
    // allergenFree=true means allergy array is empty
    if(allergenFree === 'true') q.allergens = { $size: 0 };
    if(minQty) q['quantity.amount'] = { $gte: Number(minQty) };
    const list = await FoodDonation.find(q).populate('donor allergens');
    res.json(list);
  } catch(err) { res.status(500).json({ msg: err.message }); }
});

// donor: view own donations
router.get('/my', auth, role('donor'), async (req,res) => {
  const items = await FoodDonation.find({ donor: req.user._id }).populate('allergens');
  res.json(items);
});

// donor edit/delete
router.put('/:id', auth, role('donor'), async (req,res) => {
  // allow update if donor owns it and status is available
  const d = await FoodDonation.findById(req.params.id);
  if(!d) return res.status(404).json({ msg:'Not found' });
  if(String(d.donor) !== String(req.user._id)) return res.status(403).json({ msg:'Forbidden' });
  if(['assigned','picked','delivered'].includes(d.status)) return res.status(400).json({ msg:'Cannot edit' });
  Object.assign(d, req.body);
  await d.save();
  res.json(d);
});
router.delete('/:id', auth, role('donor'), async (req,res) => {
  const d = await FoodDonation.findById(req.params.id);
  if(!d) return res.status(404).json({ msg:'Not found' });
  if(String(d.donor) !== String(req.user._id)) return res.status(403).json({ msg:'Forbidden' });
  await d.deleteOne();
  res.json({ msg:'Deleted' });
});

// assign volunteer (volunteer accepts a donation)
router.post('/:id/accept', auth, role('volunteer'), async (req,res) => {
  const donation = await FoodDonation.findById(req.params.id);
  if(!donation || donation.status !== 'available') return res.status(400).json({ msg:'Not available' });
  donation.status = 'assigned';
  await donation.save();
  const assignment = new VolunteerAssignment({
    donation: donation._id,
    volunteer: req.user._id,
    status: 'accepted',
    acceptedAt: new Date()
  });
  await assignment.save();
  // notify donor and receivers via socket
  req.io.to(String(donation.donor)).emit('assignment', assignment);
  req.io.emit('donation-assigned', { donationId: donation._id, volunteer: req.user._id });
  res.json(assignment);
});

// volunteer status updates
router.post('/assignment/:id/status', auth, role('volunteer'), async (req,res) => {
  const { status } = req.body; // picked, delivered
  const assignment = await VolunteerAssignment.findById(req.params.id).populate('donation');
  if(!assignment) return res.status(404).json({ msg:'Not found' });
  if(String(assignment.volunteer) !== String(req.user._id)) return res.status(403).json({ msg:'Forbidden' });
  assignment.status = status;
  if(status === 'picked') assignment.pickedAt = new Date();
  if(status === 'delivered') {
    assignment.deliveredAt = new Date();
    assignment.donation.status = 'delivered';
    await assignment.donation.save();
  }
  await assignment.save();
  // notify receiver/donor
  req.io.emit('assignment-update', assignment);
  res.json(assignment);
});

module.exports = router;
