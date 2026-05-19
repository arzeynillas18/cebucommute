import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
  Platform,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import MapView, { Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { useApp } from "../context/AppContext";
import { Colors } from "../styles/theme";
import { JEEPNEY_ROUTES, JeepneyRoute } from "../constants/routes";
import type { TabParamList } from "../types/navigation";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { useGeoJSON } from "../hooks/useGeoJSON";

const API_URL = "http://192.168.0.113:3000";

type NavProp = BottomTabNavigationProp<TabParamList>;

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning! 🌤";
  if (h < 17) return "Good afternoon! 👋";
  return "Good evening! 🌙";
}

const QUICK_ACCESS = [
  { id: "1", label: "SM City Cebu", type: "recent", icon: "time-outline" },
  { id: "2", label: "Colon Street", type: "saved", icon: "star-outline" },
  { id: "3", label: "IT Park", type: "saved", icon: "home-outline" },
  {
    id: "4",
    label: "Ayala Center",
    type: "recent",
    icon: "bag-handle-outline",
  },
];

const CEBU_CENTER = {
  latitude: 10.3,
  longitude: 123.9,
  latitudeDelta: 0.08,
  longitudeDelta: 0.07,
};

// ── Route Card ──────────────────────────────────────────────────────────────
const RouteCard = ({
  route,
  aiReason,
  onViewMap,
}: {
  route: JeepneyRoute;
  aiReason?: string;
  onViewMap: () => void;
}) => (
  <View
    style={{
      backgroundColor: "#fff",
      borderRadius: 16,
      padding: 14,
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      shadowColor: "#0F172A",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    }}
  >
    <View
      style={{
        width: 52,
        height: 52,
        borderRadius: 12,
        backgroundColor: route.color,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "800", fontSize: 13 }}>
        {route.code}
      </Text>
      <Ionicons
        name="star-outline"
        size={11}
        color="rgba(255,255,255,0.7)"
        style={{ marginTop: 2 }}
      />
    </View>
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: 15,
          fontWeight: "700",
          color: "#0F172A",
          marginBottom: 3,
        }}
      >
        {route.origin} → {route.dest}
      </Text>
      {aiReason ? (
        <Text style={{ fontSize: 12, color: Colors.teal, fontStyle: "italic" }}>
          {aiReason}
        </Text>
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons name="time-outline" size={12} color="#94A3B8" />
          <Text style={{ fontSize: 12, color: "#64748B" }}>{route.hours}</Text>
          <Text style={{ fontSize: 12, color: "#94A3B8" }}>•</Text>
          <Text style={{ fontSize: 12, color: "#64748B" }}>₱{route.fare}</Text>
        </View>
      )}
    </View>
    <TouchableOpacity
      onPress={onViewMap}
      style={{
        backgroundColor: "#F0FDFA",
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignItems: "center",
        gap: 4,
      }}
    >
      <Ionicons name="map-outline" size={16} color={Colors.teal} />
      <Text style={{ fontSize: 11, color: Colors.teal, fontWeight: "600" }}>
        View Map
      </Text>
    </TouchableOpacity>
  </View>
);

// ── Mini Map Card ────────────────────────────────────────────────────────────
const MiniMapCard = ({
  geoJsonMap,
  onPress,
}: {
  geoJsonMap: any;
  onPress: () => void;
}) => {
  const preview = ["01K", "03A", "17B", "12L"].filter((c) => geoJsonMap[c]);
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        marginHorizontal: 16,
        marginBottom: 20,
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
      }}
    >
      <View style={{ flexDirection: "row", minHeight: 160 }}>
        {/* ── Left info panel ── */}
        <View style={{ flex: 1, padding: 16, justifyContent: "space-between" }}>
          <View>
            <Text style={{ fontSize: 16, fontWeight: "800", color: "#0F172A" }}>
              Live Jeepney Map
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                marginTop: 4,
              }}
            >
              <View
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 4,
                  backgroundColor: "#22C55E",
                }}
              />
              <Text style={{ fontSize: 12, color: "#64748B" }}>
                Live updates
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 12 }}>
            <Text style={{ fontSize: 12, color: "#64748B", marginBottom: 6 }}>
              Nearby Routes
            </Text>
            <View style={{ flexDirection: "row", gap: 5, flexWrap: "wrap" }}>
              {["01B", "01C", "17B", "12L"].map((code) => {
                const r = JEEPNEY_ROUTES.find((x) => x.code === code);
                return (
                  <View
                    key={code}
                    style={{
                      backgroundColor: r?.color || Colors.teal,
                      borderRadius: 6,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                    }}
                  >
                    <Text
                      style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}
                    >
                      {code}
                    </Text>
                  </View>
                );
              })}
              <View
                style={{
                  backgroundColor: "#F1F5F9",
                  borderRadius: 6,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                }}
              >
                <Text
                  style={{ color: "#64748B", fontSize: 11, fontWeight: "600" }}
                >
                  +3 more
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={onPress}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: "#F8FAFC",
              borderRadius: 12,
              paddingVertical: 10,
              paddingHorizontal: 14,
              marginTop: 12,
              borderWidth: 1,
              borderColor: "#E2E8F0",
              alignSelf: "flex-start",
            }}
          >
            <Ionicons name="map-outline" size={14} color={Colors.teal} />
            <Text
              style={{ fontSize: 13, color: Colors.teal, fontWeight: "700" }}
            >
              View Full Map
            </Text>
            <Ionicons name="chevron-forward" size={13} color={Colors.teal} />
          </TouchableOpacity>
        </View>

        {/* ── Right map panel ── */}
        <View
          style={{
            width: 180,
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            overflow: "hidden",
          }}
        >
          <MapView
            style={{ flex: 1 }}
            provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
            initialRegion={CEBU_CENTER}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            showsCompass={false}
            showsScale={false}
            showsPointsOfInterest={false}
          >
            {preview.map((code) => {
              const geo = geoJsonMap[code];
              if (!geo?.geometry?.coordinates) return null;
              const coords = geo.geometry.coordinates.map(
                ([lon, lat]: [number, number]) => ({
                  latitude: lat,
                  longitude: lon,
                }),
              );
              return (
                <Polyline
                  key={code}
                  coordinates={coords}
                  strokeColor={geo.properties?.color || Colors.teal}
                  strokeWidth={3}
                  lineCap="round"
                />
              );
            })}
          </MapView>
        </View>
      </View>
    </View>
  );
};

// ── Main Screen ──────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const navigation = useNavigation<NavProp>();
  const { isOnline } = useNetworkStatus();
  const { geoJsonMap } = useGeoJSON();
  const { t, fs } = useApp();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [activeFilter, setActiveFilter] = useState<"shortest" | "cheapest">(
    "shortest",
  );
  const [loading, setLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);
  const [aiRoutes, setAiRoutes] = useState<JeepneyRoute[]>([]);
  const [noRoute, setNoRoute] = useState(false);
  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    const interval = setInterval(() => setGreeting(getGreeting()), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSwap = () => {
    const t = origin;
    setOrigin(destination);
    setDestination(t);
  };

  const handleSearch = async () => {
    if (!origin.trim() || !destination.trim()) {
      Alert.alert("Missing Info", "Please enter both origin and destination.");
      return;
    }
    setLoading(true);
    setAiSuggestion(null);
    setAiRoutes([]);
    setNoRoute(false);
    try {
      const res = await fetch(`${API_URL}/api/ai/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin, destination }),
      });
      const data = await res.json();
      if (data.success && data.suggestion?.routeDetails?.length > 0) {
        setAiSuggestion(data.suggestion);
        const matched = data.suggestion.routes
          .map((code: string) => JEEPNEY_ROUTES.find((r) => r.code === code))
          .filter(Boolean) as JeepneyRoute[];
        setAiRoutes(matched);
      } else {
        setNoRoute(true);
      }
    } catch {
      setAiRoutes(JEEPNEY_ROUTES.slice(0, 2));
    } finally {
      setLoading(false);
    }
  };

  const displayRoutes =
    aiRoutes.length > 0 ? aiRoutes : JEEPNEY_ROUTES.slice(0, 2);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F8FAFC" }}
      edges={["top"]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* ── Header with background ── */}
        <ImageBackground
          source={require("../../assets/bg_homescreen.png")}
          style={{ paddingBottom: 8 }}
          resizeMode="cover"
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 16,
              paddingTop: 8,
              paddingBottom: 16,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: Colors.teal,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="bus" size={20} color="#fff" />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "800",
                    color: "#0F172A",
                    letterSpacing: 1,
                  }}
                >
                  CEBU
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "600",
                    color: Colors.teal,
                    letterSpacing: 2,
                    marginTop: -2,
                  }}
                >
                  COMMUTE
                </Text>
              </View>
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  backgroundColor: "#fff",
                  borderRadius: 20,
                  paddingVertical: 7,
                  paddingHorizontal: 12,
                  shadowColor: "#0F172A",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.06,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Ionicons
                  name="location-outline"
                  size={14}
                  color={Colors.teal}
                />
                <Text
                  style={{ fontSize: 13, fontWeight: "600", color: "#0F172A" }}
                >
                  Cebu City
                </Text>
                <Ionicons name="chevron-down" size={13} color="#64748B" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("Profile")}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  backgroundColor: "#fff",
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#0F172A",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.06,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Ionicons
                  name="notifications-outline"
                  size={18}
                  color="#0F172A"
                />
                <View
                  style={{
                    position: "absolute",
                    top: 7,
                    right: 7,
                    width: 7,
                    height: 7,
                    borderRadius: 4,
                    backgroundColor: "#EF4444",
                    borderWidth: 1.5,
                    borderColor: "#fff",
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Greeting ── */}
          <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "800",
                color: "#0F172A",
                marginBottom: 2,
              }}
            >
              {greeting}
            </Text>
            <Text style={{ fontSize: fs(14), color: "#64748B" }}>
              {t("Where are you going today?", "Saan ka pupunta ngayon?")}
            </Text>
          </View>
        </ImageBackground>

        {/* ── Offline Banner ── */}
        {!isOnline && (
          <View
            style={{
              marginHorizontal: 16,
              marginBottom: 12,
              backgroundColor: "#FEF3C7",
              borderRadius: 12,
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Ionicons name="warning-outline" size={16} color="#D97706" />
            <Text style={{ fontSize: 13, color: "#92400E", fontWeight: "600" }}>
              Offline Mode — Data available locally
            </Text>
          </View>
        )}

        {/* ── Search Card ── */}
        <View
          style={{
            marginHorizontal: 16,
            marginBottom: 12,
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 16,
            shadowColor: "#0F172A",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          {/* From */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              marginBottom: 4,
            }}
          >
            <View style={{ width: 20, alignItems: "center" }}>
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: Colors.teal,
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: fs(11),
                  color: Colors.teal,
                  fontWeight: "700",
                  marginBottom: 2,
                }}
              >
                {t("From", "Mula")}
              </Text>
              <TextInput
                style={{
                  fontSize: 15,
                  color: "#0F172A",
                  fontWeight: "500",
                  padding: 0,
                }}
                placeholder="Enter pickup point"
                placeholderTextColor="#CBD5E1"
                value={origin}
                onChangeText={setOrigin}
              />
            </View>
          </View>

          {/* Dotted connector */}
          <View
            style={{
              marginLeft: 9,
              marginVertical: 4,
              gap: 3,
              flexDirection: "column",
            }}
          >
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={{
                  width: 2,
                  height: 2,
                  borderRadius: 1,
                  backgroundColor: "#CBD5E1",
                }}
              />
            ))}
          </View>

          {/* To */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 20, alignItems: "center" }}>
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "#EF4444",
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: fs(11),
                  color: "#EF4444",
                  fontWeight: "700",
                  marginBottom: 2,
                }}
              >
                {t("To", "Patungo")}
              </Text>
              <TextInput
                style={{
                  fontSize: 15,
                  color: "#0F172A",
                  fontWeight: "500",
                  padding: 0,
                }}
                placeholder="Where do you want to go?"
                placeholderTextColor="#CBD5E1"
                value={destination}
                onChangeText={setDestination}
              />
            </View>
          </View>

          {/* Swap */}
          <TouchableOpacity
            onPress={handleSwap}
            style={{
              position: "absolute",
              right: 16,
              top: "50%",
              marginTop: -16,
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: "#F8FAFC",
              borderWidth: 1,
              borderColor: "#E2E8F0",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="swap-vertical" size={16} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* ── Find Route Button ── */}
        <TouchableOpacity
          onPress={handleSearch}
          disabled={loading}
          style={{
            marginHorizontal: 16,
            marginBottom: 20,
            borderRadius: 16,
            backgroundColor: Colors.teal,
            shadowColor: Colors.teal,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 10,
            elevation: 6,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 18,
            }}
          >
            {loading ? (
              <ActivityIndicator
                color="#fff"
                size="small"
                style={{ flex: 1 }}
              />
            ) : (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <Text style={{ fontSize: 22 }}>✨</Text>
                  <View>
                    <Text
                      style={{
                        fontSize: fs(16),
                        fontWeight: "800",
                        color: "#fff",
                      }}
                    >
                      {t(
                        "Find Smartest Route",
                        "Hanapin ang Pinakamahusay na Ruta",
                      )}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "rgba(255,255,255,0.8)",
                        marginTop: 1,
                      }}
                    >
                      AI finds the best jeepney route for you
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="chevron-forward" size={18} color="#fff" />
                </View>
              </>
            )}
          </View>
        </TouchableOpacity>

        {/* ── Quick Access ── */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text
              style={{ fontSize: fs(16), fontWeight: "800", color: "#0F172A" }}
            >
              {t("Quick Access", "Mabilis na Access")}
            </Text>
            <TouchableOpacity>
              <Text
                style={{ fontSize: 13, color: Colors.teal, fontWeight: "600" }}
              >
                See All
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: -16, paddingHorizontal: 16 }}
          >
            {QUICK_ACCESS.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => setDestination(item.label)}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  padding: 14,
                  marginRight: 10,
                  width: 110,
                  alignItems: "center",
                  shadowColor: "#0F172A",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 6,
                  elevation: 2,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor:
                      item.type === "recent" ? "#F0FDFA" : "#FFF7ED",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={item.type === "recent" ? Colors.teal : "#F97316"}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: "#0F172A",
                    textAlign: "center",
                    marginBottom: 2,
                  }}
                  numberOfLines={2}
                >
                  {item.label}
                </Text>
                <Text style={{ fontSize: 10, color: "#94A3B8" }}>
                  {item.type === "recent" ? "Recent" : "Saved"}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── AI Suggestion ── */}
        {aiSuggestion && (
          <View
            style={{
              marginHorizontal: 16,
              marginBottom: 16,
              backgroundColor: "#F0FDFA",
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: "#99F6E4",
            }}
          >
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
              <Ionicons name="sparkles-outline" size={18} color={Colors.teal} />
              <Text
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: "#0F172A",
                  fontWeight: "500",
                  lineHeight: 20,
                }}
              >
                {aiSuggestion.instruction}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 13, color: "#64748B" }}>
                ⏱ {aiSuggestion.estimatedTime} • ₱{aiSuggestion.totalFare}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (aiSuggestion.routes.length > 0) {
                    navigation.navigate("Maps", {
                      routeCode: aiSuggestion.routes[0],
                      instruction: aiSuggestion.instruction,
                      destination,
                      origin,
                      allRoutes: aiSuggestion.routes.join(","),
                    });
                  }
                }}
                style={{
                  backgroundColor: Colors.teal,
                  borderRadius: 10,
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Ionicons name="map-outline" size={14} color="#fff" />
                <Text
                  style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}
                >
                  View on Map
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── Mini Map ── */}
        <MiniMapCard
          geoJsonMap={geoJsonMap}
          onPress={() => navigation.navigate("Maps")}
        />

        {/* ── Suggested Routes ── */}
        <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text
              style={{ fontSize: fs(16), fontWeight: "800", color: "#0F172A" }}
            >
              {t("Suggested Routes", "Mga Iminungkahing Ruta")}
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {(["shortest", "cheapest"] as const).map((f) => (
                <TouchableOpacity
                  key={f}
                  onPress={() => setActiveFilter(f)}
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    borderRadius: 20,
                    backgroundColor:
                      activeFilter === f ? Colors.teal : "#F1F5F9",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "700",
                      color: activeFilter === f ? "#fff" : "#64748B",
                    }}
                  >
                    {f === "shortest" ? "Shortest" : "Cheapest"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {loading ? (
            <View
              style={{ alignItems: "center", paddingVertical: 32, gap: 10 }}
            >
              <ActivityIndicator color={Colors.teal} size="large" />
              <Text style={{ fontSize: 14, color: "#64748B" }}>
                AI is finding the best route...
              </Text>
            </View>
          ) : (
            displayRoutes.map((route, index) => (
              <RouteCard
                key={`${route.code}-${index}`}
                route={route}
                aiReason={
                  aiSuggestion?.routeDetails?.find(
                    (r: any) => r.code === route.code,
                  )?.aiReason
                }
                onViewMap={() =>
                  navigation.navigate("Maps", { routeCode: route.code })
                }
              />
            ))
          )}

          {noRoute && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#FEF2F2",
                borderRadius: 12,
                padding: 14,
                gap: 8,
                marginTop: 4,
              }}
            >
              <Ionicons name="warning-outline" size={16} color="#EF4444" />
              <Text
                style={{ fontSize: 14, color: "#B91C1C", fontWeight: "600" }}
              >
                No Route Found — try a different search.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
