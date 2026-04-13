require('dotenv').config();
console.log("🔥 NEW DEPLOY ACTIVE: RE-TRIGGER");
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const surveyRoutes = require('./routes/surveyRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Connect to MongoDB Database
connectDB();

const app = express();

// Security & CORS Configuration
const allowedOrigins = [
  'https://survey-app-sigma-neon.vercel.app',
  'https://communitysurvey-app.vercel.app',
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
  'http://localhost:5172', // For local Vite
  'http://localhost:5173', // For local Vite
  'http://localhost:5174', // For local Vite
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------------------------
// Health Check Routes
// ------------------------------------

// Root Route
app.get('/', (req, res) => {
  res.status(200).send('Welcome to the Survey Application Backend Engine. The server is actively running!');
});

// API Health Check
app.get('/api', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Survey API is operating optimally.',
    timestamp: new Date().toISOString(),
  });
});

// ------------------------------------
// Core API Routes
// ------------------------------------

// Mounted exactly to current frontend calls (/api/survey instead of /api/surveys)
// to strictly adhere to 'Do NOT break existing routes or controller logic'
app.use('/api/survey', surveyRoutes);
app.use('/api/admin', adminRoutes);

// Fallback logic for Unknown API Routes 
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(`[Server Error]: ${err.message}`);
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// ------------------------------------
// Server Initialization
// ------------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n======================================`);
  console.log(`🚀 Server successfully started!`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🔒 CORS Origin: ${corsOptions.origin}`);
  console.log(`======================================\n`);
});
