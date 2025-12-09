require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Allergen = require('../models/Allergen');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const run = async () => {
  await connectDB();
  await Allergen.deleteMany({});
  const allergens = ['peanuts','milk','eggs','gluten','soy','shellfish','tree-nuts'];
  for(const a of allergens) await new Allergen({ name: a }).save();
  await User.deleteMany({});
  const salt = await bcrypt.genSalt(10);
  const admin = new User({
    name:'Admin', email:'admin@surplus.com', password: await bcrypt.hash('admin123', salt), role:'admin', verified:true
  });
  const donor = new User({
    name:'Donor1', email:'donor@surplus.com', password: await bcrypt.hash('donor123', salt), role:'donor', verified:true
  });
  const volunteer = new User({
    name:'Volunteer1', email:'vol@surplus.com', password: await bcrypt.hash('vol123', salt), role:'volunteer', verified:true
  });
  const receiver = new User({
    name:'Receiver1', email:'recv@surplus.com', password: await bcrypt.hash('recv123', salt), role:'receiver', verified:true
  });
  await admin.save(); await donor.save(); await volunteer.save(); await receiver.save();
  console.log('Seed done');
  process.exit(0);
};
run().catch(e=>{console.error(e); process.exit(1)});
