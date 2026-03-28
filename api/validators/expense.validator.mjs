import { z } from 'zod';

export const createExpenseSchema = z.object({
  amount: z.union([z.string(), z.number()]).refine((v) => !isNaN(parseFloat(v)), {
    message: 'amount must be a valid number',
  }),
  date: z.string().min(1, 'date is required'),
  dueDate: z.string().min(1, 'dueDate is required'),
  categoryId: z.union([z.string(), z.number()]).refine((v) => !isNaN(parseInt(v)), {
    message: 'categoryId must be a valid number',
  }),
  description: z.string().optional(),
  email: z.string().email('Invalid email format').optional(),
});

export const expenseQuerySchema = z.object({
  fromDate: z.string().optional().nullable(),
  toDate: z.string().optional().nullable(),
  categoryId: z.union([z.string(), z.number()]).optional().nullable(),
  status: z.enum(['PENDING', 'PAID', 'OVERDUE', 'PARTIAL']).optional().nullable(),
});

export const payExpenseSchema = z.object({
  amount: z.union([z.string(), z.number()]).refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, {
    message: 'amount must be a positive number',
  }),
});

// Types exported for use in TypeScript files
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const CreateExpenseInput = createExpenseSchema;
export const ExpenseQueryInput = expenseQuerySchema;
export const PayExpenseInput = payExpenseSchema;
