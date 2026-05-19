import React, { useState, useMemo } from "react";
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
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useApp } from "../context/AppContext";
import styles from "../styles/SchedulesScreen.styles";
import { Colors } from "../styles/theme";
import { JEEPNEY_ROUTES, JeepneyRoute } from "../constants/routes";
import type { TabParamList } from "../types/navigation";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type NavProp = BottomTabNavigationProp<TabParamList>;
type AreaFilter = "All" | "Downtown" | "Uptown";
type SortMode = "code" | "name";

// ─── Schedule Card ────────────────────────────────────────────────────────────

const ScheduleCard = ({
  route,
  isOpen,
  onToggle,
  onViewMap,
  t,
  fs,
}: {
  route: JeepneyRoute;
  isOpen: boolean;
  onToggle: () => void;
  onViewMap: () => void;
  t: (en: string, fil: string) => string;
  fs: (base: number) => number;
}) => (
  <View style={[styles.scheduleCard, { borderLeftColor: route.color }]}>
    {/* Header */}
    <TouchableOpacity
      style={styles.cardHeader}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      <View style={[styles.cardBadge, { backgroundColor: route.color }]}>
        <Text style={styles.cardBadgeText}>{route.code}</Text>
      </View>
      <View style={styles.cardHeaderInfo}>
        <Text style={[styles.cardTitle, { fontSize: fs(14) }]}>
          {route.origin} → {route.dest}
        </Text>
        <Text style={[styles.cardHours, { fontSize: fs(12) }]}>
          ⏱ {t("Operating Hours", "Oras ng Operasyon")}: {route.hours}
        </Text>
      </View>
      <View style={styles.cardChevron}>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={16}
          color={Colors.teal}
        />
      </View>
    </TouchableOpacity>

    {/* Body */}
    {isOpen && (
      <View style={styles.cardBody}>
        <Text style={[styles.cardFrequency, { fontSize: fs(12) }]}>
          {t("Frequency", "Dalas")}: {route.frequency}
        </Text>

        {[
          `First Trip: ${route.firstTrip}`,
          `Last Trip: ${route.lastTrip}`,
          `Fare: ₱${route.fare}`,
          `Notes: ${route.notes}`,
        ].map((item, i) => (
          <View key={i} style={styles.bulletRow}>
            <View
              style={[styles.bulletDot, { backgroundColor: route.color }]}
            />
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}

        <Text style={styles.cardExpanded}>
          Expanded details: peak vs. Off-Peak, Holiday Adjustments, Transfer
          Point.
        </Text>

        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.cardActionBtn} onPress={onViewMap}>
            <Ionicons name="map-outline" size={16} color="#fff" />
            <Text style={[styles.cardActionText, { fontSize: fs(12) }]}>
              {t("View on Map", "Tingnan sa Mapa")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )}
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function SchedulesScreen() {
  const navigation = useNavigation<NavProp>();
  const { t, fs } = useApp();
  const [search, setSearch] = useState("");
  const [area, setArea] = useState<AreaFilter>("All");
  const [sort, setSort] = useState<SortMode>("code");
  const [openCards, setOpenCards] = useState<string[]>(["01B"]);

  const toggleCard = (code: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenCards((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  };

  const cycleArea = () => {
    const order: AreaFilter[] = ["All", "Downtown", "Uptown"];
    setArea(order[(order.indexOf(area) + 1) % order.length]);
  };

  const cycleSort = () =>
    setSort((prev) => (prev === "code" ? "name" : "code"));

  const filtered = useMemo(() => {
    let list = [...JEEPNEY_ROUTES];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.code.toLowerCase().includes(q) ||
          r.origin.toLowerCase().includes(q) ||
          r.dest.toLowerCase().includes(q),
      );
    }

    if (area !== "All") list = list.filter((r) => r.area === area);

    list.sort((a, b) =>
      sort === "code"
        ? a.code.localeCompare(b.code)
        : `${a.origin}${a.dest}`.localeCompare(`${b.origin}${b.dest}`),
    );

    return list;
  }, [search, area, sort]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgSecondary} />

      {/* ── Header ── */}
      <ImageBackground
        source={require("../../assets/bg_homescreen.png")}
        style={[styles.header, { paddingBottom: 24 }]}
        resizeMode="cover"
      >
        <View>
          <Text style={[styles.headerTitle, { fontSize: fs(22) }]}>
            {t("Jeepney Schedules", "Mga Iskedyul ng Dyipni")}
          </Text>
          <Text style={{ fontSize: fs(13), color: Colors.slate, marginTop: 2 }}>
            {t(
              "View routes and operating hours",
              "Tingnan ang mga ruta at oras ng operasyon",
            )}
          </Text>
        </View>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="options-outline" size={18} color={Colors.teal} />
        </TouchableOpacity>
      </ImageBackground>

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
              placeholder={t(
                "Search by Route Code (e.g., 01B)",
                "Maghanap ng Ruta (hal. 01B)",
              )}
              placeholderTextColor={Colors.slateLight}
              value={search}
              onChangeText={setSearch}
              autoCapitalize="characters"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={Colors.slateLight}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ── Filters ── */}
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterBtn} onPress={cycleSort}>
            <Ionicons name="swap-vertical-outline" size={14} color="#fff" />
            <Text style={[styles.filterBtnText, { fontSize: fs(12) }]}>
              {t("Sort", "Ayusin")}:{" "}
              {sort === "code"
                ? t("Route Code", "Kodigo")
                : t("Name", "Pangalan")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn} onPress={cycleArea}>
            <Ionicons name="location-outline" size={14} color="#fff" />
            <Text style={[styles.filterBtnText, { fontSize: fs(12) }]}>
              {t("Area", "Lugar")}: {area}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Schedule Cards ── */}
        {filtered.length > 0 ? (
          filtered.map((route) => (
            <ScheduleCard
              key={route.id}
              route={route}
              isOpen={openCards.includes(route.code)}
              onToggle={() => toggleCard(route.code)}
              onViewMap={() =>
                navigation.navigate("Maps", { routeCode: route.code })
              }
              t={t}
              fs={fs}
            />
          ))
        ) : (
          <View style={styles.noResults}>
            <Ionicons name="search-outline" size={28} color={Colors.teal} />
            <Text style={styles.noResultsTitle}>No Matching Routes</Text>
            <Text style={styles.noResultsSub}>
              Try broader search.{"\n"}
              Suggested: remove filters or search by area (Downtown/Uptown).
            </Text>
          </View>
        )}

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { fontSize: fs(11) }]}>
            {t(
              "Schedules are for reference only. Fares and hours may vary.\nVerify with drivers or LTFRB for current rates.\nData available offline · Last sync: ",
              "Ang mga iskedyul ay para sa sanggunian lamang. Maaaring mag-iba ang pamasahe at oras.\nI-verify sa mga driver o LTFRB.\nAvailable offline · Huling sync: ",
            )}
            <Text style={styles.footerBold}>Aug 2025</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
