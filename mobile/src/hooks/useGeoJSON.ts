import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.113:3000';

// ── Bump this version number any time db.json routes change ──
// This forces all clients to discard stale cached data
const CACHE_VERSION = '7';
const CACHE_KEY     = `all_geojson_routes_v${CACHE_VERSION}`;

// ── How close (meters) a route must pass to count as "nearby" ──
const NEARBY_THRESHOLD_METERS = 150;

export interface GeoJSONFeature {
  type: 'Feature';
  properties: {
    code:  string;
    name:  string;
    color: string;
    fare:  number;
  };
  geometry: {
    type:        'LineString';
    coordinates: [number, number][]; // [lng, lat]
  };
}

// ─────────────────────────────────────────────────────────────
// Geometry helpers
// ─────────────────────────────────────────────────────────────

function haversineMeters(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function pointToSegmentMeters(
  pLat: number, pLng: number,
  aLat: number, aLng: number,
  bLat: number, bLng: number,
): number {
  const dx = bLng - aLng;
  const dy = bLat - aLat;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return haversineMeters(pLat, pLng, aLat, aLng);
  let t = ((pLng - aLng) * dx + (pLat - aLat) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return haversineMeters(pLat, pLng, aLat + t * dy, aLng + t * dx);
}

function distanceToPolyline(
  lat: number,
  lng: number,
  feature: GeoJSONFeature,
): number {
  const coords = feature.geometry.coordinates;
  if (!coords || coords.length < 2) return Infinity;
  let min = Infinity;
  for (let i = 0; i < coords.length - 1; i++) {
    const [aLng, aLat] = coords[i];
    const [bLng, bLat] = coords[i + 1];
    const d = pointToSegmentMeters(lat, lng, aLat, aLng, bLat, bLng);
    if (d < min) min = d;
  }
  return min;
}

// ─────────────────────────────────────────────────────────────
// Purge ALL old cache versions so stale data doesn't persist
// ─────────────────────────────────────────────────────────────
async function purgeOldCaches() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const oldKeys = keys.filter(
      k => k.startsWith('all_geojson_routes') && k !== CACHE_KEY,
    );
    if (oldKeys.length > 0) {
      await AsyncStorage.multiRemove(oldKeys);
      console.log(`🧹 Purged ${oldKeys.length} stale cache(s):`, oldKeys);
    }
  } catch (err) {
    console.log('Cache purge error:', err);
  }
}

// ─────────────────────────────────────────────────────────────
// Validate that GeoJSON looks like real Cebu route data
// (guards against OSRM-approximated junk being cached)
// ─────────────────────────────────────────────────────────────
function isValidRouteData(geojson: Record<string, GeoJSONFeature>): boolean {
  const codes = Object.keys(geojson);
  if (codes.length === 0) return false;

  // Spot-check: 01K should start near Urgello (lat ~10.295, lng ~123.891)
  const sample = geojson['01K'] ?? geojson[codes[0]];
  if (!sample?.geometry?.coordinates?.length) return false;

  // Every route should have many GPS points (real data has 50-300+)
  // OSRM-approximated routes typically have far fewer
  const avgPoints = codes.reduce((sum, code) => {
    return sum + (geojson[code]?.geometry?.coordinates?.length ?? 0);
  }, 0) / codes.length;

  if (avgPoints < 30) {
    console.warn(`⚠️  Suspiciously few GPS points (avg ${avgPoints.toFixed(0)}) — rejecting cache`);
    return false;
  }

  return true;
}

// ─────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────
export function useGeoJSON() {
  const [geoJsonMap, setGeoJsonMap] = useState<Record<string, GeoJSONFeature>>({});
  const [loading, setLoading]       = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);

  // ── Fetch fresh from backend and cache ──
  const fetchAndCache = async (): Promise<Record<string, GeoJSONFeature> | null> => {
    try {
      const res  = await fetch(`${API_URL}/api/ai/geojson`);
      const data = await res.json();

      if (data.success && data.geojson && isValidRouteData(data.geojson)) {
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data.geojson));
        setGeoJsonMap(data.geojson);
        const count = Object.keys(data.geojson).length;
        console.log(`✅ GeoJSON loaded from backend (${count} routes)`);
        return data.geojson;
      } else {
        console.warn('⚠️  Backend returned invalid/empty GeoJSON — not caching');
      }
    } catch (err) {
      console.log('Backend offline — using cache:', err);
    }
    return null;
  };

  // ── Load from AsyncStorage cache (with validation) ──
  const loadFromCache = async (): Promise<Record<string, GeoJSONFeature> | null> => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as Record<string, GeoJSONFeature>;
        if (isValidRouteData(parsed)) {
          setGeoJsonMap(parsed);
          const count = Object.keys(parsed).length;
          console.log(`✅ GeoJSON loaded from cache v${CACHE_VERSION} (${count} routes)`);
          return parsed;
        } else {
          console.warn('⚠️  Cached data failed validation — discarding');
          await AsyncStorage.removeItem(CACHE_KEY);
        }
      }
    } catch (err) {
      console.log('Cache read error:', err);
    }
    return null;
  };

  // ── Fetch a single route's GeoJSON if missing ──
  const getRouteGeoJSON = async (code: string): Promise<GeoJSONFeature | null> => {
    if (geoJsonMap[code]) return geoJsonMap[code];
    try {
      setGenerating(code);
      const res  = await fetch(`${API_URL}/api/ai/geojson/${code}`);
      const data = await res.json();
      if (data.success && data.geojson) {
        setGeoJsonMap(prev => ({ ...prev, [code]: data.geojson }));
        return data.geojson;
      }
    } catch {
      console.log(`Could not fetch GeoJSON for ${code}`);
    } finally {
      setGenerating(null);
    }
    return null;
  };

  // ── Find nearby routes using local geometry ──
  const findNearbyRoutes = (
    latitude: number,
    longitude: number,
    map?: Record<string, GeoJSONFeature>,
  ): Array<{
    code: string;
    name: string;
    color: string;
    fare: number;
    distanceMeters: number;
  }> => {
    const source = map ?? geoJsonMap;
    const results: Array<{
      code: string; name: string; color: string;
      fare: number; distanceMeters: number;
    }> = [];

    for (const [code, feature] of Object.entries(source)) {
      const dist = distanceToPolyline(latitude, longitude, feature);
      if (dist <= NEARBY_THRESHOLD_METERS) {
        results.push({
          code,
          name:           feature.properties.name,
          color:          feature.properties.color,
          fare:           feature.properties.fare,
          distanceMeters: Math.round(dist),
        });
      }
    }

    return results.sort((a, b) => a.distanceMeters - b.distanceMeters);
  };

  const clearCache = async () => {
    await AsyncStorage.removeItem(CACHE_KEY);
    setGeoJsonMap({});
    console.log('🗑️  Cache cleared');
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      // 1. Remove any stale cache from old versions
      await purgeOldCaches();

      // 2. Try loading valid cache first (instant)
      const cached = await loadFromCache();

      setLoading(false);

      // 3. Always refresh from backend in background
      //    If backend has newer data it overwrites cache
      fetchAndCache();
    };
    init();
  }, []);

  return {
    geoJsonMap,
    loading,
    generating,
    getRouteGeoJSON,
    findNearbyRoutes,
    clearCache,
  };
}