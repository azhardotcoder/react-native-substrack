export type Theme = 'light' | 'dark';

export const ThemeColors = {
  light: {
    // Main backgrounds
    background: '#FFFFFF',
    cardBackgroundActive: '#F6FFED',
    cardBackgroundExpired: '#FFF1F0',
    dateBoxBackground: '#F5F5F5',

    // Text colors
    textPrimary: '#171D1C',
    textSecondary: '#666666',
    statusActive: '#389E0D',
    statusExpired: '#CF1322',

    // Button colors
    primary: '#003F88',
    whatsapp: '#25D366',
    copyButton: '#1A237E',

    // Other elements
    divider: '#E0E0E0',
    iconBackground: '#FFFFFF',
    subscriptionPill: '#003F88',
  },
  dark: {
    // Main backgrounds
    background: '#121212',
    cardBackgroundActive: '#1B3322',
    cardBackgroundExpired: '#331F1F',
    dateBoxBackground: '#1E1E1E',

    // Text colors
    textPrimary: '#FFFFFF',
    textSecondary: '#A0A0A0',
    statusActive: '#52C41A',
    statusExpired: '#FF4D4F',

    // Button colors
    primary: '#1976D2',
    whatsapp: '#25D366',
    copyButton: '#3F51B5',

    // Other elements
    divider: '#2C2C2C',
    iconBackground: '#1E1E1E',
    subscriptionPill: '#1976D2',
  },
} as const; 