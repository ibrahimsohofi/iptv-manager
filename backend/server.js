import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import customersRouter from './routes/customers.js';
import boxesRouter from './routes/boxes.js';
import subscriptionsRouter from './routes/subscriptions.js';
import iptvRouter from './routes/iptv.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/customers', customersRouter);
app.use('/api/boxes', boxesRouter);
app.use('/api/subscriptions', subscriptionsRouter);
app.use('/api/iptv', iptvRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'IPTV Manager API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
