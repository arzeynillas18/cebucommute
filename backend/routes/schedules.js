const express = require('express');
const fs      = require('fs');
const path    = require('path');

const router = express.Router();
const dbPath = path.join(__dirname, '../db.json');

const getDb = () => JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// GET /api/schedules — all schedules
router.get('/', (req, res) => {
  const { route } = req.query;
  let schedules = getDb().schedules;

  if (route) schedules = schedules.filter(s =>
    s.route.toLowerCase() === route.toLowerCase()
  );

  res.json({ success: true, schedules });
});

// GET /api/schedules/:route — schedule for specific route
router.get('/:route', (req, res) => {
  const schedule = getDb().schedules.find(
    s => s.route.toLowerCase() === req.params.route.toLowerCase()
  );
  if (!schedule) return res.status(404).json({ error: 'Schedule not found' });
  res.json({ success: true, schedule });
});

// POST /api/schedules/feedback — submit feedback
router.post('/feedback', (req, res) => {
  const { subject, message, userType } = req.body;
  if (!subject || !message) {
    return res.status(400).json({ error: 'subject and message are required' });
  }

  const db       = getDb();
  const feedback = {
    id:        db.feedback.length + 1,
    subject,
    message,
    userType:  userType || 'anonymous',
    createdAt: new Date().toISOString(),
  };

  db.feedback.push(feedback);
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  res.json({ success: true, feedback });
});

module.exports = router;