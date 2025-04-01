import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import 'react-native-url-polyfill/auto';
import { PaperProvider } from 'react-native-paper';
import { useColorScheme } from '@/components/useColorScheme';
import { getSubscriptionAlerts } from '@/lib/alertService';
import * as Updates from 'expo-updates';
import Constants from 'expo-constants';
import { supabase } from '@/lib/supabase';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/context/auth';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider as CustomThemeProvider } from '@/context/ThemeContext';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(auth)',
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const colorScheme = useColorScheme();
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setIsAuthenticated(!!session?.user);
        }
      } catch (error) {
        if (mounted) {
          console.error('Error checking auth:', error);
          setIsAuthenticated(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (error) {
      console.error('Font loading error:', error);
    }
  }, [error]);

  useEffect(() => {
    let mounted = true;
    let timeout: NodeJS.Timeout;

    async function checkForUpdates() {
      try {
        if (!__DEV__ && Constants.appOwnership !== 'expo') {
          const update = await Updates.checkForUpdateAsync();
          if (mounted && update.isAvailable) {
            setUpdateAvailable(true);
            await Updates.fetchUpdateAsync();
            await Updates.reloadAsync();
          }
        }
      } catch (error) {
        if (!__DEV__ && mounted) {
          console.error('Error checking for updates:', error);
        }
      }
    }

    checkForUpdates();

    return () => {
      mounted = false;
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    let timeout: NodeJS.Timeout;
    
    if (loaded && isAuthenticated) {
      timeout = setTimeout(() => {
        if (mounted) {
          getSubscriptionAlerts().catch(error => {
            console.error('Failed to get subscription alerts:', error);
          });
        }
      }, 3000);
    }
    
    return () => {
      mounted = false;
      if (timeout) clearTimeout(timeout);
    };
  }, [loaded, isAuthenticated]);

  if (!loaded || isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }}>
        <ActivityIndicator size="large" color="#6750A4" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <PaperProvider>
          <SafeAreaProvider>
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
          </SafeAreaProvider>
        </PaperProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
