import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.mjs';
import { asyncHandler } from '../lib/errors.mjs';
import { generateToken, findUserByEmail, createUser } from '../services/auth.service.mjs';
import { validate } from '../middleware/validate.mjs';
import { authLimiter } from '../middleware/rateLimit.mjs';
import {
  registerSchema,
  loginSchema,
  googleSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth.validator.mjs';

const router = Router();

router.post(
  '/google',
  validate(googleSchema),
  asyncHandler(async (req, res) => {
    const { providerId, name, email, avatar } = req.body;

    let user = await findUserByEmail(email);

    if (!user) {
      user = await createUser({
        email,
        name,
        avatar,
        authProviders: {
          create: { provider: 'google', providerId }
        }
      });
    } else {
      const alreadyLinked = user.authProviders.some((p) => p.provider === 'google');
      if (!alreadyLinked) {
        await prisma.authProvider.create({
          data: { userId: user.id, provider: 'google', providerId }
        });
      }
    }

    res.json({ token: generateToken(user.id), user });
  })
);

router.post(
  '/register',
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;

    let user = await findUserByEmail(email);

    if (user) {
      const hasLocalProvider = user.authProviders.some((p) => p.provider === 'local');
      if (hasLocalProvider) {
        const error = new Error('User already exists');
        error.statusCode = 400;
        throw error;
      }
      await prisma.authProvider.create({
        data: { userId: user.id, provider: 'local', providerId: email }
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      user = await createUser({
        email,
        name: name || email.split('@')[0],
        avatar: null,
        passwordHash,
        authProviders: {
          create: { provider: 'local', providerId: email }
        }
      });
    }

    res.json({ token: generateToken(user.id), user });
  })
);

router.post(
  '/login',
  authLimiter,
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 400;
      throw error;
    }

    const localProvider = user.authProviders.find((p) => p.provider === 'local');
    if (!localProvider) {
      const error = new Error('Invalid credentials');
      error.statusCode = 400;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.statusCode = 400;
      throw error;
    }

    res.json({ token: generateToken(user.id), user });
  })
);

router.post(
  '/forgot-password',
  authLimiter,
  validate(forgotPasswordSchema),
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return res.json({ message: 'If the email exists, a reset link has been sent' });
    }

    const hasLocalProvider = user.authProviders.some((p) => p.provider === 'local');
    if (!hasLocalProvider) {
      return res.json({ message: 'If the email exists, a reset link has been sent' });
    }

    const resetToken = jwt.sign(
      { userId: user.id, type: 'reset' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log(`Password reset token for ${email}: ${resetToken}`);
    console.log(`Reset link: yourapp://reset-password?token=${resetToken}`);

    res.json({ message: 'If the email exists, a reset link has been sent' });
  })
);

router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== 'reset') {
      const error = new Error('Invalid token');
      error.statusCode = 400;
      throw error;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash }
    });

    res.json({ message: 'Password reset successfully' });
  })
);

export default router;
