import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma.mjs";

export const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const findUserByEmail = async (email) =>
  prisma.user.findUnique({
    where: { email },
    include: { authProviders: true },
  });

export const createUser = async (data) =>
  prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data,
      include: { authProviders: true },
    });

    // Create default user settings
    await tx.userSettings.create({
      data: {
        userId: user.id,
        reminderEnabled: true,
        reminderIntervalDays: 7,
        reminderLowStockThreshold: 5,
        stockValueEnabled: true,
      },
    });

    return tx.user.findUnique({
      where: { id: user.id },
      include: { authProviders: true, settings: true },
    });
  });

export const validatePassword = (password, hash) =>
  bcrypt.compare(password, hash);

export const hashPassword = (password) =>
  bcrypt.genSalt(10).then((salt) => bcrypt.hash(password, salt));
