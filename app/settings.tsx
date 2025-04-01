import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { List, Divider, Button, Switch } from 'react-native-paper';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { ThemeColors } from '@/constants/ThemeColors';
import { useAuth } from '@/context/auth';

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const colors = ThemeColors[theme];
  const { signOut } = useAuth();

  const handleSignOut = () => {
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
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <List.Section>
        <List.Subheader style={{ color: colors.textSecondary }}>Appearance</List.Subheader>
        <List.Item
          title="Dark Mode"
          description="Toggle dark mode theme"
          left={props => <List.Icon {...props} icon="theme-light-dark" color={colors.textPrimary} />}
          right={() => (
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              color={colors.primary}
            />
          )}
          titleStyle={{ color: colors.textPrimary }}
          descriptionStyle={{ color: colors.textSecondary }}
        />
        <Divider />
        
        <List.Subheader style={{ color: colors.textSecondary }}>Account</List.Subheader>
        <List.Item
          title="Edit Profile"
          left={props => <List.Icon {...props} icon="account-edit" color={colors.textPrimary} />}
          onPress={() => router.push('/profile/edit')}
          titleStyle={{ color: colors.textPrimary }}
        />
        <List.Item
          title="Change Password"
          left={props => <List.Icon {...props} icon="lock" color={colors.textPrimary} />}
          onPress={() => router.push('/profile/change-password')}
          titleStyle={{ color: colors.textPrimary }}
        />
        <Divider />
        
        <List.Subheader style={{ color: colors.textSecondary }}>Notifications</List.Subheader>
        <List.Item
          title="Notification Settings"
          left={props => <List.Icon {...props} icon="bell" color={colors.textPrimary} />}
          onPress={() => router.push('/settings/notifications')}
          titleStyle={{ color: colors.textPrimary }}
        />
        <Divider />
        
        <List.Subheader style={{ color: colors.textSecondary }}>Support</List.Subheader>
        <List.Item
          title="Help & FAQ"
          left={props => <List.Icon {...props} icon="help-circle" color={colors.textPrimary} />}
          onPress={() => router.push('/settings/help')}
          titleStyle={{ color: colors.textPrimary }}
        />
        <List.Item
          title="Contact Support"
          left={props => <List.Icon {...props} icon="message" color={colors.textPrimary} />}
          onPress={() => router.push('/settings/support')}
          titleStyle={{ color: colors.textPrimary }}
        />
        <Divider />
        
        <List.Subheader style={{ color: colors.textSecondary }}>About</List.Subheader>
        <List.Item
          title="Privacy Policy"
          left={props => <List.Icon {...props} icon="shield-check" color={colors.textPrimary} />}
          onPress={() => router.push('/settings/privacy')}
          titleStyle={{ color: colors.textPrimary }}
        />
        <List.Item
          title="Terms of Service"
          left={props => <List.Icon {...props} icon="file-document" color={colors.textPrimary} />}
          onPress={() => router.push('/settings/terms')}
          titleStyle={{ color: colors.textPrimary }}
        />
      </List.Section>

      <View style={styles.buttonContainer}>
        <Button 
          mode="outlined" 
          onPress={handleSignOut}
          style={[styles.signOutButton, { borderColor: colors.expired }]}
          textColor={colors.expired}
          icon="logout"
        >
          Sign Out
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    padding: 16,
  },
  signOutButton: {
    borderWidth: 2,
  },
}); 