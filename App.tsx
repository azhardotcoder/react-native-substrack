import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, MD3DarkTheme, MD3LightTheme, adaptNavigationTheme } from 'react-native-paper';
import { AuthProvider } from '@/context/auth';
import { ThemeProvider } from '@/context/ThemeContext';
import { useMemo } from 'react';
import { NavigationContainer, DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import AIChatbot from '@/components/AIChatbot';
import { useAppTheme } from '@/context/AppThemeContext';
import { createStackNavigator } from '@react-navigation/stack';

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = {
  ...MD3LightTheme,
  ...LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...LightTheme.colors,
    primary: '#6750A4',
    secondary: '#625B71',
    accent: '#7F67BE',
    background: '#F8F9FA',
    surface: '#FFFFFF',
    text: '#1C1B1F',
    error: '#B3261E',
    success: '#4CAF50',
    warning: '#FF9800',
    info: '#2196F3',
    cardGradientStart: '#F6F3FF',
    cardGradientEnd: '#FFFFFF',
    textMuted: '#6B7280',
  },
  roundness: 20,
  fonts: {
    ...MD3LightTheme.fonts,
    titleLarge: {
      ...MD3LightTheme.fonts.titleLarge,
      fontWeight: '700',
    },
    titleMedium: {
      ...MD3LightTheme.fonts.titleMedium,
      fontWeight: '600',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};

const CombinedDarkTheme = {
  ...MD3DarkTheme,
  ...DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...DarkTheme.colors,
    primary: '#D0BCFF',
    secondary: '#CCC2DC',
    accent: '#B69DF8',
    background: '#1A1A1A',
    surface: '#2A2A2A',
    text: '#E6E1E5',
    error: '#F2B8B5',
    success: '#81C784',
    warning: '#FFB74D',
    info: '#64B5F6',
    cardGradientStart: '#2A2A2A',
    cardGradientEnd: '#353535',
    textMuted: '#9CA3AF',
  },
  roundness: 20,
  fonts: {
    ...MD3DarkTheme.fonts,
    titleLarge: {
      ...MD3DarkTheme.fonts.titleLarge,
      fontWeight: '700',
    },
    titleMedium: {
      ...MD3DarkTheme.fonts.titleMedium,
      fontWeight: '600',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AuthProvider>
          <ThemeProvider>
            <CustomThemeProvider>
              <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack screenOptions={{ 
                  headerShown: false,
                  animation: 'fade',
                  contentStyle: { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }
                }}>
                  <Stack.Screen name="(auth)" options={{ animation: 'none' }} />
                  <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
                  <Stack.Screen 
                    name="notifications" 
                    options={{
                      presentation: 'card',
                      animation: 'slide_from_right'
                    }}
                  />
                  <Stack.Screen name="chatbot" options={{ headerShown: false }} />
                  <Stack.Screen name="settings" options={{ headerShown: false }} />
                  <Stack.Screen 
                    name="(subscription)" 
                    options={{
                      presentation: 'modal',
                      animation: 'slide_from_bottom'
                    }}
                  />
                </Stack>
              </ThemeProvider>
            </CustomThemeProvider>
          </ThemeProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const { theme } = useAppTheme();
  
  const themeValue = useMemo(() => 
    theme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme,
    [theme]
  );

  return (
    <PaperProvider theme={themeValue}>
      <NavigationContainer theme={themeValue}>
        <AuthProvider>
          <AIChatbot />
        </AuthProvider>
      </NavigationContainer>
    </PaperProvider>
  );
} 