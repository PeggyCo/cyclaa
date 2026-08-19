import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Card from '@components/Card';
import { COLORS, SPACING, TYPOGRAPHY } from '@constants/index';

export default function BookingsListScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your bookings</Text>
      </View>
      <View style={styles.content}>
        <Card>
          <Text style={styles.emptyTitle}>No bookings yet</Text>
          <Text style={styles.emptyBody}>
            Once the backend's booking endpoints are built, confirmed and past appointments will
            show up here.
          </Text>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.neutral[50] },
  header: { padding: SPACING.xl, paddingBottom: SPACING.md },
  title: { ...TYPOGRAPHY.headingLg, color: COLORS.neutral[900] },
  content: { padding: SPACING.xl, paddingTop: 0 },
  emptyTitle: { ...TYPOGRAPHY.headingMd, color: COLORS.neutral[900] },
  emptyBody: { ...TYPOGRAPHY.bodyMd, color: COLORS.neutral[700], marginTop: SPACING.xs },
});
