import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Button from '@components/Button';
import Card from '@components/Card';
import { useAuthStore } from '@store/authStore';
import { COLORS, SPACING, TYPOGRAPHY } from '@constants/index';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>

        <Card style={{ marginTop: SPACING.lg }}>
          <Text style={styles.name}>{user?.displayName || `${user?.firstName} ${user?.lastName}`}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </Card>

        <Button label="Log out" variant="tertiary" style={{ marginTop: SPACING.xl }} onPress={logout} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.neutral[50] },
  content: { padding: SPACING.xl },
  title: { ...TYPOGRAPHY.headingLg, color: COLORS.neutral[900] },
  name: { ...TYPOGRAPHY.headingMd, color: COLORS.neutral[900] },
  email: { ...TYPOGRAPHY.bodyMd, color: COLORS.neutral[700], marginTop: SPACING.xs },
});
