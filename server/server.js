const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// ── Body parsers FIRST ────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── CORS ──────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'https://resumelens.me',
  'https://www.resumelens.me',
  'https://resume-ai-pearl.vercel.app',
  'https://resumeai-api-pac6.onrender.com',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, origin);
    }
    // Allow any Vercel preview deployment
    if (origin.endsWith('.vercel.app')) {
      return callback(null, origin);
    }
    console.warn('[CORS] Blocked origin:', origin);
    return callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'admin-secret'],
}));

// Handle preflight requests
app.options('*', cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || (origin && origin.endsWith('.vercel.app'))) {
      return callback(null, origin);
    }
    return callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'admin-secret'],
}));

// ── Debug middleware (disabled for production) ──────────────────
// app.use((req, res, next) => {
//   console.log(`[SERVER] ${req.method} ${req.url} - Body:`, req.body);
//   next();
// });

// ── API Routes ────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/resume',   require('./routes/resumeRoutes'));
app.use('/api/history',  require('./routes/historyRoutes'));
app.use('/api/payment',  require('./routes/paymentRoutes'));
app.use('/api/telegram', require('./routes/telegramRoutes'));

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ message: 'ResumeLens API Server is running' });
});

// ── Error handlers ────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(err.status || 500).json({ message: err.message });
});

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 3014;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MongoDB connected`);
});

module.exports = app;