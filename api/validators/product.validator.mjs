import { z } from 'zod';

export const addProductSchema = z.object({
  Name: z.string().min(1, 'Name is required'),
  quantity: z.union([z.string(), z.number()]).optional(),
  CategoryID: z.union([z.string(), z.number()]).optional().nullable(),
});

export const addProductDetailSchema = z.object({
  quantity: z.union([z.string(), z.number()]).refine((v) => !isNaN(parseInt(v)), {
    message: 'quantity must be a valid number',
  }),
  date: z.string().min(1, 'date is required'),
  format: z.string().min(1, 'format is required'),
  operation: z.enum(['add', 'minus'], { message: 'operation must be "add" or "minus"' }),
  ProductID: z.union([z.string(), z.number()]).refine((v) => !isNaN(parseInt(v)), {
    message: 'ProductID must be a valid number',
  }),
  cost: z.union([z.string(), z.number()]).optional(),
});

export const quantityUpdateSchema = z.object({
  _id: z.union([z.string(), z.number()]).refine((v) => !isNaN(parseInt(v)), {
    message: '_id must be a valid number',
  }),
  quantity: z.union([z.string(), z.number()]).refine((v) => !isNaN(parseInt(v)), {
    message: 'quantity must be a valid number',
  }),
  operation: z.enum(['add', 'minus'], { message: 'operation must be "add" or "minus"' }),
  cost: z.union([z.string(), z.number()]).optional(),
});

export const updateProductNameSchema = z.object({
  newName: z.string().min(1, 'newName is required'),
});

export const updateProductCostSchema = z.object({
  cost: z.union([z.string(), z.number()]).refine((v) => !isNaN(parseFloat(v)), {
    message: 'cost must be a valid number',
  }),
});

export const productDetailQuerySchema = z.object({
  ProductKey: z.string().min(1, 'ProductKey is required'),
});
