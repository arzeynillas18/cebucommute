import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { Colors, FontSize, Spacing } from "../styles/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding">;

const { width, height } = Dimensions.get("window");

const PAGES = [
  {
    id: 1,
    title: "Navigate Cebu with Ease",
    subtitle:
      "Find jeepney routes, check schedules and download maps for offline use.",
    image: require("../../assets/onboard1.gif"),
    button: "Get Started",
  },
  {
    id: 2,
    title: "AI-Powered Route Suggestions",
    subtitle:
      "Our AI finds the best jeepney route for you based on where you are right now.",
    image: require("../../assets/onboard2.gif"),
    button: "Next",
  },
  {
    id: 3,
    title: "You're All Set!",
    subtitle: "Download routes for offline trips. No internet? No problem.",
    image: require("../../assets/onboard3.gif"),
    button: "Start your Journey",
  },
];

export default function OnboardingScreen({ navigation }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < PAGES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace("Main");
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const page = PAGES[currentIndex];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.page}>
          {/* Image */}
          <View style={styles.imageWrap}>
            <Image
              source={page.image}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          {/* Text */}
          <View style={styles.textWrap}>
            <Text style={styles.title}>{page.title}</Text>
            <Text style={styles.subtitle}>{page.subtitle}</Text>
          </View>

          {/* Dots */}
          <View style={styles.dots}>
            {PAGES.map((p) => (
              <View
                key={p.id}
                style={[
                  styles.dot,
                  p.id - 1 === currentIndex
                    ? styles.dotActive
                    : styles.dotInactive,
                ]}
              />
            ))}
          </View>

          {/* Buttons */}
          <View style={styles.btnRow}>
            {currentIndex > 0 && (
              <TouchableOpacity
                style={styles.btnSecondary}
                onPress={handlePrev}
              >
                <Text style={styles.btnSecondaryText}>Previous</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.btnPrimary} onPress={handleNext}>
              <Text style={styles.btnPrimaryText}>{page.button}</Text>
            </TouchableOpacity>
          </View>

          {/* Skip */}
          {currentIndex < PAGES.length - 1 && (
            <TouchableOpacity onPress={() => navigation.replace("Main")}>
              <Text style={styles.skip}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#E8F6F5" },
  scroll: { flexGrow: 1 },
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    minHeight: height * 0.85,
  },

  imageWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    maxHeight: height * 0.35,
  },
  image: {
    width: width * 0.75,
    height: height * 0.28,
    maxWidth: 280,
    maxHeight: 260,
  },

  textWrap: {
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
  },
  title: {
    fontSize: FontSize["3xl"],
    fontWeight: "800",
    color: Colors.navy,
    textAlign: "center",
    marginBottom: Spacing.md,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: FontSize.lg,
    color: Colors.slate,
    textAlign: "center",
    lineHeight: 24,
  },

  dots: {
    flexDirection: "row",
    marginBottom: Spacing["2xl"],
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  dotActive: { backgroundColor: Colors.teal },
  dotInactive: { backgroundColor: "#E5E7EB" },

  btnRow: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: Colors.teal,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  btnPrimaryText: {
    color: "#fff",
    fontSize: FontSize.lg,
    fontWeight: "700",
  },
  btnSecondary: {
    flex: 1,
    borderWidth: 2,
    borderColor: Colors.teal,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  btnSecondaryText: {
    color: Colors.teal,
    fontSize: FontSize.lg,
    fontWeight: "600",
  },

  skip: {
    color: Colors.slate,
    fontSize: FontSize.md,
    fontWeight: "500",
    paddingVertical: 10,
  },
});
