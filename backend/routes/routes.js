const express = require('express');
const Groq    = require('groq-sdk');
const fs      = require('fs');
const path    = require('path');

const router = express.Router();
const groq   = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── Load route data ──────────────────────────────────────────────────────────

const db = JSON.parse(fs.readFileSync(path.join(__dirname, '../db.json'), 'utf-8'));

// ─── Helper: Ask Groq ─────────────────────────────────────────────────────────

async function askGroq(prompt) {
  const response = await groq.chat.completions.create({
    model:    'llama3-8b-8192',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  });
  return response.choices[0].message.content;
}

// ─── POST /api/ai/nearby ──────────────────────────────────────────────────────
// Find jeepney routes near user's GPS location

router.post('/nearby', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'latitude and longitude are required' });
    }

    const routeList = db.routes.map(r =>
      `${r.code}: ${r.origin} to ${r.dest} (${r.area})`
    ).join('\n');

    const prompt = `
You are a Cebu City jeepney routing assistant.
The user is currently at coordinates: latitude ${latitude}, longitude ${longitude} in Cebu City, Philippines.

Here are the available jeepney routes:
${routeList}

Based on the user's location in Cebu City, which 2-3 jeepney routes are most likely nearest or most useful to them?
Consider common Cebu landmarks:
- Colon Street area: ~10.2936, 123.9003
- SM City Cebu: ~10.3187, 123.9058  
- Ayala Center: ~10.3182, 123.9050
- Carbon Market: ~10.2910, 123.8967
- IT Park: ~10.3265, 123.9105
- Lahug: ~10.3310, 123.9109

Respond ONLY with a valid JSON array like this, no extra text:
[
  { "code": "01B", "reason": "short reason why this route is nearby" },
  { "code": "04L", "reason": "short reason why this route is nearby" }
]`;

    const raw     = await askGroq(prompt);
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const nearby  = JSON.parse(cleaned);

    // Enrich with full route data
    const enriched = nearby.map(item => ({
      ...db.routes.find(r => r.code === item.code),
      aiReason: item.reason,
    })).filter(Boolean);

    res.json({ success: true, routes: enriched });

  } catch (err) {
    console.error('AI nearby error:', err.message);
    res.status(500).json({ error: 'Failed to get nearby routes', details: err.message });
  }
});

// ─── POST /api/ai/suggest ─────────────────────────────────────────────────────
// Suggest best jeepney route from origin to destination

router.post('/suggest', async (req, res) => {
  try {
    const { origin, destination } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({ error: 'origin and destination are required' });
    }

    const routeList = db.routes.map(r =>
      `${r.code}: ${r.origin} to ${r.dest}, fare ₱${r.fare}, hours ${r.hours}`
    ).join('\n');

    const prompt = `
You are a Cebu City jeepney routing assistant.
A commuter wants to travel from "${origin}" to "${destination}" in Cebu City, Philippines.

Available jeepney routes:
${routeList}

Suggest the best jeepney route(s) to take. If a transfer is needed, include that.
Consider that Colon Street is the main downtown hub where many routes connect.

Respond ONLY with valid JSON, no extra text:
{
  "routes": ["01B"],
  "instruction": "Take jeepney 01B from Colon going to SM City. Board at Colon Street terminal.",
  "totalFare": 13,
  "estimatedTime": "20-25 mins",
  "transfers": false
}`;

    const raw       = await askGroq(prompt);
    const cleaned   = raw.replace(/```json|```/g, '').trim();
    const suggestion = JSON.parse(cleaned);

    // Enrich with full route data
    const enrichedRoutes = suggestion.routes.map(code =>
      db.routes.find(r => r.code === code)
    ).filter(Boolean);

    res.json({
      success: true,
      suggestion: {
        ...suggestion,
        routeDetails: enrichedRoutes,
      },
    });

  } catch (err) {
    console.error('AI suggest error:', err.message);
    res.status(500).json({ error: 'Failed to get route suggestion', details: err.message });
  }
});

// ─── POST /api/ai/geojson ─────────────────────────────────────────────────────
// Generate GeoJSON coordinates for a jeepney route

router.post('/geojson', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'route code is required' });
    }

    const route = db.routes.find(r => r.code === code.toUpperCase());
    if (!route) {
      return res.status(404).json({ error: `Route ${code} not found` });
    }

    const prompt = `
You are a Cebu City geography expert.
Generate realistic GeoJSON LineString coordinates for jeepney route ${route.code} 
which travels from ${route.origin} to ${route.dest} in Cebu City, Philippines.

Known Cebu landmarks and their approximate coordinates:
- Colon Street (downtown hub): [123.9003, 10.2936]
- Carbon Market: [123.8967, 10.2910]
- SM City Cebu (north): [123.9058, 10.3187]
- Ayala Center Cebu: [123.9050, 10.3182]
- IT Park (Lahug): [123.9105, 10.3265]
- Lahug area: [123.9109, 10.3310]
- Capitol Site: [123.8950, 10.3100]
- Mabolo: [123.9150, 10.3200]
- Banilad: [123.9050, 10.3350]

Generate 8-12 coordinates that follow realistic Cebu roads for this route.
Respond ONLY with a valid GeoJSON Feature object, no extra text:
{
  "type": "Feature",
  "properties": {
    "code": "${route.code}",
    "name": "${route.origin} to ${route.dest}",
    "color": "${route.color || '#0D9488'}",
    "fare": ${route.fare}
  },
  "geometry": {
    "type": "LineString",
    "coordinates": [[lon, lat], [lon, lat], ...]
  }
}`;

    const raw     = await askGroq(prompt);
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const geojson = JSON.parse(cleaned);

    res.json({ success: true, geojson });

  } catch (err) {
    console.error('AI geojson error:', err.message);
    res.status(500).json({ error: 'Failed to generate GeoJSON', details: err.message });
  }
});

module.exports = router;