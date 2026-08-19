import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import HomeScreen from '@screens/shared/HomeScreen';
import MechanicSearchScreen from '@screens/mechanics/MechanicSearchScreen';
import BookingsListScreen from '@screens/booking/BookingsListScreen';
import ProfileScreen from '@screens/profile/ProfileScreen';
import { COLORS } from '@constants/index';

const Tab = createBottomTabNavigator();

const ICONS: Record<string, string> = {
  Home: '🏠',
  Mechanics: '🔧',
  Bookings: '📅',
  Profile: '👤',
};

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.brand.accent,
        tabBarInactiveTintColor: COLORS.neutral[500],
        tabBarIcon: () => <Text style={{ fontSize: 20 }}>{ICONS[route.name]}</Text>,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Mechanics" component={MechanicSearchScreen} />
      <Tab.Screen name="Bookings" component={BookingsListScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
