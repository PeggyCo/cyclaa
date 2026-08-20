import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Card from '@components/Card';
import Button from '@components/Button';
import { useBookingRequests, useRespondToBooking } from '@api/queries/useBookingRequests';
import { COLORS, SPACING, TYPOGRAPHY } from '@constants/index';

const ACTION_LABEL: Record<string, string> = {
  accept: 'Request accepted',
  decline: 'Request declined',
  start: 'Marked as in progress',
  complete: 'Job marked complete',
};

export default function BookingDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const requestId: string = route.params?.requestId;
  const { data: requests } = useBookingRequests();
  const respondMutation = useRespondToBooking();
  const [submitting, setSubmitting] = useState<'accept' | 'decline' | 'start' | 'complete' | null>(null);

  const request = requests?.find((r) => r.id === requestId);

  const respond = async (action: 'accept' | 'decline' | 'start' | 'complete') => {
    setSubmitting(action);
    try {
      await respondMutation.mutateAsync({ id: requestId, action });
      Alert.alert(ACTION_LABEL[action], undefined, [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (err: any) {
      Alert.alert('Something went wrong', err?.response?.data?.error || 'Please try again.');
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

        {request.status === 'confirmed' && (
          <View style={styles.actions}>
            <Button
              label="Start job"
              onPress={() => respond('start')}
              loading={submitting === 'start'}
              disabled={submitting !== null}
            />
          </View>
        )}

        {request.status === 'in_progress' && (
          <View style={styles.actions}>
            <Button
              label="Mark complete"
              onPress={() => respond('complete')}
              loading={submitting === 'complete'}
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
