import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Input from '@components/Input';
import Button from '@components/Button';
import { useAuthStore } from '@store/authStore';
import { COLORS, SPACING, TYPOGRAPHY } from '@constants/index';

export default function SignupScreen() {
  const navigation = useNavigation<any>();
  const { signup, error, clearError } = useAuthStore();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const canSubmit = form.firstName && form.lastName && form.email && form.phone && form.password;

  const handleSubmit = async () => {
    clearError();
    setSubmitting(true);
    try {
      await signup(form);
    } catch {
      // error is surfaced via the store
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Create your account</Text>

          <Input label="First name" value={form.firstName} onChangeText={update('firstName')} />
          <Input label="Last name" value={form.lastName} onChangeText={update('lastName')} />
          <Input
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={form.email}
            onChangeText={update('email')}
          />
          <Input label="Phone" keyboardType="phone-pad" value={form.phone} onChangeText={update('phone')} />
          <Input label="Password" secureTextEntry value={form.password} onChangeText={update('password')} />

          {!!error && <Text style={styles.error}>{error}</Text>}

          <Button label="Create account" onPress={handleSubmit} loading={submitting} disabled={!canSubmit} />

          <Button
            label="Already have an account? Log in"
            variant="ghost"
            style={{ marginTop: SPACING.lg }}
            onPress={() => navigation.navigate('Login')}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: SPACING['2xl'], paddingBottom: SPACING['3xl'] },
  title: { ...TYPOGRAPHY.headingLg, color: COLORS.neutral[900], marginBottom: SPACING.xl },
  error: { ...TYPOGRAPHY.bodySm, color: COLORS.semantic.error, marginBottom: SPACING.md },
});
