const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};

export const Colors = {
  primary: '#6750A4',
  secondary: '#625B71',
  accent: '#7F67BE',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  textPrimary: '#1C1B1F',
  textSecondary: '#625B71',
  border: '#E6E1E5',
  cardBackground: '#FFFFFF',
  active: '#4CAF50',
  expiringSoon: '#FFC107',
  expired: '#F44336',
  streaming: '#E91E63',
  software: '#2196F3',
  gaming: '#9C27B0',
  utilities: '#FF9800',
  other: '#607D8B',
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.46,
    elevation: 9,
  },
};
