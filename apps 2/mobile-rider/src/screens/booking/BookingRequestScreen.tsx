import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Input from '@components/Input';
import Button from '@components/Button';
import Card from '@components/Card';
import { useServiceTypes } from '@api/queries/useServiceTypes';
import { useCreateBooking } from '@api/queries/useBookings';
import { COLORS, SPACING, TYPOGRAPHY } from '@constants/index';

export default function BookingRequestScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const mechanicId: string | undefined = route.params?.mechanicId;

  const { data: serviceTypes, isLoading: loadingServices, isError: serviceError } = useServiceTypes();
  const createBooking = useCreateBooking();

  const [serviceTypeId, setServiceTypeId] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Default to the first service once the catalog loads.
  React.useEffect(() => {
    if (!serviceTypeId && serviceTypes?.length) {
      setServiceTypeId(serviceTypes[0].id);
    }
  }, [serviceTypes, serviceTypeId]);

  const handleSubmit = async () => {
    if (!serviceTypeId) {
      Alert.alert('Choose a service', 'Pick what you need done before requesting.');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Add an address', "Where should the mechanic meet you?");
      return;
    }

    try {
      await createBooking.mutateAsync({
        mechanicId,
        serviceTypeId,
        address: address.trim(),
        description: notes.trim() || undefined,
      });
      Alert.alert('Request sent', 'The mechanic will confirm shortly.', [
        { text: 'OK', onPress: () => navigation.navigate('Bookings') },
      ]);
    } catch (err: any) {
      Alert.alert('Couldn’t send request', err?.response?.data?.error || 'Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Request service</Text>
        {mechanicId && <Text style={styles.subtitle}>Requesting a specific mechanic</Text>}

        <Card style={{ marginTop: SPACING.lg }}>
          <Text style={styles.sectionLabel}>Service type</Text>

          {loadingServices && <ActivityIndicator color={COLORS.brand.accent} />}
          {serviceError && <Text style={styles.errorText}>Couldn't load services. Pull to refresh.</Text>}

          {serviceTypes?.map((service) => (
            <Button
              key={service.id}
              label={`${service.name} · from $${service.minPrice}`}
              variant={service.id === serviceTypeId ? 'primary' : 'tertiary'}
              style={{ marginTop: SPACING.sm }}
              onPress={() => setServiceTypeId(service.id)}
            />
          ))}
        </Card>

        <Input
          label="Where should the mechanic meet you?"
          placeholder="e.g. 142 Bedford Ave, Brooklyn"
          value={address}
          onChangeText={setAddress}
        />

        <Input
          label="Notes for the mechanic (optional)"
          placeholder="e.g. squeaky rear brake"
          value={notes}
          onChangeText={setNotes}
          multiline
          style={{ height: 80, paddingTop: SPACING.sm }}
        />

        <Button
          label="Request booking"
          onPress={handleSubmit}
          loading={createBooking.isPending}
          disabled={loadingServices}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.neutral[50] },
  content: { padding: SPACING.xl },
  title: { ...TYPOGRAPHY.headingLg, color: COLORS.neutral[900] },
  subtitle: { ...TYPOGRAPHY.bodyMd, color: COLORS.neutral[700], marginTop: SPACING.xs },
  sectionLabel: { ...TYPOGRAPHY.bodySm, color: COLORS.neutral[700], marginBottom: SPACING.xs },
  errorText: { ...TYPOGRAPHY.bodyMd, color: COLORS.semantic.error },
});
