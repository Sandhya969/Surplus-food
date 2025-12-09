// backend/middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const header = req.header("Authorization") || req.header("authorization");
  const token = header ? header.replace("Bearer ", "").trim() : null;

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Support either { id, role } or { user: { id, role } }
    req.user = {
      id: decoded.id || decoded.user?.id,
      role: decoded.role || decoded.user?.role
    };

    if (!req.user.id) {
      return res.status(401).json({ msg: "Invalid token structure" });
    }

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
