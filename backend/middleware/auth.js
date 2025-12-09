const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req,res,next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if(!token) return res.status(401).json({ msg:'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if(!req.user) return res.status(401).json({ msg:'Invalid token' });
    next();
  } catch(err) {
    res.status(401).json({ msg:'Token invalid', err: err.message });
  }
};
