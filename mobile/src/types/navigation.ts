import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps } from '@react-navigation/native';

// ─── Stack Navigator ───────────────────────────────────────────────────────────

export type RootStackParamList = {
  Splash:      undefined;
  Onboarding:  undefined;
  Main:        undefined;
};

// ─── Tab Navigator ─────────────────────────────────────────────────────────────

export type TabParamList = {
  Home:      undefined;
  Maps:      undefined;
  Schedules: undefined;
  Profile:   undefined;
};

// ─── Typed Screen Props ────────────────────────────────────────────────────────

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

// ─── Global nav typing ─────────────────────────────────────────────────────────

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}