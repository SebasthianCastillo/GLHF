import cron from 'node-cron';
import prisma from '../lib/prisma.mjs';
import { sendPushNotification } from '../services/notification.service.mjs';

export const startCronJob = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      const usersNotificationEnabled = await prisma.user.findMany({
        where: {
          settings: {
            reminderEnabled: true
          }
        },
        include: {
          settings: true,
          categories: {
            include: {
              productos: true
            }
          }
        }
      });

      for (const user of usersNotificationEnabled) {
        const { reminderIntervalDays, reminderLowStockThreshold } = user.settings;

        for (const category of user.categories) {
          for (const product of category.productos) {
            if (product.quantity < reminderLowStockThreshold) {
              const lastNotified = product.lastNotifiedAt;
              const now = new Date();
              const intervalMs = reminderIntervalDays * 24 * 60 * 60 * 1000;

              if (!lastNotified || now.getTime() - new Date(lastNotified).getTime() > intervalMs) {
                if (user.expoPushToken) {
                  await sendPushNotification(user.expoPushToken, {
                    title: 'Low Stock Reminder 🛒',
                    body: `${product.name} is low (${product.quantity} left)!`,
                  });

                  await prisma.producto.update({
                    where: { id: product.id },
                    data: { lastNotifiedAt: now }
                  });
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('❌ Cron job error:', error);
    }
  });
};
