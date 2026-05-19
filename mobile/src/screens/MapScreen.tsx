import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Platform } from "react-native";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { TabParamList } from "../types/navigation";

import styles from "../styles/MapScreen.styles";
import { Colors } from "../styles/theme";
import { JEEPNEY_ROUTES, CEBU_REGION, JeepneyRoute } from "../constants/routes";
import { useGeoJSON } from "../hooks/useGeoJSON";
import { useNetworkStatus } from "../hooks/useNetworkStatus";

const API_URL =
  "https://9f0a-2001-fd8-c2d8-eb00-f857-e08f-37f7-2011.ngrok-free.app";

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const { isOnline } = useNetworkStatus();

  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locLoading, setLocLoading] = useState(false);
  const [activeRoutes, setActiveRoutes] = useState<string[]>([]);
  const [colorKey, setColorKey] = useState(0);
  const [showPinch, setShowPinch] = useState(true);
  const [nearbyRoutes, setNearbyRoutes] = useState<any[]>([]);
  const [nearbyVisible, setNearbyVisible] = useState(false);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [routeInstruction, setRouteInstruction] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [destinationPin, setDestinationPin] = useState<{
    latitude: number;
    longitude: number;
    label: string;
  } | null>(null);
  const [originPin, setOriginPin] = useState<{
    latitude: number;
    longitude: number;
    label: string;
  } | null>(null);

  const {
    geoJsonMap,
    loading: geoLoading,
    generating,
    getRouteGeoJSON,
    findNearbyRoutes,
  } = useGeoJSON();

  useEffect(() => {
    if (Object.keys(geoJsonMap).length > 0) {
      setTimeout(() => setColorKey((k) => k + 1), 500);
    }
  }, [geoJsonMap]);

  const route = useRoute<RouteProp<TabParamList, "Maps">>();
  const routeCodeParam = route.params?.routeCode;

  // Auto-activate route from navigation params
  useEffect(() => {
    if (route.params?.origin && route.params?.destination) {
      geocodePins(route.params.origin, route.params.destination);
    } else {
      setOriginPin(null);
      setDestinationPin(null);
    }
    if (route.params?.instruction)
      setRouteInstruction(route.params.instruction);
    if (route.params?.allRoutes) {
      const codes = route.params.allRoutes
        .split(",")
        .filter((c) => geoJsonMap[c]);
      if (codes.length > 0) setActiveRoutes(codes);
    } else if (routeCodeParam && geoJsonMap[routeCodeParam]) {
      setActiveRoutes([routeCodeParam]);
      const geo = geoJsonMap[routeCodeParam];
      if (geo?.geometry?.coordinates?.length > 0) {
        const allCoords = geo.geometry.coordinates;
        const lats = allCoords.map(([, lat]) => lat);
        const lngs = allCoords.map(([lng]) => lng);
        const minLat = Math.min(...lats),
          maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs),
          maxLng = Math.max(...lngs);
        mapRef.current?.animateToRegion(
          {
            latitude: (minLat + maxLat) / 2,
            longitude: (minLng + maxLng) / 2,
            latitudeDelta: (maxLat - minLat) * 1.4,
            longitudeDelta: (maxLng - minLng) * 1.4,
          },
          800,
        );
      }
    }
  }, [routeCodeParam, geoJsonMap]);

  // ── Get user location ──
  const getUserLocation = async () => {
    setLocLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Enable location to see nearby routes.",
        );
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const coords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      setUserLocation(coords);
      mapRef.current?.animateToRegion(
        { ...coords, latitudeDelta: 0.03, longitudeDelta: 0.03 },
        800,
      );
      findNearbyRoutesLocal(coords.latitude, coords.longitude);
    } catch {
      Alert.alert("Error", "Could not get your location.");
    } finally {
      setLocLoading(false);
    }
  };

  // ── Find nearby routes using local geometry ──
  const findNearbyRoutesLocal = (latitude: number, longitude: number) => {
    setNearbyLoading(true);
    try {
      const nearby = findNearbyRoutes(latitude, longitude);
      if (nearby.length > 0) {
        setNearbyRoutes(nearby);
        setNearbyVisible(true);
        setActiveRoutes(nearby.map((r: any) => r.code));
        setTimeout(() => setNearbyVisible(false), 6000);
        mapRef.current?.animateToRegion(
          { latitude, longitude, latitudeDelta: 0.04, longitudeDelta: 0.04 },
          800,
        );
      } else {
        setNearbyRoutes([]);
        Alert.alert(
          "No routes nearby",
          "No jeepney routes pass within 150m of your location.\n\nTry moving to a main road.",
        );
      }
    } catch (err) {
      console.log("Nearby detection error:", err);
    } finally {
      setNearbyLoading(false);
    }
  };

  // ── Search routes ──
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setSuggestions([]);
      setActiveRoutes([]);
      return;
    }
    const availableCodes = Object.keys(geoJsonMap);
    const q = text.toLowerCase();
    // Match by route code OR by route name/destination
    const matched = availableCodes.filter((code) => {
      if (code.toLowerCase().includes(q)) return true;
      const props = geoJsonMap[code]?.properties;
      if (props?.name?.toLowerCase().includes(q)) return true;
      const r = JEEPNEY_ROUTES.find((x) => x.code === code);
      if (r?.origin?.toLowerCase().includes(q)) return true;
      if (r?.dest?.toLowerCase().includes(q)) return true;
      return false;
    });
    setSuggestions(matched);
  };

  const selectSuggestion = (code: string) => {
    setSearchQuery(code);
    setSuggestions([]);
    setActiveRoutes([code]);
    const geo = geoJsonMap[code];
    if (geo?.geometry?.coordinates?.length > 0) {
      const allCoords = geo.geometry.coordinates;
      const lats = allCoords.map(([, lat]) => lat);
      const lngs = allCoords.map(([lng]) => lng);
      const minLat = Math.min(...lats),
        maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs),
        maxLng = Math.max(...lngs);
      mapRef.current?.animateToRegion(
        {
          latitude: (minLat + maxLat) / 2,
          longitude: (minLng + maxLng) / 2,
          latitudeDelta: (maxLat - minLat) * 1.4,
          longitudeDelta: (maxLng - minLng) * 1.4,
        },
        800,
      );
    }
  };

  // ── Build polyline coordinates from GeoJSON ──
  const getPolylineCoords = (code: string) => {
    const geo = geoJsonMap[code];
    if (!geo?.geometry?.coordinates) return [];
    const coords = geo.geometry.coordinates.map(([lon, lat]) => ({
      latitude: lat,
      longitude: lon,
    }));
    return coords;
  };

  const CEBU_LANDMARKS: Record<
    string,
    { latitude: number; longitude: number }
  > = {
    "carbon market": { latitude: 10.2936, longitude: 123.8978 },
    carbon: { latitude: 10.2936, longitude: 123.8978 },
    colon: { latitude: 10.2938, longitude: 123.8987 },
    "colon street": { latitude: 10.2938, longitude: 123.8987 },
    ayala: { latitude: 10.3188, longitude: 123.9054 },
    "ayala center": { latitude: 10.3188, longitude: 123.9054 },
    "ayala center cebu": { latitude: 10.3188, longitude: 123.9054 },
    "sm city cebu": { latitude: 10.3128, longitude: 123.9157 },
    "sm city": { latitude: 10.3128, longitude: 123.9157 },
    sm: { latitude: 10.3128, longitude: 123.9157 },
    parkmall: { latitude: 10.3279, longitude: 123.9375 },
    "it park": { latitude: 10.331, longitude: 123.906 },
    urgello: { latitude: 10.295, longitude: 123.891 },
    mandaue: { latitude: 10.3496, longitude: 123.9391 },
    talamban: { latitude: 10.3676, longitude: 123.9139 },
    lahug: { latitude: 10.331, longitude: 123.8978 },
    guadalupe: { latitude: 10.3085, longitude: 123.8807 },
    tisa: { latitude: 10.285, longitude: 123.878 },
    bulacao: { latitude: 10.278, longitude: 123.872 },
    "north bus terminal": { latitude: 10.349, longitude: 123.914 },
    "south bus terminal": { latitude: 10.292, longitude: 123.882 },
    pier: { latitude: 10.294, longitude: 123.902 },
    waterfront: { latitude: 10.315, longitude: 123.912 },
    mabolo: { latitude: 10.328, longitude: 123.914 },
    sambag: { latitude: 10.298, longitude: 123.892 },
    "sambag 1": { latitude: 10.298, longitude: 123.892 },
    "sambag 2": { latitude: 10.301, longitude: 123.89 },
    capitol: { latitude: 10.314, longitude: 123.891 },
    "capitol site": { latitude: 10.314, longitude: 123.891 },
    "university of san jose": { latitude: 10.296, longitude: 123.901 },
    "university of visayas": { latitude: 10.297, longitude: 123.899 },
    uv: { latitude: 10.297, longitude: 123.899 },
    "cebu doctors": { latitude: 10.338, longitude: 123.911 },
    cicc: { latitude: 10.335, longitude: 123.917 },
    banilad: { latitude: 10.345, longitude: 123.905 },
    apas: { latitude: 10.332, longitude: 123.9 },
  };

  const geocodePins = async (originText: string, destText: string) => {
    const originKey = originText.toLowerCase().trim();
    const destKey = destText.toLowerCase().trim();

    let originCoords = CEBU_LANDMARKS[originKey];
    let destCoords = CEBU_LANDMARKS[destKey];

    try {
      if (!originCoords) {
        const r = await Location.geocodeAsync(
          `${originText}, Cebu City, Cebu, Philippines`,
        );
        if (r.length > 0)
          originCoords = { latitude: r[0].latitude, longitude: r[0].longitude };
      }
      if (!destCoords) {
        const r = await Location.geocodeAsync(
          `${destText}, Cebu City, Cebu, Philippines`,
        );
        if (r.length > 0)
          destCoords = { latitude: r[0].latitude, longitude: r[0].longitude };
      }
    } catch (err) {
      console.log("Geocoding error:", err);
    }

    if (originCoords) setOriginPin({ ...originCoords, label: originText });
    if (destCoords) setDestinationPin({ ...destCoords, label: destText });

    if (originCoords && destCoords) {
      const lats = [originCoords.latitude, destCoords.latitude];
      const lngs = [originCoords.longitude, destCoords.longitude];
      const minLat = Math.min(...lats),
        maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs),
        maxLng = Math.max(...lngs);
      setTimeout(() => {
        mapRef.current?.animateToRegion(
          {
            latitude: (minLat + maxLat) / 2,
            longitude: (minLng + maxLng) / 2,
            latitudeDelta: Math.max((maxLat - minLat) * 1.8, 0.02),
            longitudeDelta: Math.max((maxLng - minLng) * 1.8, 0.02),
          },
          800,
        );
      }, 600);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      {/* ── Map fills entire screen — rendered first so UI floats above ── */}
      <MapView
        ref={mapRef}
        key={colorKey}
        style={StyleSheet.absoluteFillObject}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        initialRegion={CEBU_REGION}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        onTouchStart={() => setShowPinch(false)}
      >
        {activeRoutes.map((code) => {
          const coords = getPolylineCoords(code);
          if (coords.length === 0) return null;
          const color =
            geoJsonMap[code]?.properties?.color ||
            JEEPNEY_ROUTES.find((x) => x.code === code)?.color ||
            Colors.teal;
          return (
            <Polyline
              key={code}
              coordinates={coords}
              strokeColor={color}
              strokeWidth={4}
              lineCap="round"
              lineJoin="round"
              tappable={true}
              onPress={() => setSelectedRoute(code)}
            />
          );
        })}
        {activeRoutes.map((code) => {
          const coords = getPolylineCoords(code);
          if (coords.length < 2) return null;
          const r = JEEPNEY_ROUTES.find((x) => x.code === code);
          const color = r?.color || Colors.teal;
          return (
            <React.Fragment key={`markers-${code}`}>
              <Marker
                coordinate={coords[0]}
                pinColor={color}
                title={`${code} — Start`}
                onPress={() => setSelectedRoute(code)}
              />
              <Marker
                coordinate={coords[coords.length - 1]}
                pinColor={color}
                title={`${code} — End`}
                onPress={() => setSelectedRoute(code)}
              />
            </React.Fragment>
          );
        })}
        {userLocation && (
          <Marker coordinate={userLocation} anchor={{ x: 0.5, y: 1 }}>
            <View style={{ alignItems: "center" }}>
              {/* Callout bubble */}
              <View
                style={{
                  backgroundColor: Colors.teal,
                  borderRadius: 8,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  marginBottom: 4,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}
                >
                  My Location
                </Text>
              </View>
              {/* Triangle pointer */}
              <View
                style={{
                  width: 0,
                  height: 0,
                  borderLeftWidth: 5,
                  borderRightWidth: 5,
                  borderTopWidth: 6,
                  borderLeftColor: "transparent",
                  borderRightColor: "transparent",
                  borderTopColor: Colors.teal,
                  marginBottom: 2,
                }}
              />
              {/* Person icon circle */}
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: Colors.teal,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 3,
                  borderColor: "#fff",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5,
                }}
              >
                <Ionicons name="person" size={18} color="#fff" />
              </View>
            </View>
          </Marker>
        )}
        {originPin && (
          <Marker coordinate={originPin} title={`From: ${originPin.label}`}>
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  backgroundColor: Colors.teal,
                  borderRadius: 20,
                  padding: 6,
                  borderWidth: 2,
                  borderColor: "#fff",
                  elevation: 4,
                }}
              >
                <Ionicons name="location" size={16} color="#fff" />
              </View>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "700",
                  color: Colors.teal,
                  backgroundColor: "rgba(255,255,255,0.9)",
                  paddingHorizontal: 4,
                  borderRadius: 4,
                  marginTop: 2,
                }}
              >
                {originPin.label}
              </Text>
            </View>
          </Marker>
        )}
        {destinationPin && (
          <Marker
            coordinate={destinationPin}
            title={`To: ${destinationPin.label}`}
          >
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  backgroundColor: "#EF4444",
                  borderRadius: 20,
                  padding: 6,
                  borderWidth: 2,
                  borderColor: "#fff",
                  elevation: 4,
                }}
              >
                <Ionicons name="flag" size={16} color="#fff" />
              </View>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "700",
                  color: "#EF4444",
                  backgroundColor: "rgba(255,255,255,0.9)",
                  paddingHorizontal: 4,
                  borderRadius: 4,
                  marginTop: 2,
                }}
              >
                {destinationPin.label}
              </Text>
            </View>
          </Marker>
        )}
      </MapView>

      {/* ── Floating UI layer ── */}
      <SafeAreaView
        style={{ flex: 1 }}
        edges={["top"]}
        pointerEvents="box-none"
      >
        {/* ── Offline Banner ── */}
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
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery("");
                  setActiveRoutes([]);
                  setSuggestions([]);
                }}
              >
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={Colors.slateLight}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ── Search Dropdown ── */}
        {suggestions.length > 0 && (
          <View
            style={{
              marginHorizontal: 16,
              backgroundColor: "#fff",
              borderRadius: 10,
              borderWidth: 1,
              borderColor: Colors.tealLight,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 5,
              zIndex: 999,
            }}
          >
            {suggestions.map((code, i) => {
              const r = JEEPNEY_ROUTES.find((x) => x.code === code);
              const props = geoJsonMap[code]?.properties;
              return (
                <TouchableOpacity
                  key={code}
                  onPress={() => selectSuggestion(code)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 12,
                    paddingHorizontal: 14,
                    borderBottomWidth: i < suggestions.length - 1 ? 1 : 0,
                    borderBottomColor: Colors.borderLight,
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      backgroundColor: r?.color || props?.color || Colors.teal,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{ color: "#fff", fontWeight: "800", fontSize: 11 }}
                    >
                      {code}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: Colors.navy,
                      }}
                    >
                      {code}
                    </Text>
                    <Text style={{ fontSize: 12, color: Colors.slate }}>
                      {r ? `${r.origin} → ${r.dest}` : props?.name || ""}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* ── Route Pills ── */}
        <View style={{ height: 44 }} pointerEvents="box-none">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillsRow}
            keyboardShouldPersistTaps="handled"
          >
            {Object.keys(geoJsonMap).map((code) => {
              const r = JEEPNEY_ROUTES.find((x) => x.code === code);
              const color =
                r?.color || geoJsonMap[code]?.properties?.color || Colors.teal;
              const isActive = activeRoutes.includes(code);
              return (
                <TouchableOpacity
                  key={code}
                  style={[
                    styles.pill,
                    { backgroundColor: isActive ? color : Colors.borderLight },
                  ]}
                  onPress={() => {
                    setActiveRoutes((prev) =>
                      prev.includes(code)
                        ? prev.filter((c) => c !== code)
                        : [...prev, code],
                    );
                    const geo = geoJsonMap[code];
                    if (geo?.geometry?.coordinates?.length > 0) {
                      const allCoords = geo.geometry.coordinates;
                      const lats = allCoords.map(([, lat]) => lat);
                      const lngs = allCoords.map(([lng]) => lng);
                      const minLat = Math.min(...lats),
                        maxLat = Math.max(...lats);
                      const minLng = Math.min(...lngs),
                        maxLng = Math.max(...lngs);
                      mapRef.current?.animateToRegion(
                        {
                          latitude: (minLat + maxLat) / 2,
                          longitude: (minLng + maxLng) / 2,
                          latitudeDelta: (maxLat - minLat) * 1.4,
                          longitudeDelta: (maxLng - minLng) * 1.4,
                        },
                        800,
                      );
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.pillDot,
                      { backgroundColor: isActive ? "#fff" : color },
                    ]}
                  />
                  <Text
                    style={[
                      styles.pillText,
                      { color: isActive ? "#fff" : Colors.slate },
                    ]}
                  >
                    {code}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Loading Banner ── */}
        {(geoLoading || nearbyLoading) && (
          <View style={styles.aiLoadingWrap}>
            <ActivityIndicator size="small" color={Colors.teal} />
            <Text style={styles.aiLoadingText}>
              {nearbyLoading
                ? "📍 Finding routes near you..."
                : "🗺️ Loading route maps..."}
            </Text>
          </View>
        )}

        {/* ── Locate Me Button — bottom right ── */}
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "flex-end",
            paddingRight: 16,
            paddingBottom: 100,
          }}
          pointerEvents="box-none"
        >
          <TouchableOpacity style={styles.locateBtn} onPress={getUserLocation}>
            {locLoading ? (
              <ActivityIndicator size="small" color={Colors.teal} />
            ) : (
              <Ionicons name="locate" size={20} color={Colors.teal} />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* ── Selected Route Detail Popup ── */}
      {selectedRoute &&
        (() => {
          const r = JEEPNEY_ROUTES.find((x) => x.code === selectedRoute);
          const props = geoJsonMap[selectedRoute]?.properties;
          const color = r?.color || props?.color || Colors.teal;
          return (
            <View
              style={{
                position: "absolute",
                bottom: 110,
                left: 16,
                right: 16,
                backgroundColor: "rgba(255,255,255,0.97)",
                borderRadius: 16,
                padding: 14,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: color,
                      borderRadius: 8,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                    }}
                  >
                    <Text
                      style={{ color: "#fff", fontWeight: "800", fontSize: 14 }}
                    >
                      {selectedRoute}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "700",
                      color: Colors.navy,
                    }}
                  >
                    {r?.origin || props?.name} → {r?.dest || ""}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedRoute(null)}>
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={Colors.slate}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "row", gap: 16 }}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <Ionicons name="cash-outline" size={14} color={Colors.teal} />
                  <Text style={{ fontSize: 13, color: Colors.slate }}>
                    ₱{r?.fare || props?.fare || 13}
                  </Text>
                </View>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <Ionicons name="time-outline" size={14} color={Colors.teal} />
                  <Text style={{ fontSize: 13, color: Colors.slate }}>
                    {r?.hours || "5:00 AM - 10:00 PM"}
                  </Text>
                </View>
              </View>
              {r?.notes && (
                <Text
                  style={{ fontSize: 12, color: Colors.slate, marginTop: 6 }}
                >
                  {r.notes}
                </Text>
              )}
            </View>
          );
        })()}

      {/* ── AI Instruction Popup ── */}
      {routeInstruction && (
        <View
          style={{
            position: "absolute",
            bottom: selectedRoute ? 280 : 110,
            left: 16,
            right: 16,
            backgroundColor: "rgba(255,255,255,0.97)",
            borderRadius: 16,
            padding: 14,
            maxHeight: 130,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <View style={{ flex: 1, flexDirection: "row", gap: 8 }}>
              <Ionicons name="sparkles-outline" size={16} color={Colors.teal} />
              <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
              >
                <Text
                  style={{
                    fontSize: 13,
                    color: Colors.navy,
                    fontWeight: "600",
                  }}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {routeInstruction}
                </Text>
              </ScrollView>
            </View>
            <TouchableOpacity onPress={() => setRouteInstruction(null)}>
              <Ionicons name="close-circle" size={20} color={Colors.slate} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── Nearby Routes Banner — floats above everything ── */}
      {nearbyVisible && nearbyRoutes.length > 0 && (
        <View
          style={{
            position: "absolute",
            bottom: 100,
            left: 16,
            right: 16,
            backgroundColor: "rgba(255,255,255,0.97)",
            borderRadius: 16,
            padding: 14,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <Ionicons name="location" size={18} color={Colors.teal} />
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Text
                style={{ fontSize: 13, fontWeight: "700", color: Colors.navy }}
              >
                {nearbyRoutes.length} route{nearbyRoutes.length > 1 ? "s" : ""}{" "}
                near you
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setNearbyVisible(false);
                  setActiveRoutes([]);
                  setNearbyRoutes([]);
                }}
              >
                <Ionicons name="close-circle" size={18} color={Colors.slate} />
              </TouchableOpacity>
            </View>
            {nearbyRoutes.slice(0, 5).map((r: any) => (
              <TouchableOpacity
                key={r.code}
                onPress={() => {
                  setActiveRoutes([r.code]);
                  setSearchQuery(r.code);
                  setNearbyVisible(false);
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: r.color,
                    marginBottom: 2,
                  }}
                >
                  {r.code} — {r.name} ({r.distanceMeters}m)
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
