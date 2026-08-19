import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Input from '@components/Input';
import Button from '@components/Button';
import Card from '@components/Card';
import { COLORS, SPACING, TYPOGRAPHY } from '@constants/index';

const SERVICE_OPTIONS = ['Basic tune-up', 'Flat tire fix', 'Brake adjustment', 'Full overhaul'];

export default function BookingRequestScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const mechanicId: string | undefined = route.params?.mechanicId;

  const [service, setService] = useState(SERVICE_OPTIONS[0]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // POST /bookings isn't built on the backend yet — this is wired for
      // when it lands. For now we just confirm locally so the flow is
      // demonstrable end-to-end.
      await new Promise((resolve) => setTimeout(resolve, 500));
      Alert.alert('Request sent', 'The mechanic will confirm shortly.', [
        { text: 'OK', onPress: () => navigation.navigate('Bookings') },
      ]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Request service</Text>
        {mechanicId && <Text style={styles.subtitle}>Mechanic: {mechanicId}</Text>}

        <Card style={{ marginTop: SPACING.lg }}>
          <Text style={styles.sectionLabel}>Service type</Text>
          {SERVICE_OPTIONS.map((option) => (
            <Button
              key={option}
              label={option}
              variant={option === service ? 'primary' : 'tertiary'}
              style={{ marginTop: SPACING.sm }}
              onPress={() => setService(option)}
            />
          ))}
        </Card>

        <Input
          label="Notes for the mechanic (optional)"
          placeholder="e.g. squeaky rear brake"
          value={notes}
          onChangeText={setNotes}
          multiline
          style={{ height: 80, paddingTop: SPACING.sm }}
        />

        <Button label="Request booking" onPress={handleSubmit} loading={submitting} />
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
});
