import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Card from '@components/Card';
import { useBookingRequests } from '@api/queries/useBookingRequests';
import type { BookingRequest } from '@/types';
import { COLORS, SPACING, TYPOGRAPHY } from '@constants/index';

const STATUS_LABEL: Record<BookingRequest['status'], string> = {
  pending: 'New request',
  confirmed: 'Confirmed',
  en_route: 'En route',
  in_progress: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const STATUS_COLOR: Record<BookingRequest['status'], string> = {
  pending: COLORS.semantic.warning,
  confirmed: COLORS.semantic.info,
  en_route: COLORS.semantic.info,
  in_progress: COLORS.semantic.info,
  completed: COLORS.semantic.success,
  cancelled: COLORS.semantic.error,
};

function RequestCard({ request, onPress }: { request: BookingRequest; onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.riderName}>{request.riderName}</Text>
          <Text style={[styles.status, { color: STATUS_COLOR[request.status] }]}>
            {STATUS_LABEL[request.status]}
          </Text>
        </View>
        <Text style={styles.service}>{request.serviceType}</Text>
        <Text style={styles.meta}>{request.requestedFor} · {request.address}</Text>
        <Text style={styles.price}>${request.price}</Text>
      </Card>
    </Pressable>
  );
}

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const { data: requests, isLoading, isError } = useBookingRequests();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Booking requests</Text>
      </View>

      {isLoading && (
        <View style={styles.centered}>
          <ActivityIndicator color={COLORS.brand.accent} />
        </View>
      )}

      {isError && (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Couldn't load requests. Pull to refresh.</Text>
        </View>
      )}

      {!isLoading && !isError && requests?.length === 0 && (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No requests right now.</Text>
        </View>
      )}

      {!isLoading && !isError && !!requests?.length && (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <RequestCard
              request={item}
              onPress={() => navigation.navigate('BookingDetail', { requestId: item.id })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.neutral[50] },
  header: { padding: SPACING.xl, paddingBottom: SPACING.md },
  title: { ...TYPOGRAPHY.headingLg, color: COLORS.neutral[900] },
  list: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xl },
  card: { marginBottom: SPACING.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  riderName: { ...TYPOGRAPHY.headingMd, color: COLORS.neutral[900] },
  status: { ...TYPOGRAPHY.labelLg },
  service: { ...TYPOGRAPHY.bodyMd, color: COLORS.neutral[900], marginTop: SPACING.xs },
  meta: { ...TYPOGRAPHY.bodySm, color: COLORS.neutral[700], marginTop: SPACING.xs },
  price: { ...TYPOGRAPHY.labelLg, color: COLORS.brand.accent, marginTop: SPACING.sm },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { ...TYPOGRAPHY.bodyMd, color: COLORS.semantic.error },
  emptyText: { ...TYPOGRAPHY.bodyMd, color: COLORS.neutral[700] },
});
