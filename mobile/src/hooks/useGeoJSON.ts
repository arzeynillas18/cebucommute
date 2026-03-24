import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.119:3000';

export interface GeoJSONFeature {
  type:       'Feature';
  properties: {
    code:  string;
    name:  string;
    color: string;
    fare:  number;
  };
  geometry: {
    type:        'LineString';
    coordinates: [number, number][];
  };
}

const CACHE_KEY = 'all_geojson_routes';

export function useGeoJSON() {
  const [geoJsonMap, setGeoJsonMap] = useState<Record<string, GeoJSONFeature>>({});
  const [loading, setLoading]       = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);

  const fetchAndCache = async () => {
    try {
      const res  = await fetch(`${API_URL}/api/ai/geojson`);
      const data = await res.json();
      if (data.success && data.geojson) {
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data.geojson));
        setGeoJsonMap(data.geojson);
        console.log('✅ GeoJSON loaded from backend');
        return data.geojson;
      }
    } catch (err) {
      console.log('Backend offline — using cache');
    }
    return null;
  };

  const loadFromCache = async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        setGeoJsonMap(parsed);
        console.log('✅ GeoJSON loaded from cache');
        return parsed;
      }
    } catch (err) {
      console.log('Cache error:', err);
    }
    return null;
  };

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
    } catch (err) {
      console.log(`Could not fetch GeoJSON for ${code}`);
    } finally {
      setGenerating(null);
    }
    return null;
  };

  const clearCache = async () => {
    await AsyncStorage.removeItem(CACHE_KEY);
    setGeoJsonMap({});
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadFromCache();
      await fetchAndCache();
      setLoading(false);
    };
    init();
  }, []);

  return { geoJsonMap, loading, generating, getRouteGeoJSON, clearCache };
}