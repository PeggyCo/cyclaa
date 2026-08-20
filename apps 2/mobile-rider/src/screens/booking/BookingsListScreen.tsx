import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import Card from '@components/Card';
import { useBookings } from '@api/queries/useBookings';
import type { Booking } from '@/types';
import { COLORS, SPACING, TYPOGRAPHY } from '@constants/index';

const STATUS_LABEL: Record<Booking['status'], string> = {
  pending: 'Awaiting confirmation',
  confirmed: 'Confirmed',
  en_route: 'Mechanic en route',
  in_progress: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const STATUS_COLOR: Record<Booking['status'], string> = {
  pending: COLORS.semantic.warning,
  confirmed: COLORS.semantic.info,
  en_route: COLORS.semantic.info,
  in_progress: COLORS.semantic.info,
  completed: COLORS.semantic.success,
  cancelled: COLORS.semantic.error,
};

function BookingCard({ booking }: { booking: Booking }) {
  const when = new Date(booking.scheduledFor);
  const whenLabel = Number.isNaN(when.getTime())
    ? booking.scheduledFor
    : when.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

  return (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.service}>{booking.serviceType}</Text>
        <Text style={[styles.status, { color: STATUS_COLOR[booking.status] }]}>
          {STATUS_LABEL[booking.status]}
        </Text>
      </View>
      <Text style={styles.meta}>
        {booking.mechanicName} · {whenLabel}
      </Text>
      {booking.price != null && <Text style={styles.price}>${booking.price}</Text>}
    </Card>
  );
}

export default function BookingsListScreen() {
  const { data: bookings, isLoading, isError } = useBookings();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your bookings</Text>
      </View>

      {isLoading && (
        <View style={styles.centered}>
          <ActivityIndicator color={COLORS.brand.accent} />
        </View>
      )}

      {isError && (
        <View style={styles.content}>
          <Card>
            <Text style={styles.errorText}>Couldn't load bookings. Pull to refresh.</Text>
          </Card>
        </View>
      )}

      {!isLoading && !isError && bookings?.length === 0 && (
        <View style={styles.content}>
          <Card>
            <Text style={styles.emptyTitle}>No bookings yet</Text>
            <Text style={styles.emptyBody}>Find a mechanic to request your first service.</Text>
          </Card>
        </View>
      )}

      {!isLoading && !isError && !!bookings?.length && (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <BookingCard booking={item} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.neutral[50] },
  header: { padding: SPACING.xl, paddingBottom: SPACING.md },
  title: { ...TYPOGRAPHY.headingLg, color: COLORS.neutral[900] },
  content: { padding: SPACING.xl, paddingTop: 0 },
  list: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xl },
  card: { marginBottom: SPACING.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  service: { ...TYPOGRAPHY.headingMd, color: COLORS.neutral[900] },
  status: { ...TYPOGRAPHY.labelLg },
  meta: { ...TYPOGRAPHY.bodySm, color: COLORS.neutral[700], marginTop: SPACING.xs },
  price: { ...TYPOGRAPHY.labelLg, color: COLORS.brand.accent, marginTop: SPACING.sm },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { ...TYPOGRAPHY.headingMd, color: COLORS.neutral[900] },
  emptyBody: { ...TYPOGRAPHY.bodyMd, color: COLORS.neutral[700], marginTop: SPACING.xs },
  errorText: { ...TYPOGRAPHY.bodyMd, color: COLORS.semantic.error },
});
