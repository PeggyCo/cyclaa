import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Card from '@components/Card';
import Button from '@components/Button';
import { useAuthStore } from '@store/authStore';
import { COLORS, SPACING, TYPOGRAPHY } from '@constants/index';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const user = useAuthStore((s) => s.user);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.greeting}>Hey {user?.firstName || 'there'} 👋</Text>
        <Text style={styles.subtitle}>Need a hand with your bike?</Text>

        <Card style={{ marginTop: SPACING.xl }}>
          <Text style={styles.cardTitle}>Book a mechanic</Text>
          <Text style={styles.cardBody}>
            Same-day mobile service from verified mechanics near you.
          </Text>
          <Button
            label="Find a mechanic"
            style={{ marginTop: SPACING.lg }}
            onPress={() => navigation.navigate('Mechanics')}
          />
        </Card>

        <Card style={{ marginTop: SPACING.lg }}>
          <Text style={styles.cardTitle}>Your bookings</Text>
          <Text style={styles.cardBody}>Track upcoming and past service appointments.</Text>
          <Button
            label="View bookings"
            variant="secondary"
            style={{ marginTop: SPACING.lg }}
            onPress={() => navigation.navigate('Bookings')}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.neutral[50] },
  content: { padding: SPACING.xl },
  greeting: { ...TYPOGRAPHY.headingLg, color: COLORS.neutral[900] },
  subtitle: { ...TYPOGRAPHY.bodyMd, color: COLORS.neutral[700], marginTop: SPACING.xs },
  cardTitle: { ...TYPOGRAPHY.headingMd, color: COLORS.neutral[900] },
  cardBody: { ...TYPOGRAPHY.bodyMd, color: COLORS.neutral[700], marginTop: SPACING.xs },
});
