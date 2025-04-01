import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Tabs, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Menu, IconButton } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/auth';
import { useTheme } from '@/context/ThemeContext';
import { ThemeColors } from '@/constants/ThemeColors';

type TabBarIconProps = {
  focused: boolean;
  color: string;
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { theme } = useTheme();
  const themeColors = ThemeColors[theme as keyof typeof ThemeColors];
  const { signOut } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.replace('/(auth)/login');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      router.replace('/(auth)/login');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/(auth)/login');
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: themeColors.primary,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 20,
            letterSpacing: 0.5,
          },
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <IconButton
                icon="robot"
                iconColor="#fff"
                size={24}
                onPress={() => router.push('/chatbot')}
                style={styles.menuButton}
              />
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <IconButton
                    icon="menu"
                    iconColor="#fff"
                    size={24}
                    onPress={() => setMenuVisible(true)}
                    style={styles.menuButton}
                  />
                }
                contentStyle={[styles.menuContent, { backgroundColor: themeColors.background }]}
              >
                <Menu.Item 
                  onPress={() => {
                    setMenuVisible(false);
                    router.push('/settings');
                  }} 
                  title="Settings"
                  leadingIcon="cog-outline"
                  titleStyle={{ color: themeColors.textPrimary }}
                />
                <Menu.Item 
                  onPress={() => {
                    setMenuVisible(false);
                    handleLogout();
                  }} 
                  title="Logout"
                  leadingIcon="logout-variant"
                  titleStyle={{ color: themeColors.textPrimary }}
                />
              </Menu>
            </View>
          ),
          tabBarShowLabel: true,
          tabBarActiveTintColor: themeColors.primary,
          tabBarInactiveTintColor: themeColors.textSecondary,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: -4,
          },
          tabBarStyle: {
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
            backgroundColor: theme === 'dark' ? themeColors.dateBoxBackground : '#FFFFFF',
            borderTopColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : '#E0E0E0',
            borderTopWidth: 1,
            elevation: 0,
            shadowOpacity: 0,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused, color }: TabBarIconProps) => (
              <MaterialCommunityIcons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="analysis"
          options={{
            title: 'Analysis',
            tabBarIcon: ({ focused, color }: TabBarIconProps) => (
              <MaterialCommunityIcons
                name={focused ? "chart-box" : "chart-box-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="subscriptions"
          options={{
            title: 'Subs',
            tabBarIcon: ({ focused, color }: TabBarIconProps) => (
              <MaterialCommunityIcons
                name={focused ? "credit-card-multiple" : "credit-card-multiple-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
      <TouchableOpacity 
        style={[styles.floatingAddButton, { backgroundColor: themeColors.primary }]}
        onPress={() => router.push('/(subscription)/new')}
      >
        <MaterialCommunityIcons
          name="plus"
          size={32}
          color="#FFFFFF"
        />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    margin: 0,
  },
  floatingAddButton: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  menuContent: {
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: 48,
  },
});
