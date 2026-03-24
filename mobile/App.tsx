import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from './src/styles/theme';
import type { RootStackParamList, TabParamList } from './src/types/navigation';

import SplashScreen     from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen       from './src/screens/HomeScreen';
import MapScreen        from './src/screens/MapScreen';
import SchedulesScreen  from './src/screens/SchedulesScreen';
import ProfileScreen    from './src/screens/ProfileScreen';

// ─── Navigators ───────────────────────────────────────────────────────────────

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab   = createBottomTabNavigator<TabParamList>();

// ─── Tab Config ───────────────────────────────────────────────────────────────

const TABS: {
  name:       keyof TabParamList;
  label:      string;
  icon:       keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
}[] = [
  { name: 'Home',      label: 'Home',      icon: 'home-outline',     iconActive: 'home'     },
  { name: 'Maps',      label: 'Routes',    icon: 'map-outline',      iconActive: 'map'      },
  { name: 'Schedules', label: 'Timetable', icon: 'calendar-outline', iconActive: 'calendar' },
  { name: 'Profile',   label: 'Account',   icon: 'person-outline',   iconActive: 'person'   },
];

// ─── Custom Tab Bar ───────────────────────────────────────────────────────────

function CustomTabBar({ state, navigation }: any) {
  return (
    <View style={styles.tabBar}>
      {TABS.map((tab, index) => {
        const isActive = state.index === index;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabItem}
            onPress={() => navigation.navigate(tab.name)}
            activeOpacity={0.7}
          >
            {isActive && <View style={styles.activePill} />}
            <Ionicons
              name={isActive ? tab.iconActive : tab.icon}
              size={26}
              color={isActive ? Colors.teal : Colors.slateLight}
            />
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Tab Navigator ────────────────────────────────────────────────────────────

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home"      component={HomeScreen}      />
      <Tab.Screen name="Maps"      component={MapScreen}       />
      <Tab.Screen name="Schedules" component={SchedulesScreen} />
      <Tab.Screen name="Profile"   component={ProfileScreen}   />
    </Tab.Navigator>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{ headerShown: false, gestureEnabled: false }}
        >
          <Stack.Screen name="Splash"     component={SplashScreen}     />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Main"       component={MainTabs}         />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  tabBar: {
    flexDirection:   'row',
    backgroundColor: Colors.bgWhite,
    borderTopWidth:  1,
    borderTopColor:  Colors.border,
    paddingBottom:   Platform.OS === 'ios' ? 28 : 14,
    paddingTop:      12,
    shadowColor:     '#0F172A',
    shadowOffset:    { width: 0, height: -4 },
    shadowOpacity:   0.09,
    shadowRadius:    12,
    elevation:       16,
  },
  tabItem: {
    flex:            1,
    alignItems:      'center',
    justifyContent:  'center',
    gap:             5,
    position:        'relative',
    paddingTop:      4,
  },
  activePill: {
    position:        'absolute',
    top:             -12,
    width:           36,
    height:          4,
    borderRadius:    2,
    backgroundColor: Colors.teal,
  },
  tabLabel: {
    fontSize:   12,
    color:      Colors.slateLight,
    fontWeight: '500',
  },
  tabLabelActive: {
    color:      Colors.teal,
    fontWeight: '700',
  },
});