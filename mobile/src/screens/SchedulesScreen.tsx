import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import styles from '../styles/SchedulesScreen.styles';
import { Colors } from '../styles/theme';
import { JEEPNEY_ROUTES, JeepneyRoute } from '../constants/routes';
import type { TabParamList } from '../types/navigation';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type NavProp      = BottomTabNavigationProp<TabParamList>;
type AreaFilter   = 'All' | 'Downtown' | 'Uptown';
type SortMode     = 'code' | 'name';

// ─── Schedule Card ────────────────────────────────────────────────────────────

const ScheduleCard = ({
  route,
  isOpen,
  onToggle,
  onViewMap,
  onPlanRoute,
}: {
  route:       JeepneyRoute;
  isOpen:      boolean;
  onToggle:    () => void;
  onViewMap:   () => void;
  onPlanRoute: () => void;
}) => (
  <View style={[styles.scheduleCard, { borderLeftColor: route.color }]}>
    {/* Header */}
    <TouchableOpacity style={styles.cardHeader} onPress={onToggle} activeOpacity={0.8}>
      <View style={[styles.cardBadge, { backgroundColor: route.color }]}>
        <Text style={styles.cardBadgeText}>{route.code}</Text>
      </View>
      <View style={styles.cardHeaderInfo}>
        <Text style={styles.cardTitle}>{route.origin} - {route.dest}</Text>
        <Text style={styles.cardHours}>Operating Hours: {route.hours}</Text>
      </View>
      <View style={styles.cardChevron}>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={Colors.teal}
        />
      </View>
    </TouchableOpacity>

    {/* Body */}
    {isOpen && (
      <View style={styles.cardBody}>
        <Text style={styles.cardFrequency}>
          Frequency: {route.frequency}
        </Text>

        {[
          `First Trip: ${route.firstTrip}`,
          `Last Trip: ${route.lastTrip}`,
          `Fare: ₱${route.fare}`,
          `Notes: ${route.notes}`,
        ].map((item, i) => (
          <View key={i} style={styles.bulletRow}>
            <View style={[styles.bulletDot, { backgroundColor: route.color }]} />
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}

        <Text style={styles.cardExpanded}>
          Expanded details: peak vs. Off-Peak, Holiday Adjustments, Transfer Point.
        </Text>

        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.cardActionBtn} onPress={onViewMap}>
            <Ionicons name="map-outline" size={16} color="#fff" />
            <Text style={styles.cardActionText}>View on Map</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cardActionBtn} onPress={onPlanRoute}>
            <Ionicons name="git-branch-outline" size={16} color="#fff" />
            <Text style={styles.cardActionText}>Plan Route</Text>
          </TouchableOpacity>
        </View>
      </View>
    )}
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function SchedulesScreen() {
  const navigation = useNavigation<NavProp>();

  const [search, setSearch]         = useState('');
  const [area, setArea]             = useState<AreaFilter>('All');
  const [sort, setSort]             = useState<SortMode>('code');
  const [openCards, setOpenCards]   = useState<string[]>(['01B']);

  const toggleCard = (code: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenCards(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const cycleArea = () => {
    const order: AreaFilter[] = ['All', 'Downtown', 'Uptown'];
    setArea(order[(order.indexOf(area) + 1) % order.length]);
  };

  const cycleSort = () => setSort(prev => prev === 'code' ? 'name' : 'code');

  const filtered = useMemo(() => {
    let list = [...JEEPNEY_ROUTES];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        r.code.toLowerCase().includes(q) ||
        r.origin.toLowerCase().includes(q) ||
        r.dest.toLowerCase().includes(q)
      );
    }

    if (area !== 'All') list = list.filter(r => r.area === area);

    list.sort((a, b) =>
      sort === 'code'
        ? a.code.localeCompare(b.code)
        : `${a.origin}${a.dest}`.localeCompare(`${b.origin}${b.dest}`)
    );

    return list;
  }, [search, area, sort]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgSecondary} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Jeepney Schedules</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="options-outline" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Search ── */}
        <View style={styles.searchWrap}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color={Colors.teal} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by Route Code (e.g., 01B)"
              placeholderTextColor={Colors.slateLight}
              value={search}
              onChangeText={setSearch}
              autoCapitalize="characters"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={18} color={Colors.slateLight} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ── Route Quick List ── */}
        <View style={styles.routeListCard}>
          {JEEPNEY_ROUTES.map((r, i) => (
            <TouchableOpacity
              key={r.id}
              style={[
                styles.routeListItem,
                i < JEEPNEY_ROUTES.length - 1 && styles.routeListBorder,
              ]}
              onPress={() => {
                setSearch(r.code);
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setOpenCards([r.code]);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.routeListName}>{r.origin} - {r.dest}</Text>
              <View style={[styles.routeCodeBadge, { backgroundColor: r.color }]}>
                <Text style={styles.routeCodeText}>{r.code}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Filters ── */}
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterBtn} onPress={cycleSort}>
            <Ionicons name="swap-vertical-outline" size={14} color="#fff" />
            <Text style={styles.filterBtnText}>
              Sort: {sort === 'code' ? 'Route Code' : 'Name'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn} onPress={cycleArea}>
            <Ionicons name="location-outline" size={14} color="#fff" />
            <Text style={styles.filterBtnText}>Area: {area}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Schedule Cards ── */}
        {filtered.length > 0 ? (
          filtered.map(route => (
            <ScheduleCard
              key={route.id}
              route={route}
              isOpen={openCards.includes(route.code)}
              onToggle={() => toggleCard(route.code)}
              onViewMap={() => navigation.navigate('Maps')}
              onPlanRoute={() => navigation.navigate('Home')}
            />
          ))
        ) : (
          <View style={styles.noResults}>
            <Ionicons name="search-outline" size={28} color={Colors.teal} />
            <Text style={styles.noResultsTitle}>No Matching Routes</Text>
            <Text style={styles.noResultsSub}>
              Try broader search.{'\n'}
              Suggested: remove filters or search by area (Downtown/Uptown).
            </Text>
          </View>
        )}

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Data available offline; last Sync:{' '}
            <Text style={styles.footerBold}>Aug 2025</Text>
            {'\n'}Schedules based on LTFRB data and field verification.
            {'\n'}No real-time tracking.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}