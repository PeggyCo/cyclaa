import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import DashboardScreen from '@screens/dashboard/DashboardScreen';
import ProfileScreen from '@screens/profile/ProfileScreen';
import { COLORS } from '@constants/index';

const Tab = createBottomTabNavigator();

const ICONS: Record<string, string> = {
  Dashboard: '🔧',
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
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
