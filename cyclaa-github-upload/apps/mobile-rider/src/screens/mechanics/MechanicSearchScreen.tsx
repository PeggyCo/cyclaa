import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Card from '@components/Card';
import Button from '@components/Button';
import { useMechanics } from '@api/queries/useMechanics';
import type { Mechanic } from '@/types';
import { COLORS, SPACING, TYPOGRAPHY } from '@constants/index';

function MechanicCard({ mechanic, onBook }: { mechanic: Mechanic; onBook: () => void }) {
  return (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{mechanic.displayName}</Text>
        <Text style={styles.rate}>${mechanic.hourlyRate}/hr</Text>
      </View>
      <Text style={styles.meta}>
        ★ {mechanic.rating.toFixed(1)} ({mechanic.reviewCount}) · {mechanic.distanceMiles} mi ·{' '}
        {mechanic.specialties.join(', ')}
      </Text>
      <Button
        label={mechanic.available ? 'Book' : 'Unavailable'}
        variant={mechanic.available ? 'primary' : 'tertiary'}
        disabled={!mechanic.available}
        style={{ marginTop: SPACING.md }}
        onPress={onBook}
      />
    </Card>
  );
}

export default function MechanicSearchScreen() {
  const navigation = useNavigation<any>();
  const { data: mechanics, isLoading, isError } = useMechanics();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find a mechanic</Text>
      </View>

      {isLoading && (
        <View style={styles.centered}>
          <ActivityIndicator color={COLORS.brand.accent} />
        </View>
      )}

      {isError && (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Couldn't load mechanics. Pull to refresh.</Text>
        </View>
      )}

      {!isLoading && !isError && (
        <FlatList
          data={mechanics}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <MechanicCard
              mechanic={item}
              onBook={() => navigation.navigate('BookingRequest', { mechanicId: item.id })}
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
  name: { ...TYPOGRAPHY.headingMd, color: COLORS.neutral[900] },
  rate: { ...TYPOGRAPHY.labelLg, color: COLORS.brand.accent },
  meta: { ...TYPOGRAPHY.bodySm, color: COLORS.neutral[700], marginTop: SPACING.xs },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { ...TYPOGRAPHY.bodyMd, color: COLORS.semantic.error },
});
