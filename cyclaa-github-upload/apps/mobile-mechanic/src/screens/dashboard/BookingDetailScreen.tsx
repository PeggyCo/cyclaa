import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import Card from '@components/Card';
import Button from '@components/Button';
import { useBookingRequests } from '@api/queries/useBookingRequests';
import { COLORS, SPACING, TYPOGRAPHY } from '@constants/index';

export default function BookingDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const requestId: string = route.params?.requestId;
  const queryClient = useQueryClient();
  const { data: requests } = useBookingRequests();
  const [submitting, setSubmitting] = useState<'accept' | 'decline' | null>(null);

  const request = requests?.find((r) => r.id === requestId);

  const respond = async (decision: 'accept' | 'decline') => {
    setSubmitting(decision);
    try {
      // PATCH /bookings/:id/status isn't built on the backend yet — this
      // is wired for when it lands.
      await new Promise((resolve) => setTimeout(resolve, 500));
      queryClient.invalidateQueries({ queryKey: ['bookingRequests'] });
      Alert.alert(
        decision === 'accept' ? 'Request accepted' : 'Request declined',
        undefined,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } finally {
      setSubmitting(null);
    }
  };

  if (!request) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.meta}>Request not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{request.serviceType}</Text>
        <Text style={styles.subtitle}>{request.riderName}</Text>

        <Card style={{ marginTop: SPACING.lg }}>
          <Text style={styles.rowLabel}>When</Text>
          <Text style={styles.rowValue}>{request.requestedFor}</Text>

          <Text style={[styles.rowLabel, { marginTop: SPACING.md }]}>Where</Text>
          <Text style={styles.rowValue}>{request.address}</Text>

          {!!request.notes && (
            <>
              <Text style={[styles.rowLabel, { marginTop: SPACING.md }]}>Notes</Text>
              <Text style={styles.rowValue}>{request.notes}</Text>
            </>
          )}

          <Text style={[styles.rowLabel, { marginTop: SPACING.md }]}>Price</Text>
          <Text style={styles.price}>${request.price}</Text>
        </Card>

        {request.status === 'pending' && (
          <View style={styles.actions}>
            <Button
              label="Accept"
              onPress={() => respond('accept')}
              loading={submitting === 'accept'}
              disabled={submitting !== null}
            />
            <Button
              label="Decline"
              variant="danger"
              style={{ marginTop: SPACING.md }}
              onPress={() => respond('decline')}
              loading={submitting === 'decline'}
              disabled={submitting !== null}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.neutral[50] },
  content: { padding: SPACING.xl },
  title: { ...TYPOGRAPHY.headingLg, color: COLORS.neutral[900] },
  subtitle: { ...TYPOGRAPHY.bodyMd, color: COLORS.neutral[700], marginTop: SPACING.xs },
  rowLabel: { ...TYPOGRAPHY.bodySm, color: COLORS.neutral[500] },
  rowValue: { ...TYPOGRAPHY.bodyMd, color: COLORS.neutral[900], marginTop: 2 },
  price: { ...TYPOGRAPHY.headingMd, color: COLORS.brand.accent, marginTop: 2 },
  actions: { marginTop: SPACING.xl },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  meta: { ...TYPOGRAPHY.bodyMd, color: COLORS.neutral[700] },
});
