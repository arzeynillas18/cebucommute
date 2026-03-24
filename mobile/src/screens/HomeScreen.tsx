import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import styles from '../styles/HomeScreen.styles';
import { Colors } from '../styles/theme';
import { JEEPNEY_ROUTES, JeepneyRoute } from '../constants/routes';
import type { TabParamList } from '../types/navigation';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

// ─── Config ───────────────────────────────────────────────────────────────────

// Change this to your PC's local IP when testing on a real device
// Run `ip addr` on Linux to find your IP (e.g. 192.168.1.x)
const API_URL = 'http://192.168.0.119'; // Android emulator
// const API_URL = 'http://localhost:3000'; // iOS simulator

type NavProp = BottomTabNavigationProp<TabParamList>;

// ─── Recent Chips ─────────────────────────────────────────────────────────────

const RECENT = [
  { id: '1', label: 'SM City Cebu',  type: 'recent' },
  { id: '2', label: 'Colon Street',  type: 'saved'  },
];

// ─── Sub Components ───────────────────────────────────────────────────────────

const RouteCard = ({
  route,
  aiReason,
  onViewMap,
}: {
  route: JeepneyRoute;
  aiReason?: string;
  onViewMap: () => void;
}) => (
  <View style={styles.routeCard}>
    <View style={[styles.routeBadge, { backgroundColor: route.color }]}>
      <Text style={styles.routeBadgeText}>{route.code}</Text>
    </View>
    <View style={styles.routeInfo}>
      <Text style={styles.routeName}>{route.origin} to {route.dest}</Text>
      {aiReason ? (
        <Text style={[styles.routeMetaText, { color: Colors.teal, fontStyle: 'italic' }]}>
          {aiReason}
        </Text>
      ) : (
        <View style={styles.routeMeta}>
          <Ionicons name="time-outline" size={12} color={Colors.slate} />
          <Text style={styles.routeMetaText}>{route.hours}</Text>
          <Text style={styles.routeMetaDot}>•</Text>
          <Text style={styles.routeMetaText}>₱{route.fare}</Text>
        </View>
      )}
    </View>
    <TouchableOpacity style={styles.viewMapBtn} onPress={onViewMap}>
      <Ionicons name="map-outline" size={14} color={Colors.teal} />
      <Text style={styles.viewMapText}>View Map</Text>
    </TouchableOpacity>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const navigation = useNavigation<NavProp>();
  const { isOnline } = useNetworkStatus();

  const [origin, setOrigin]           = useState('Ayala Center Cebu');
  const [destination, setDestination] = useState('Carbon Market');
  const [activeFilter, setActiveFilter] = useState<'shortest' | 'cheapest'>('shortest');
  const [loading, setLoading]         = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);
  const [aiRoutes, setAiRoutes]       = useState<JeepneyRoute[]>([]);
  const [noRoute, setNoRoute]         = useState(false);

  // ── Swap origin/destination ──
  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  // ── Ask AI for best route ──
  const handleSearch = async () => {
    if (!origin.trim() || !destination.trim()) {
      Alert.alert('Missing Info', 'Please enter both origin and destination.');
      return;
    }

    setLoading(true);
    setAiSuggestion(null);
    setAiRoutes([]);
    setNoRoute(false);

    try {
      const res = await fetch(`${API_URL}/api/ai/suggest`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ origin, destination }),
      });

      const data = await res.json();

      if (data.success && data.suggestion?.routeDetails?.length > 0) {
        setAiSuggestion(data.suggestion);
        // Match returned route codes to local route data
        const matched = data.suggestion.routes
          .map((code: string) => JEEPNEY_ROUTES.find(r => r.code === code))
          .filter(Boolean) as JeepneyRoute[];
        setAiRoutes(matched);
      } else {
        setNoRoute(true);
      }
    } catch (err) {
      // Fallback to local data if backend is offline
      const fallback = JEEPNEY_ROUTES.slice(0, 2);
      setAiRoutes(fallback);
    } finally {
      setLoading(false);
    }
  };

  const displayRoutes = aiRoutes.length > 0 ? aiRoutes : JEEPNEY_ROUTES.slice(0, 2);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgSecondary} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoCircle}>
              <Ionicons name="bus" size={28} color="#fff" />
            </View>
            <View>
              <Text style={styles.logoTitle}>CEBU</Text>
              <Text style={styles.logoSub}>COMMUTE</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-outline" size={20} color={Colors.teal} />
          </TouchableOpacity>
        </View>

        <Text style={styles.tagline}>Navigate Cebu Jeepneys Easily.</Text>

        {/* ── Offline Banner — only shows when no internet ── */}
        {!isOnline && (
          <View style={styles.banner}>
            <View style={styles.bannerDot} />
            <Text style={styles.bannerText}>Offline Mode — Data available locally</Text>
          </View>
        )}

        {/* ── Search Card ── */}
        <View style={styles.searchCard}>
          <View style={styles.inputRow}>
            <Ionicons name="location-outline" size={20} color={Colors.teal} />
            <View style={styles.inputDivider} />
            <TextInput
              style={styles.input}
              placeholder="Enter Origin"
              placeholderTextColor={Colors.slateLight}
              value={origin}
              onChangeText={setOrigin}
            />
          </View>
          <View style={styles.inputSep} />
          <View style={styles.inputRow}>
            <Ionicons name="flag-outline" size={20} color={Colors.teal} />
            <View style={styles.inputDivider} />
            <TextInput
              style={styles.input}
              placeholder="Enter Destination"
              placeholderTextColor={Colors.slateLight}
              value={destination}
              onChangeText={setDestination}
            />
          </View>
          <TouchableOpacity style={styles.swapBtn} onPress={handleSwap}>
            <Ionicons name="swap-vertical" size={18} color={Colors.teal} />
          </TouchableOpacity>
        </View>

        {/* ── AI Search Button ── */}
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" size="small" />
            : <Text style={styles.searchBtnText}>🤖 Find Best Route with AI</Text>
          }
        </TouchableOpacity>

        {/* ── Recent / Saved Chips ── */}
        <View style={styles.chips}>
          {RECENT.map((r) => (
            <TouchableOpacity
              key={r.id}
              style={styles.chip}
              onPress={() => setDestination(r.label)}
            >
              <Ionicons
                name={r.type === 'recent' ? 'time-outline' : 'bookmark-outline'}
                size={15}
                color="#fff"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.chipText}>
                {r.type === 'recent' ? 'Recent: ' : 'Saved: '}
                <Text style={styles.chipTextBold}>{r.label}</Text>
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />

        {/* ── Quick Actions ── */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickBtn}>
            <Ionicons name="git-branch-outline" size={28} color={Colors.teal} />
            <Text style={styles.quickBtnLabel}>Route Planner</Text>
          </TouchableOpacity>
          <View style={styles.quickBtnDivider} />
          <TouchableOpacity
            style={styles.quickBtn}
            onPress={() => navigation.navigate('Maps')}
          >
            <Ionicons name="map-outline" size={28} color={Colors.teal} />
            <Text style={styles.quickBtnLabel}>Jeepney Map</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* ── AI Suggestion Banner ── */}
        {aiSuggestion && (
          <View style={styles.aiBanner}>
            <Ionicons name="sparkles-outline" size={18} color={Colors.tealDark} />
            <Text style={styles.aiBannerText}>
              {aiSuggestion.instruction}
              {'\n'}⏱ {aiSuggestion.estimatedTime}  •  ₱{aiSuggestion.totalFare}
            </Text>
          </View>
        )}

        {/* ── Suggested Routes ── */}
        <Text style={styles.sectionTitle}>
          {aiRoutes.length > 0 ? '🤖 AI Suggested Routes' : 'Suggested Routes'}
        </Text>

        <View style={styles.filterRow}>
          {(['shortest', 'cheapest'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, activeFilter === f && styles.filterBtnActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterBtnText, activeFilter === f && styles.filterBtnTextActive]}>
                {f === 'shortest' ? 'Shortest Time' : 'Cheapest Fare'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={Colors.teal} size="large" />
            <Text style={styles.loadingText}>AI is finding the best route...</Text>
          </View>
        ) : (
          displayRoutes.map((route) => (
            <RouteCard
              key={route.id}
              route={route}
              aiReason={aiSuggestion?.routeDetails?.find((r: any) => r.code === route.code)?.aiReason}
              onViewMap={() => navigation.navigate('Maps')}
            />
          ))
        )}

        {/* ── No Route Found ── */}
        {noRoute && (
          <View style={styles.noRouteBanner}>
            <Ionicons name="warning-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.noRouteText}>No Route Found — try a different search.</Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}