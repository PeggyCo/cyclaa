import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Input from '@components/Input';
import Button from '@components/Button';
import { useAuthStore } from '@store/authStore';
import { COLORS, SPACING, TYPOGRAPHY } from '@constants/index';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const { login, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    clearError();
    setSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch {
      // error is surfaced via the store
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome back</Text>

          <Input
            label="Email"
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {!!error && <Text style={styles.error}>{error}</Text>}

          <Button
            label="Log in"
            onPress={handleSubmit}
            loading={submitting}
            disabled={!email || !password}
          />

          <Button
            label="Don't have an account? Sign up"
            variant="ghost"
            style={{ marginTop: SPACING.lg }}
            onPress={() => navigation.navigate('Signup')}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: SPACING['2xl'], justifyContent: 'center' },
  title: { ...TYPOGRAPHY.headingLg, color: COLORS.neutral[900], marginBottom: SPACING.xl },
  error: { ...TYPOGRAPHY.bodySm, color: COLORS.semantic.error, marginBottom: SPACING.md },
});
