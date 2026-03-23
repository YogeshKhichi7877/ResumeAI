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
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://resume-ai-pearl.vercel.app',
    'https://resumeai-api-pac6.onrender.com'  // ← no trailing slash
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization' ,  'admin-secret'],
}));


// Handle preflight requests
app.options('*', cors());

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
  res.json({ message: 'ResumeAI API Server is running' });
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