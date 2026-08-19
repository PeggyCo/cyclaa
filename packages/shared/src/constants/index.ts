/**
 * Shared constants for Cyclaa
 * Design tokens, API endpoints, configuration values
 */

// Design System Colors
export const COLORS = {
  brand: {
    primary: '#1A1A2E',
    accent: '#E85D24',
    accentLight: '#FFF0E8',
    white: '#FFFFFF',
    offwhite: '#F8F7F4',
  },
  semantic: {
    success: '#1B9E6D',
    successLight: '#E8F7F0',
    warning: '#E5A218',
    warningLight: '#FEF6E0',
    error: '#D93025',
    errorLight: '#FDECEA',
    info: '#2D7DD2',
    infoLight: '#E8F1FA',
  },
  neutral: {
    900: '#1A1A2E',
    700: '#4A4A5A',
    500: '#8E8E9A',
    300: '#D1D1D8',
    200: '#E8E8EC',
    100: '#F4F4F6',
    50: '#F8F7F4',
  },
} as const;

// Spacing (8px base grid)
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
} as const;

// Border Radius
export const BORDER_RADIUS = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

// Service Types (from spec)
export const SERVICE_TYPES = {
  BASIC_TUNE_UP: 'basic-tune-up',
  FULL_OVERHAUL: 'full-overhaul',
  FLAT_TIRE_FIX: 'flat-tire-fix',
  BRAKE_ADJUSTMENT: 'brake-adjustment',
  DERAILLEUR_ADJUSTMENT: 'derailleur-adjustment',
  CHAIN_REPLACEMENT: 'chain-replacement',
  WHEEL_TRUING: 'wheel-truing',
  CABLE_REPLACEMENT: 'cable-replacement',
  BOTTOM_BRACKET_SERVICE: 'bottom-bracket-service',
  HEADSET_SERVICE: 'headset-service',
  BIKE_FITTING_BASIC: 'bike-fitting-basic',
  BIKE_FITTING_PROFESSIONAL: 'bike-fitting-professional',
  EBIKE_BATTERY_CHECK: 'ebike-battery-check',
  EBIKE_MOTOR_SERVICE: 'ebike-motor-service',
  SAFETY_INSPECTION: 'safety-inspection',
  NEW_BIKE_ASSEMBLY: 'new-bike-assembly',
  CUSTOM_BUILD: 'custom-build',
  EMERGENCY_ROADSIDE: 'emergency-roadside',
} as const;

// Bike Types
export const BIKE_TYPES = [
  'road',
  'mountain',
  'hybrid',
  'commuter',
  'e-bike',
  'cargo',
  'gravel',
  'track',
  'bmx',
  'folding',
  'other',
] as const;

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  EN_ROUTE: 'en_route',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// API Base URLs (to be set from env)
export const API_ENDPOINTS = {
  AUTH: '/auth',
  USERS: '/users',
  BIKES: '/bikes',
  BOOKINGS: '/bookings',
  MECHANICS: '/mechanics',
  SERVICES: '/services',
  COMMUNITY: '/community',
  MESSAGES: '/messages',
  GEAR: '/gear',
  ADMIN: '/admin',
} as const;

// Mechanic Specialties
export const MECHANIC_SPECIALTIES = [
  'road',
  'mountain',
  'commuter',
  'e-bike',
  'cargo',
  'track',
  'bmx',
  'gravel',
  'folding',
  'general',
] as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;
