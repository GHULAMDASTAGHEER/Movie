export const Colors = {
  // Primary Colors
  primary: '#4A148C',
  primaryLight: '#7B1FA2',
  primaryDark: '#311B92',
  
  // Secondary Colors
  secondary: 'rgba(239, 239, 239, 1)',
  secondaryLight: '#4A9EFF',
  secondaryDark: '#0056CC',
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  gray: '#202C434D',
  lightGray: '#B0B0B0',
  darkGray: '#333333',
  border: '#E0E0E0',
  
  // Background Colors
  background: '#FFFFFF',
  surface: '#F5F5F5',
  
  // Text Colors
  textPrimary: 'rgba(32, 44, 67, 1)',
  textSecondary: '#666666',
  textLight: '#B0B0B0',
  textWhite: '#FFFFFF',
  
  // Status Colors
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  
  // Overlay Colors
  overlay: 'rgba(0, 0, 0, 0.3)',
  overlayDark: 'rgba(0, 0, 0, 0.8)',
  
  // Tab Colors
  tabActive: '#FFFFFF',
  tabInactive: '#B0B0B0',
  tabBackground: '#2E2739',
} as const;

export type ColorKey = keyof typeof Colors;
