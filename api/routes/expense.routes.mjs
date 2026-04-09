import { Router } from "express";
import requireAuth from "../middleware/auth.mjs";
import { asyncHandler } from "../lib/errors.mjs";
import { validate } from "../middleware/validate.mjs";
import {
  createExpenseSchema,
  expenseQuerySchema,
  payExpenseSchema,
} from "../validators/expense.validator.mjs";
import { getExpenses, createExpense, payExpense } from "../services/expense.service.mjs";
import prisma from "../lib/prisma.mjs";

const router = Router();

router.get(
  "/expenses",
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = req.res.user.id;
    const { fromDate, toDate, categoryId, status, expenseCategoryId } = req.query;

    const expenses = await prisma.$queryRaw`
      SELECT 
        e.id,
        e.amount,
        e.date,
        e."dueDate",
        e.status,
        e."categoryId",
        e."expenseCategoryId",
        e."userId",
        e.description,
        e."createdAt",
        e."updatedAt",
        COALESCE(c.name, ec.name) as "categoryName"
      FROM "Expense" e
      LEFT JOIN "Category" c ON c.id = e."categoryId"
      LEFT JOIN "ExpenseCategory" ec ON ec.id = e."expenseCategoryId"
      WHERE e."userId" = ${userId}
        AND (${fromDate || null}::TEXT IS NULL OR e.date >= ${fromDate || null}::DATE)
        AND (${toDate || null}::TEXT IS NULL OR e.date <= ${toDate || null}::DATE)
        AND (${categoryId || null}::INTEGER IS NULL OR e."categoryId" = ${categoryId || null}::INTEGER)
        AND (${expenseCategoryId || null}::INTEGER IS NULL OR e."expenseCategoryId" = ${expenseCategoryId || null}::INTEGER)
        AND (${status || null}::TEXT IS NULL OR e.status = ${status || null}::"ExpenseStatus")
      ORDER BY e.date DESC
    `;

    res.status(200).json(expenses);
  }),
);

router.post(
  "/CreateExpense",
  requireAuth,
  validate(createExpenseSchema),
  asyncHandler(async (req, res) => {
    const { amount, date, dueDate, categoryId, expenseCategoryId, description, email } = req.body;

    let userId;

    if (email) {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      userId = user.id;
    } else if (req.res.user) {
      userId = req.res.user.id;
    } else {
      return res.status(401).json({ message: "User identification required" });
    }

    const expense = await createExpense({
      amount,
      date,
      dueDate,
      categoryId: categoryId ? parseInt(categoryId) : null,
      expenseCategoryId: expenseCategoryId ? parseInt(expenseCategoryId) : null,
      description,
      userId,
    });

    res.status(201).json({ message: "Expense created successfully", expense });
  }),
);

router.post(
  "/expenses/:id/pay",
  requireAuth,
  validate(payExpenseSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;
    
    const payment = await payExpense(parseInt(id), amount);
    res.status(201).json(payment);
  }),
);

export default router;
