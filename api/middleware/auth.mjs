import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.mjs";
import "dotenv/config";

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
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        authProviders: true,
        settings: true
      }
    });
    if (!user) return res.status(401).json({ message: "User not found" });
    res.user = user;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

export default requireAuth;
