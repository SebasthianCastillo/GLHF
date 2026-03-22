import { z } from 'zod';

export const addCategorySchema = z.object({
  Name: z.string().min(1, 'Name is required'),
});
