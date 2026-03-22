import { z } from 'zod';

export const updateSettingsSchema = z.object({
  group: z.enum(['reminderSettings', 'stockValueSettings'], {
    message: 'group must be "reminderSettings" or "stockValueSettings"',
  }),
  userEmail: z.string().email('Invalid email format'),
  enabled: z.boolean().optional(),
  intervalDays: z.number().optional(),
  lowStockThreshold: z.number().optional(),
});

export const saveTokenSchema = z.object({
  userEmail: z.string().email('Invalid email format'),
  expoPushToken: z.string().min(1, 'expoPushToken is required'),
});
