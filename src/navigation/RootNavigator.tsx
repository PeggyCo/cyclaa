import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import WelcomeScreen from '@screens/auth/WelcomeScreen';
import LoginScreen from '@screens/auth/LoginScreen';
import SignupScreen from '@screens/auth/SignupScreen';
import BookingRequestScreen from '@screens/booking/BookingRequestScreen';
import { useAuthStore } from '@store/authStore';
import { COLORS } from '@constants/index';

const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen
        name="BookingRequest"
        component={BookingRequestScreen}
        options={{ headerShown: true, title: 'Request service' }}
      />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { isAuthenticated, isInitializing } = useAuthStore();

  if (isInitializing) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={COLORS.brand.accent} />
      </View>
    );
  }

  return <NavigationContainer>{isAuthenticated ? <MainStack /> : <AuthStack />}</NavigationContainer>;
}
