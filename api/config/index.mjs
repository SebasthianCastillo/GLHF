export const config = {
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '7d',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  server: {
    port: process.env.PORT || 5000,
  },
  notifications: {
    expoUrl: 'https://exp.host/--/api/v2/push/send',
  },
};
