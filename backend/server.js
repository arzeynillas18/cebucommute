require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const fs         = require('fs');
const path       = require('path');

const aiRoutes       = require('./routes/ai');
const routesAPI      = require('./routes/routes');
const schedulesAPI   = require('./routes/schedules');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(cors());
app.use(express.json());

// ─── Request Logger ───────────────────────────────────────────────────────────

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use('/api/ai',        aiRoutes);
app.use('/api/routes',    routesAPI);
app.use('/api/schedules', schedulesAPI);

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({
    status:    'ok',
    message:   'CebuCommute backend is running',
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Error Handler ────────────────────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🚌 CebuCommute backend running on http://localhost:${PORT}`);
  console.log(`📍 AI endpoints ready at http://localhost:${PORT}/api/ai`);
  console.log(`🗺️  Routes API ready at http://localhost:${PORT}/api/routes\n`);
});