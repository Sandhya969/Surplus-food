require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Allergen = require('../models/Allergen');
const FoodDonation = require('../models/FoodDonation');
const bcrypt = require('bcrypt');

async function seed() {
  await connectDB();
  console.log('Seeding...');
  await User.deleteMany({});
  await Allergen.deleteMany({});
  await FoodDonation.deleteMany({});

  const pw = await bcrypt.hash('password123', 10);
  const admin = await new User({ name: 'Admin', email: 'admin@local', password: pw, role: 'admin' }).save();
  const donor = await new User({ name: 'Donor A', email: 'donor@local', password: pw, role: 'donor' }).save();
  const volunteer = await new User({ name: 'Volunteer V', email: 'vol@local', password: pw, role: 'volunteer' }).save();
  const receiver = await new User({ name: 'Receiver R', email: 'recv@local', password: pw, role: 'receiver' }).save();

  const allergens = ['peanuts','milk','eggs','gluten','soy','shellfish'];
  for (let a of allergens) await new Allergen({ name: a }).save();

  await new FoodDonation({
    donor: donor._id,
    foodName: 'Vegetable Biryani',
    quantity: 20,
    unit: 'plates',
    foodType: 'cooked',
    allergens: ['milk'],
    preparedAt: new Date(),
    location: { address: 'City Kitchen', coordinates: [77.567, 12.9716] },
    status: 'available',
    expiresAt: new Date(Date.now() + 1000*60*60*6)
  }).save();

  console.log('Seed done. Admin: admin@local / password123');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
