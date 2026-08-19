import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '@components/Button';
import { COLORS, SPACING, TYPOGRAPHY } from '@constants/index';

export default function WelcomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Cyclaa</Text>
        <Text style={styles.subtitle}>
          On-demand mechanics, ride crews, and gear — built by cyclists, for cyclists.
        </Text>
      </View>
      <View style={styles.actions}>
        <Button label="Log in" onPress={() => navigation.navigate('Login')} />
        <Button
          label="Create account"
          variant="secondary"
          style={{ marginTop: SPACING.md }}
          onPress={() => navigation.navigate('Signup')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.brand.primary,
    justifyContent: 'space-between',
    padding: SPACING['2xl'],
  },
  content: {
    marginTop: SPACING['3xl'],
  },
  title: {
    ...TYPOGRAPHY.displayLg,
    color: '#fff',
    marginBottom: SPACING.md,
  },
  subtitle: {
    ...TYPOGRAPHY.bodyLg,
    color: COLORS.neutral[300],
  },
  actions: {
    marginBottom: SPACING.xl,
  },
});
