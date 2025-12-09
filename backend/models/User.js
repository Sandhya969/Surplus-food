const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type:String, required:true, unique:true },
  password: { type:String, required:true },
  mobile: { type: String },
  role: { type: String, enum: ['Donor','Volunteer','Receiver','Admin'], required: true }, // <-- changed
  location: {
    type: { type:String, enum:['Point'], default:'Point' },
    coordinates: { type:[Number], default:[0,0] } // [lng, lat]
  },
  available: { type:Boolean, default:true }, // for volunteers
  verified: { type:Boolean, default:false },
  createdAt: { type:Date, default: Date.now }
});

UserSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', UserSchema);
