import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import { router } from 'expo-router';

export default function AuthLayout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        router.replace('/(tabs)');
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (session?.user) {
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6750A4" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{
      headerShown: false,
      animation: 'fade',
      contentStyle: { backgroundColor: '#fff' }
    }}>
      <Stack.Screen 
        name="login" 
        options={{
          gestureEnabled: false // Prevent swipe back to previous screen
        }}
      />
    </Stack>
  );
} 