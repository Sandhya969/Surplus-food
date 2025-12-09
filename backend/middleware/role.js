module.exports = (roles = []) => (req,res,next) => {
  if (typeof roles === 'string') roles = [roles];
  if (!roles.includes(req.user.role)) return res.status(403).json({ msg:'Forbidden' });
  next();
};
