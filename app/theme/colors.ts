import { Platform } from 'react-native';

const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  background: '#F2F2F7',
  text: '#000000',
  border: '#C7C7CC',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500'
};

export const Shadows = {
  card: Platform.select({
    web: {
      boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.1)',
    },
    default: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
  }),
  button: Platform.select({
    web: {
      boxShadow: '0px 4px 5.46px rgba(0, 0, 0, 0.2)',
    },
    default: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 5.46,
      elevation: 9,
    },
  }),
};

export default colors; 