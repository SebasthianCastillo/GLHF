import { Router } from 'express';
import prisma from '../lib/prisma.mjs';
import requireAuth from '../middleware/auth.mjs';
import { asyncHandler } from '../lib/errors.mjs';
import { validate } from '../middleware/validate.mjs';
import { addCategorySchema } from '../validators/category.validator.mjs';

const router = Router();

router.post(
  '/addCategory',
  requireAuth,
  validate(addCategorySchema),
  asyncHandler(async (req, res) => {
    const { Name } = req.body;
    const userId = parseInt(req.res.user.id);
    await prisma.category.create({
      data: { name: Name, userId }
    });
    res.status(201).json({ message: 'Category saved successfully' });
  })
);

router.get(
  '/categories',
  requireAuth,
  asyncHandler(async (req, res) => {
    if (!req.res.user) {
      const error = new Error('User not found');
      error.statusCode = 401;
      throw error;
    }
    const userId = parseInt(req.res.user.id);
    const categories = await prisma.category.findMany({
      where: { userId },
      orderBy: { name: 'desc' }
    });
    res.status(200).json(categories);
  })
);

export default router;
