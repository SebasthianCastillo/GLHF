import { Router } from 'express';
import prisma from '../lib/prisma.mjs';
import requireAuth from '../middleware/auth.mjs';
import { asyncHandler } from '../lib/errors.mjs';
import { validate } from '../middleware/validate.mjs';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createExpenseCategorySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  parentId: z.number().optional().nullable(),
});

const updateExpenseCategorySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
});

// Get all expense categories for user (with hierarchy)
router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.res.user.id);
    
    const categories = await prisma.expenseCategory.findMany({
      where: { userId },
      include: {
        children: {
          include: {
            children: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    // Filter to only root categories (no parent)
    const rootCategories = categories.filter(c => !c.parentId);
    
    res.status(200).json(rootCategories);
  })
);

// Get single category with subcategories
router.get(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.res.user.id);
    const categoryId = parseInt(req.params.id);
    
    const category = await prisma.expenseCategory.findFirst({
      where: { id: categoryId, userId },
      include: {
        children: true,
        parent: true
      }
    });
    
    if (!category) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    
    res.status(200).json(category);
  })
);

// Create expense category
router.post(
  '/',
  requireAuth,
  validate(createExpenseCategorySchema),
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.res.user.id);
    const { name, parentId } = req.body;
    
    // Check for duplicate name at same level
    const existing = await prisma.expenseCategory.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        userId,
        parentId: parentId || null
      }
    });
    
    if (existing) {
      return res.status(400).json({ error: "Ya existe una categoría con este nombre en este nivel" });
    }
    
    const category = await prisma.expenseCategory.create({
      data: {
        name,
        parentId: parentId || null,
        userId
      }
    });
    
    res.status(201).json(category);
  })
);

// Update expense category
router.put(
  '/:id',
  requireAuth,
  validate(updateExpenseCategorySchema),
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.res.user.id);
    const categoryId = parseInt(req.params.id);
    const { name } = req.body;
    
    // Check ownership
    const existing = await prisma.expenseCategory.findFirst({
      where: { id: categoryId, userId }
    });
    
    if (!existing) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    
    // Check for duplicate name at same level
    const duplicate = await prisma.expenseCategory.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        userId,
        parentId: existing.parentId,
        id: { not: categoryId }
      }
    });
    
    if (duplicate) {
      return res.status(400).json({ error: "Ya existe una categoría con este nombre en este nivel" });
    }
    
    const category = await prisma.expenseCategory.update({
      where: { id: categoryId },
      data: { name }
    });
    
    res.status(200).json(category);
  })
);

// Delete expense category (cascades to subcategories)
router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.res.user.id);
    const categoryId = parseInt(req.params.id);
    
    // Check ownership
    const existing = await prisma.expenseCategory.findFirst({
      where: { id: categoryId, userId }
    });
    
    if (!existing) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    
    // Check if has associated expenses
    const expenseCount = await prisma.expense.count({
      where: { expenseCategoryId: categoryId }
    });
    
    if (expenseCount > 0) {
      return res.status(400).json({ 
        error: "No se puede eliminar: hay gastos asociados",
        expenseCount 
      });
    }
    
    // Delete (cascades to children due to onDelete: Cascade)
    await prisma.expenseCategory.delete({
      where: { id: categoryId }
    });
    
    res.status(200).json({ message: "Categoría eliminada" });
  })
);

export default router;