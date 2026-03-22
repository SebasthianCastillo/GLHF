import { Router } from 'express';
import prisma from '../lib/prisma.mjs';
import requireAuth from '../middleware/auth.mjs';
import { asyncHandler } from '../lib/errors.mjs';
import { validate } from '../middleware/validate.mjs';
import { updateSettingsSchema, saveTokenSchema } from '../validators/user.validator.mjs';

const router = Router();

router.post(
  '/updateUserSettings',
  validate(updateSettingsSchema),
  asyncHandler(async (req, res) => {
    const { group, userEmail, ...updates } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { settings: true }
    });

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const settingsData = {};
    if (group === 'reminderSettings') {
      if ('enabled' in updates) settingsData.reminderEnabled = updates.enabled;
      if ('intervalDays' in updates) settingsData.reminderIntervalDays = updates.intervalDays;
      if ('lowStockThreshold' in updates) settingsData.reminderLowStockThreshold = updates.lowStockThreshold;
    } else if (group === 'stockValueSettings') {
      if ('enabled' in updates) settingsData.stockValueEnabled = updates.enabled;
    }

    if (user.settings) {
      await prisma.userSettings.update({
        where: { userId: user.id },
        data: settingsData
      });
    } else {
      await prisma.userSettings.create({
        data: {
          userId: user.id,
          ...settingsData
        }
      });
    }

    console.log(`✅ Updated settings for: ${user.name}`);
    res.status(200).json({ message: 'Settings updated successfully' });
  })
);

router.post(
  '/saveTokenUserNotification',
  validate(saveTokenSchema),
  asyncHandler(async (req, res) => {
    const { userEmail, expoPushToken } = req.body;
    await prisma.user.update({
      where: { email: userEmail },
      data: { expoPushToken }
    });
    res.status(200).json({ message: 'Push token saved successfully' });
  })
);

router.get(
  '/currentUser',
  requireAuth,
  asyncHandler(async (req, res) => {
    res.status(200).json({ user: res.user });
  })
);

export default router;
