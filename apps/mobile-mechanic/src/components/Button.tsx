import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  PressableProps,
  ViewStyle,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '@constants/index';

type Variant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function Button({
  label,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        isDisabled && styles.disabled,
        pressed && !isDisabled && { transform: [{ scale: 0.97 }] },
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? '#fff' : COLORS.brand.accent} />
      ) : (
        <Text style={[styles.label, variantTextStyles[variant]]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...TYPOGRAPHY.labelLg,
  },
  disabled: {
    opacity: 0.5,
  },
});

const variantStyles: Record<Variant, ViewStyle> = {
  primary: { backgroundColor: COLORS.brand.accent },
  secondary: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.brand.accent },
  tertiary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.neutral[300] },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: COLORS.semantic.error },
};

const variantTextStyles: Record<Variant, { color: string }> = {
  primary: { color: '#fff' },
  secondary: { color: COLORS.brand.accent },
  tertiary: { color: COLORS.neutral[700] },
  ghost: { color: COLORS.brand.accent },
  danger: { color: '#fff' },
};
