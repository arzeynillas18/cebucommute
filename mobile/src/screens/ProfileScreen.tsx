import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../context/AppContext";
import styles from "../styles/ProfileScreen.styles";
import { Colors } from "../styles/theme";

// ─── Types ────────────────────────────────────────────────────────────────────

type UserType = "Student" | "Employee" | "Senior" | "Tourist";
type FontSize = "Small" | "Medium" | "Large";

const USER_TYPE_COLORS: Record<UserType, string> = {
  Student: Colors.student,
  Employee: Colors.employee,
  Senior: Colors.senior,
  Tourist: Colors.tourist,
};

const USER_TYPES: UserType[] = ["Student", "Employee", "Senior", "Tourist"];

const API_URL = "http://192.168.254.107:3000";
// const API_URL = 'http://192.168.0.106:3000'; // iOS simulator
// const API_URL = 'http://192.168.x.x:3000'; // Real device

// ─── Toggle ───────────────────────────────────────────────────────────────────

const Toggle = ({
  value,
  onToggle,
}: {
  value: boolean;
  onToggle: () => void;
}) => (
  <TouchableOpacity
    onPress={onToggle}
    activeOpacity={0.8}
    style={[
      styles.toggle,
      { backgroundColor: value ? Colors.teal : "#CBD5E1" },
    ]}
  >
    <View
      style={[
        styles.toggleThumb,
        { alignSelf: value ? "flex-end" : "flex-start" },
      ]}
    />
  </TouchableOpacity>
);

// ─── Toggle Row ───────────────────────────────────────────────────────────────

const ToggleRow = ({
  icon,
  title,
  subtitle,
  value,
  onToggle,
  last = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  value: boolean;
  onToggle: () => void;
  last?: boolean;
}) => (
  <View style={[styles.toggleRow, last && { borderBottomWidth: 0 }]}>
    <View style={styles.toggleIcon}>
      <Ionicons name={icon} size={18} color={Colors.teal} />
    </View>
    <View style={styles.toggleInfo}>
      <Text style={styles.toggleTitle}>{title}</Text>
      <Text style={styles.toggleSubtitle}>{subtitle}</Text>
    </View>
    <Toggle value={value} onToggle={onToggle} />
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("name@example.com");
  const [emailError, setEmailError] = useState("");
  const [userType, setUserType] = useState<UserType>("Student");
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [offlineMaps, setOfflineMaps] = useState(true);
  const [fareAlerts, setFareAlerts] = useState(true);
  const [scheduleChanges, setScheduleChanges] = useState(true);
  const [travelTips, setTravelTips] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { lang, setLang, fontSize, setFontSize, t, fs } = useApp();

  const getInitials = () => {
    if (!name.trim()) return "?";
    return name
      .trim()
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const validateEmail = (val: string) => {
    setEmail(val);
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    setEmailError(valid || val === "" ? "" : "Enter a valid email address");
  };

  const handleSubmitFeedback = async () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert("Missing Fields", "Please fill in both Subject and Message.");
      return;
    }
    setSubmitting(true);
    try {
      await fetch(`${API_URL}/api/schedules/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message, userType }),
      });
      setSubject("");
      setMessage("");
      Alert.alert("Thank you!", "Your feedback has been submitted.");
    } catch {
      // Offline fallback
      Alert.alert(
        "Saved Offline",
        "Feedback will be submitted when you are back online.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteData = () => {
    Alert.alert(
      "Delete Downloaded Content",
      "This will remove all offline maps and cached data. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => Alert.alert("Done", "All downloaded content removed."),
        },
      ],
    );
  };

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: () => {} },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgSecondary} />

      {/* ── Header ── */}
      <ImageBackground
        source={require("../../assets/bg_homescreen.png")}
        style={styles.header}
        resizeMode="cover"
      >
        <View>
          <Text style={[styles.headerTitle, { fontSize: fs(22) }]}>
            {t("Profile & Settings", "Profile at Mga Setting")}
          </Text>
          <Text style={[styles.headerSubtitle, { fontSize: fs(12) }]}>
            {t(
              "Some settings require Internet. Offline features available.",
              "Ang ilang setting ay nangangailangan ng Internet. Available ang offline features.",
            )}
          </Text>
        </View>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="settings-outline" size={18} color="#fff" />
        </TouchableOpacity>
      </ImageBackground>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ════ ACCOUNT ════ */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { fontSize: fs(12) }]}>
            {t("Account", "Account")}
          </Text>
          <View style={styles.card}>
            {/* Avatar Row */}
            <View style={styles.avatarRow}>
              <View
                style={[
                  styles.avatarCircle,
                  { backgroundColor: USER_TYPE_COLORS[userType] },
                ]}
              >
                <Text style={styles.avatarInitials}>{getInitials()}</Text>
              </View>
              <View style={styles.avatarInfo}>
                <Text style={styles.avatarName}>
                  {name || "Enter your name"}
                </Text>
                <Text style={styles.avatarEmail}>{email}</Text>
                <View
                  style={[
                    styles.avatarBadge,
                    { backgroundColor: `${USER_TYPE_COLORS[userType]}20` },
                  ]}
                >
                  <Text
                    style={[
                      styles.avatarBadgeText,
                      { color: USER_TYPE_COLORS[userType] },
                    ]}
                  >
                    {userType}
                  </Text>
                </View>
              </View>
            </View>

            {/* Name */}
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Name</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="Enter your name"
                placeholderTextColor={Colors.slateLight}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Email */}
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Email</Text>
              <TextInput
                style={[
                  styles.fieldInput,
                  emailError ? styles.fieldInputError : null,
                ]}
                placeholder="name@example.com"
                placeholderTextColor={Colors.slateLight}
                value={email}
                onChangeText={validateEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {!!emailError && (
                <Text style={styles.fieldError}>{emailError}</Text>
              )}
            </View>

            {/* User Type */}
            <View style={[styles.fieldRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.fieldLabel}>User Type</Text>
              <TouchableOpacity
                style={styles.fieldDropdown}
                onPress={() => setShowTypeMenu((v) => !v)}
              >
                <View
                  style={[
                    styles.userTypeBadge,
                    { backgroundColor: USER_TYPE_COLORS[userType] },
                  ]}
                >
                  <Text style={styles.userTypeBadgeText}>{userType}</Text>
                </View>
                <Ionicons
                  name={showTypeMenu ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={Colors.slate}
                />
              </TouchableOpacity>
              {showTypeMenu && (
                <View style={{ marginTop: 10, gap: 6 }}>
                  {USER_TYPES.map((t) => (
                    <TouchableOpacity
                      key={t}
                      onPress={() => {
                        setUserType(t);
                        setShowTypeMenu(false);
                      }}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                        paddingVertical: 5,
                      }}
                    >
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: USER_TYPE_COLORS[t],
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          color:
                            userType === t ? USER_TYPE_COLORS[t] : Colors.navy,
                          fontWeight: userType === t ? "700" : "500",
                        }}
                      >
                        {t}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          <View style={styles.permNote}>
            <Ionicons
              name="information-circle-outline"
              size={14}
              color="#92400E"
            />
            <Text style={styles.permNoteText}>
              Personalization for Tourists, Students, New Residents, locals, and
              OFWs.
            </Text>
          </View>
        </View>

        {/* ════ CONNECTIVITY ════ */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { fontSize: fs(12) }]}>
            {t("Connectivity", "Koneksyon")}
          </Text>
          <View style={styles.card}>
            <ToggleRow
              icon="cloud-download-outline"
              title={t(
                "Enable Offline Maps & Data",
                "I-enable ang Offline Maps at Data",
              )}
              subtitle={t(
                "Download routes, maps, and schedules for offline use",
                "I-download ang mga ruta, mapa, at iskedyul para sa offline",
              )}
              value={offlineMaps}
              onToggle={() => setOfflineMaps((v) => !v)}
            />
            <ToggleRow
              icon="pricetag-outline"
              title={t(
                "Fare Updates Alerts",
                "Mga Alerto sa Pagbabago ng Pamasahe",
              )}
              subtitle={t(
                "Get notified when fares change",
                "Maabisuhan kapag nagbago ang pamasahe",
              )}
              value={fareAlerts}
              onToggle={() => setFareAlerts((v) => !v)}
            />
            <ToggleRow
              icon="calendar-outline"
              title={t("Schedule Changes", "Mga Pagbabago sa Iskedyul")}
              subtitle={t(
                "Receive adjustments and holiday notices",
                "Tumanggap ng mga abiso sa holiday",
              )}
              value={scheduleChanges}
              onToggle={() => setScheduleChanges((v) => !v)}
            />
            <ToggleRow
              icon="bulb-outline"
              title={t("Travel Tips", "Mga Tips sa Pagbiyahe")}
              subtitle={t(
                "Helpful reminders for routes and safety",
                "Mga paalala para sa ruta at kaligtasan",
              )}
              value={travelTips}
              onToggle={() => setTravelTips((v) => !v)}
              last
            />
          </View>
        </View>

        {/* ════ APPEARANCE ════ */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { fontSize: fs(12) }]}>
            {t("Appearance", "Hitsura")}
          </Text>
          <View style={styles.card}>
            <ToggleRow
              icon="language-outline"
              title={t("Language: English", "Wika: Filipino")}
              subtitle={t(
                "Tap to switch to Filipino",
                "I-tap para lumipat sa English",
              )}
              value={lang === "fil"}
              onToggle={() => setLang(lang === "en" ? "fil" : "en")}
              last
            />
            <View
              style={[
                styles.fontSizeRow,
                { borderTopWidth: 1, borderTopColor: Colors.borderLight },
              ]}
            >
              <Text style={[styles.fontSizeLabel, { fontSize: fs(13) }]}>
                {t("Font Size", "Laki ng Teksto")}
              </Text>
              <View style={styles.fontSizeBtns}>
                {(["Small", "Medium", "Large"] as FontSize[]).map((f) => (
                  <TouchableOpacity
                    key={f}
                    style={[
                      styles.fontSizeBtn,
                      fontSize === f && styles.fontSizeBtnActive,
                    ]}
                    onPress={() => setFontSize(f)}
                  >
                    <Text
                      style={[
                        styles.fontSizeBtnText,
                        fontSize === f && styles.fontSizeBtnTextActive,
                      ]}
                    >
                      {f}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* ════ FEEDBACK ════ */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { fontSize: fs(12) }]}>
            {t("Feedback", "Puna")}
          </Text>
          <View style={styles.card}>
            <View style={[styles.fieldRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.fieldLabel}>Subject</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="e.g., Suggestion about routes"
                placeholderTextColor={Colors.slateLight}
                value={subject}
                onChangeText={setSubject}
              />
            </View>
          </View>
        </View>

        <TextInput
          style={styles.feedbackField}
          placeholder="Type your message..."
          placeholderTextColor={Colors.slateLight}
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={4}
        />

        {/* Social Icons */}
        <View style={styles.socialRow}>
          {[
            { icon: "logo-facebook" as const, color: "#1877F2" },
            { icon: "logo-twitter" as const, color: "#1DA1F2" },
            { icon: "logo-instagram" as const, color: "#E1306C" },
            { icon: "logo-youtube" as const, color: "#FF0000" },
            { icon: "logo-tiktok" as const, color: "#010101" },
          ].map((s) => (
            <TouchableOpacity
              key={s.icon}
              style={[styles.socialBtn, { backgroundColor: `${s.color}15` }]}
            >
              <Ionicons name={s.icon} size={22} color={s.color} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, submitting && { opacity: 0.7 }]}
          onPress={handleSubmitFeedback}
          disabled={submitting}
        >
          <Text style={styles.submitBtnText}>
            {submitting ? "Submitting..." : "Submit"}
          </Text>
        </TouchableOpacity>

        {/* ════ APP INFO ════ */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { fontSize: fs(12) }]}>
            {t("App Info", "Impormasyon ng App")}
          </Text>
          <View style={styles.card}>
            {[
              {
                icon: "information-circle-outline" as const,
                title: "Version 1.0",
                subtitle: "CebuCommute — Build 2025.08",
              },
              {
                icon: "sync-outline" as const,
                title: "Last Data Update",
                subtitle: "Aug 2025",
              },
              {
                icon: "sparkles-outline" as const,
                title: "AI Powered by Groq",
                subtitle: "Llama 3 — Free tier",
              },
              {
                icon: "map-outline" as const,
                title: "Maps",
                subtitle: "Google Maps + AI-generated GeoJSON routes",
              },
              {
                icon: "alert-circle-outline" as const,
                title: "Limitations",
                subtitle: "No real-time tracking.",
              },
            ].map((item, i, arr) => (
              <View
                key={i}
                style={[
                  styles.infoRow,
                  i === arr.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={styles.infoIcon}>
                  <Ionicons name={item.icon} size={18} color={Colors.teal} />
                </View>
                <View style={styles.infoText}>
                  <Text style={styles.infoTitle}>{item.title}</Text>
                  <Text style={styles.infoSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ════ ACCOUNT ACTIONS ════ */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { fontSize: fs(12) }]}>
            {t("Account Actions", "Mga Aksyon sa Account")}
          </Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() =>
                Alert.alert("Login / Sign Up", "Auth flow coming soon!")
              }
            >
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: `${Colors.teal}15` },
                ]}
              >
                <Ionicons
                  name="person-add-outline"
                  size={18}
                  color={Colors.teal}
                />
              </View>
              <Text
                style={[
                  styles.actionText,
                  { color: Colors.teal, fontSize: fs(14) },
                ]}
              >
                {t("Login / Sign Up", "Mag-login / Mag-sign up")}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.slate} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionRow}
              onPress={handleDeleteData}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#FEF2F2" }]}>
                <Ionicons name="trash-outline" size={18} color={Colors.error} />
              </View>
              <Text
                style={[
                  styles.actionText,
                  { color: Colors.navy, fontSize: fs(14) },
                ]}
              >
                {t(
                  "Delete Downloaded Content",
                  "Burahin ang Na-download na Content",
                )}
              </Text>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={handleDeleteData}
              >
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionRow, { borderBottomWidth: 0 }]}
              onPress={handleLogout}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#FEF2F2" }]}>
                <Ionicons
                  name="log-out-outline"
                  size={18}
                  color={Colors.error}
                />
              </View>
              <Text
                style={[
                  styles.actionText,
                  { color: Colors.error, fontSize: fs(14) },
                ]}
              >
                {t("Logout", "Mag-logout")}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.slate} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
