const jwt = require("jsonwebtoken");
const User = require("../model/User.js");
require("dotenv").config();

const requireAuth = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "JWT secret not configured" });
    }
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: "User not found" });
    res.user = user;
    next();
  } catch (_err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = requireAuth;
