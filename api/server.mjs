import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cron from 'node-cron';
import { registerRoutes } from './routes/index.mjs';
import { errorHandler } from './middleware/errorHandler.mjs';
import { apiLimiter } from './middleware/rateLimit.mjs';
import { startCronJob } from './cron/stockReminder.mjs';

const app = express();

app.use(helmet());
app.use(cors({
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(apiLimiter);

app.get('/', (req, res) => res.send('hello'));

registerRoutes(app);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

startCronJob();

export default app;
