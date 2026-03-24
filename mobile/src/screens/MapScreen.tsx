import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, {
  Polyline,
  Marker,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

import styles from '../styles/MapScreen.styles';
import { Colors } from '../styles/theme';
import { JEEPNEY_ROUTES, CEBU_REGION, JeepneyRoute } from '../constants/routes';
import { useGeoJSON } from '../hooks/useGeoJSON';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

// ─── Config ───────────────────────────────────────────────────────────────────

const API_URL = 'http://192.168.0.119:3000'; // Android emulator
// const API_URL = 'http://localhost:3000'; // iOS simulator
// const API_URL = 'http://192.168.x.x:3000'; // Real device

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const { isOnline } = useNetworkStatus();

  const [searchQuery, setSearchQuery]   = useState('');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locLoading, setLocLoading]     = useState(false);
  const [activeRoutes, setActiveRoutes] = useState<string[]>(['01B', '04L', '03A']);
  const [showPinch, setShowPinch]       = useState(true);
  const [nearbyRoutes, setNearbyRoutes] = useState<any[]>([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);

  const {
    geoJsonMap,
    loading:    geoLoading,
    generating,
    getRouteGeoJSON,
  } = useGeoJSON();

  // ── Get user location + find nearby routes ──
  const getUserLocation = async () => {
    setLocLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Enable location to see nearby routes.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords = {
        latitude:  loc.coords.latitude,
        longitude: loc.coords.longitude,
      };

      setUserLocation(coords);
      mapRef.current?.animateToRegion(
        { ...coords, latitudeDelta: 0.03, longitudeDelta: 0.03 },
        800
      );

      // Ask AI for nearby routes
      findNearbyRoutes(coords.latitude, coords.longitude);

    } catch {
      Alert.alert('Error', 'Could not get your location.');
    } finally {
      setLocLoading(false);
    }
  };

  // ── AI: Find nearby routes ──
  const findNearbyRoutes = async (latitude: number, longitude: number) => {
    setNearbyLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/ai/nearby`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ latitude, longitude }),
      });
      const data = await res.json();
      if (data.success && data.routes?.length > 0) {
        setNearbyRoutes(data.routes);
        // Auto-activate nearby routes on map
        setActiveRoutes(data.routes.map((r: any) => r.code));
        // Ensure GeoJSON exists for nearby routes
        for (const route of data.routes) {
          await getRouteGeoJSON(route.code);
        }
      }
    } catch (err) {
      console.log('Nearby routes offline — using defaults');
    } finally {
      setNearbyLoading(false);
    }
  };

  // ── Search routes ──
  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    if (!text.trim()) return;

    const matched = JEEPNEY_ROUTES.filter(
      r =>
        r.code.toLowerCase().includes(text.toLowerCase()) ||
        r.origin.toLowerCase().includes(text.toLowerCase()) ||
        r.dest.toLowerCase().includes(text.toLowerCase())
    );

    if (matched.length > 0) {
      setActiveRoutes(matched.map(r => r.code));
      // Generate GeoJSON for searched route if not cached
      for (const r of matched) {
        await getRouteGeoJSON(r.code);
      }
      // Animate to first match
      const geo = geoJsonMap[matched[0].code];
      if (geo?.geometry?.coordinates?.length > 0) {
        const [lon, lat] = geo.geometry.coordinates[
          Math.floor(geo.geometry.coordinates.length / 2)
        ];
        mapRef.current?.animateToRegion(
          { latitude: lat, longitude: lon, latitudeDelta: 0.04, longitudeDelta: 0.04 },
          800
        );
      }
    }
  };

  // ── Toggle route pill ──
  const toggleRoute = (code: string) => {
    setActiveRoutes(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
    // Ensure GeoJSON for toggled route
    getRouteGeoJSON(code);
  };

  // ── Build polyline coordinates from GeoJSON ──
  const getPolylineCoords = (code: string) => {
    const geo = geoJsonMap[code];
    if (!geo?.geometry?.coordinates) return [];
    return geo.geometry.coordinates.map(([lon, lat]) => ({
      latitude:  lat,
      longitude: lon,
    }));
  };

  const visibleRoutes = JEEPNEY_ROUTES.filter(r => activeRoutes.includes(r.code));

  return (
    <SafeAreaView style={[styles.safe, { flex: 1 }]} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgPrimary} />

      {/* ── Fixed top section ── */}
      <View>
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Jeepney Map</Text>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="options-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

      {/* ── Offline Banner — only shows when no internet ── */}
      {!isOnline && (
        <View style={styles.modeBanner}>
          <View style={styles.modeDot} />
          <Text style={styles.modeBannerText}>Offline Mode Active</Text>
        </View>
      )}

      {/* ── Search Bar ── */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={Colors.teal} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Route: 01B, Carbon, Ayala..."
            placeholderTextColor={Colors.slateLight}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => { setSearchQuery(''); setActiveRoutes(['01B', '04L', '03A']); }}>
              <Ionicons name="close-circle" size={18} color={Colors.slateLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      </View>

      {/* ── Route Pills ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsRow}
      >
        {JEEPNEY_ROUTES.map(route => {
          const isActive = activeRoutes.includes(route.code);
          const isGen    = generating === route.code;
          return (
            <TouchableOpacity
              key={route.id}
              style={[styles.pill, { backgroundColor: isActive ? route.color : Colors.borderLight }]}
              onPress={() => toggleRoute(route.code)}
              activeOpacity={0.8}
            >
              {isGen
                ? <ActivityIndicator size="small" color={isActive ? '#fff' : route.color} />
                : <View style={[styles.pillDot, { backgroundColor: isActive ? '#fff' : route.color }]} />
              }
              <Text style={[styles.pillText, { color: isActive ? '#fff' : Colors.slate }]}>
                {route.code}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── AI Generating Banner ── */}
      {(geoLoading || nearbyLoading) && (
        <View style={styles.aiLoadingWrap}>
          <ActivityIndicator size="small" color={Colors.teal} />
          <Text style={styles.aiLoadingText}>
            {nearbyLoading
              ? '🤖 AI is finding routes near you...'
              : '🤖 AI is generating route maps...'
            }
          </Text>
        </View>
      )}

      {/* ── Nearby Routes Banner ── */}
      {nearbyRoutes.length > 0 && !nearbyLoading && (
        <View style={styles.aiLoadingWrap}>
          <Ionicons name="location" size={16} color={Colors.tealDark} />
          <Text style={styles.aiLoadingText}>
            {nearbyRoutes.length} routes near you: {nearbyRoutes.map((r: any) => r.code).join(', ')}
          </Text>
        </View>
      )}

      {/* ── Map ── */}
      <View style={styles.mapWrap}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={CEBU_REGION}
          showsUserLocation={!!userLocation}
          showsMyLocationButton={false}
          showsCompass
          onTouchStart={() => setShowPinch(false)}
        >
          {/* Route Polylines from AI-generated GeoJSON */}
          {visibleRoutes.map(route => {
            const coords = getPolylineCoords(route.code);
            if (coords.length === 0) return null;
            return (
              <Polyline
                key={route.id}
                coordinates={coords}
                strokeColor={route.color}
                strokeWidth={4}
              />
            );
          })}

          {/* Start / End Markers */}
          {visibleRoutes.map(route => {
            const coords = getPolylineCoords(route.code);
            if (coords.length < 2) return null;
            return (
              <React.Fragment key={`markers-${route.id}`}>
                <Marker
                  coordinate={coords[0]}
                  pinColor={route.color}
                  title={`${route.code} — Start`}
                  description={`${route.origin} to ${route.dest}`}
                />
                <Marker
                  coordinate={coords[coords.length - 1]}
                  pinColor={route.color}
                  title={`${route.code} — End`}
                  description={`${route.origin} to ${route.dest}`}
                />
              </React.Fragment>
            );
          })}

          {/* User location dot */}
          {userLocation && (
            <Marker coordinate={userLocation} title="You are here">
              <View style={{
                width: 20, height: 20, borderRadius: 10,
                backgroundColor: Colors.info,
                borderWidth: 3, borderColor: '#fff',
                elevation: 4,
              }} />
            </Marker>
          )}
        </MapView>

        {/* Map Data Badge */}
        <View style={styles.mapBadge}>
          <Ionicons name="information-circle-outline" size={14} color={Colors.teal} />
          <Text style={styles.mapBadgeText}>
            Map Data:{' '}
            <Text style={styles.mapBadgeBold}>AI Generated • Aug 2025</Text>
          </Text>
        </View>

        {/* Pinch Hint */}
        {showPinch && (
          <View style={styles.pinchHint}>
            <Ionicons name="hand-left-outline" size={13} color={Colors.slate} />
            <Text style={styles.pinchHintText}>Pinch to zoom</Text>
          </View>
        )}

        {/* Locate Me Button */}
        <TouchableOpacity style={styles.locateBtn} onPress={getUserLocation}>
          {locLoading
            ? <ActivityIndicator size="small" color={Colors.teal} />
            : <Ionicons name="locate" size={20} color={Colors.teal} />
          }
        </TouchableOpacity>
      </View>

      {/* ── Disclaimer ── */}
      <Text style={styles.disclaimer}>
        Routes AI-generated from Groq. Tap 📍 to find routes near you.
      </Text>
    </SafeAreaView>
  );
}