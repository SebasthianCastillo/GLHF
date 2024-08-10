import express, { Request, Response } from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());

// Connect to MongoDB
const MONGO_URI = 'YOUR_MONGODB_CONNECTION_STRING';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a simple route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});