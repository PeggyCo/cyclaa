/**
 * Design tokens for the Rider app.
 * Colors/spacing come from the shared package; typography is app-local
 * since it depends on platform font families.
 */
import { Platform } from 'react-native';

export { COLORS, SPACING, BORDER_RADIUS, BOOKING_STATUS, API_ENDPOINTS } from '@shared/constants';

export const TYPOGRAPHY = {
  fontFamily: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }),
  displayLg: { fontSize: 32, fontWeight: '700' as const },
  headingLg: { fontSize: 22, fontWeight: '600' as const },
  headingMd: { fontSize: 18, fontWeight: '600' as const },
  bodyLg: { fontSize: 16, fontWeight: '400' as const },
  bodyMd: { fontSize: 14, fontWeight: '400' as const },
  bodySm: { fontSize: 12, fontWeight: '400' as const },
  labelLg: { fontSize: 14, fontWeight: '600' as const },
};

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
