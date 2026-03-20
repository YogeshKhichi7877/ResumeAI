const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// CORS configuration for production
app.use(cors({
  origin: ['https://resumeai-api-pac6.onrender.com', 'https://your-frontend.vercel.app' ,'http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/history', require('./routes/historyRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/telegram', require('./routes/telegramRoutes'));

// Health check
const API_BASE_URL = 'https://resumeai-api-pac6.onrender.com';

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    env: 'production', 
    apiUrl: API_BASE_URL,
    ts: new Date().toISOString() 
  });
});

// Root route showing API URL
app.get('/', (req, res) => {
  res.json({ 
    message: 'ResumeAI API Server',
    apiUrl: API_BASE_URL,
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      resume: '/api/resume',
      history: '/api/history',
      payment: '/api/payment',
      telegram: '/api/telegram'
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(err.status || 500).json({ message: err.message });
});

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

const PORT = process.env.PORT || 3014;
app.listen(PORT, () => {
  console.log(`Connected to MongoDB`);
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;
