require('dotenv').config();
const Groq = require('groq-sdk');
const fs   = require('fs');
const path = require('path');

const groq   = new Groq({ apiKey: process.env.GROQ_API_KEY });
const dbPath = path.join(__dirname, 'db.json');

const ROUTES = [
  { code: '01B', origin: 'Colon',  dest: 'SM City', color: '#0D9488', fare: 13 },
  { code: '04L', origin: 'Carbon', dest: 'IT Park',  color: '#7C3AED', fare: 13 },
  { code: '03A', origin: 'Ayala',  dest: 'Colon',    color: '#EA580C', fare: 13 },
  { code: '10C', origin: 'Carbon', dest: 'Ayala',    color: '#0284C7', fare: 13 },
  { code: '17B', origin: 'Lahug',  dest: 'SM City',  color: '#BE185D', fare: 13 },
];

async function generateGeoJSON(route) {
  const prompt = `
You are a Cebu City geography expert.
Generate realistic GeoJSON LineString coordinates for jeepney route ${route.code} 
which travels from ${route.origin} to ${route.dest} in Cebu City, Philippines.

Known Cebu landmarks and approximate coordinates:
- Colon Street: [123.9003, 10.2936]
- Carbon Market: [123.8967, 10.2910]
- SM City Cebu: [123.9058, 10.3187]
- Ayala Center: [123.9050, 10.3182]
- IT Park: [123.9105, 10.3265]
- Lahug: [123.9109, 10.3310]
- Capitol Site: [123.8950, 10.3100]

Generate 8-12 coordinates following realistic Cebu roads.
Respond ONLY with a valid JSON object, no extra text, no markdown:
{"type":"Feature","properties":{"code":"${route.code}","name":"${route.origin} to ${route.dest}","color":"${route.color}","fare":${route.fare}},"geometry":{"type":"LineString","coordinates":[[lon,lat],[lon,lat]]}}`;

  const response = await groq.chat.completions.create({
    model:       'llama-3.3-70b-versatile',
    messages:    [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens:  1000,
  });

  const raw     = response.choices[0].message.content;
  const cleaned = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

async function main() {
  console.log('🤖 Pre-generating GeoJSON routes via Groq AI...\n');

  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  db.geojson = db.geojson || {};

  for (const route of ROUTES) {
    try {
      process.stdout.write(`Generating ${route.code}... `);
      const geojson = await generateGeoJSON(route);
      db.geojson[route.code] = geojson;
      console.log('✅ Done');
    } catch (err) {
      console.log(`❌ Failed: ${err.message}`);
    }
  }

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log('\n✅ All routes saved to db.json!');
  console.log('Now run: node server.js');
}

main();