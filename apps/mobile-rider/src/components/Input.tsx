import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '@constants/index';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export default function Input({ label, error, onFocus, onBlur, style, ...rest }: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          focused && styles.inputFocused,
          !!error && styles.inputError,
          style,
        ]}
        placeholderTextColor={COLORS.neutral[500]}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  label: {
    ...TYPOGRAPHY.bodySm,
    color: COLORS.neutral[700],
    marginBottom: SPACING.xs,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.md,
    ...TYPOGRAPHY.bodyLg,
    color: COLORS.neutral[900],
    backgroundColor: '#fff',
  },
  inputFocused: {
    borderWidth: 2,
    borderColor: COLORS.brand.accent,
  },
  inputError: {
    borderColor: COLORS.semantic.error,
  },
  error: {
    ...TYPOGRAPHY.bodySm,
    color: COLORS.semantic.error,
    marginTop: SPACING.xs,
  },
});
