const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Simple CORS for development
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/history', require('./routes/historyRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/telegram', require('./routes/telegramRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', env: 'development', ts: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(err.status || 500).json({ message: err.message });
});

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

const PORT = process.env.PORT || 3014;
app.listen(PORT, () => {
  // Server started
});

module.exports = app;
