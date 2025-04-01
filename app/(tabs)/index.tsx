import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator, Animated, TouchableOpacity } from 'react-native';
import { Text, Card, Button, useTheme, Menu, IconButton, SegmentedButtons, Portal, Surface } from 'react-native-paper';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format, addDays, isBefore } from 'date-fns';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Swipeable } from 'react-native-gesture-handler';
import { useTheme as useAppTheme } from '../../context/ThemeContext';
import { ThemeColors } from '../../constants/ThemeColors';
import SubscriptionList from '../../components/SubscriptionList';

interface Notification {
  id: string;
  subscription_name: string;
  customer_name: string;
  expiry_date: string;
}

interface Stats {
  total: number;
  active: number;
  expired: number;
  thisMonth: number;
}

export default function DashboardScreen() {
  const { theme } = useAppTheme();
  const colors = ThemeColors[theme];
  const [stats, setStats] = useState<Stats>({
    total: 0,
    active: 0,
    expired: 0,
    thisMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [timeFilterVisible, setTimeFilterVisible] = useState(false);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('1 Week');
  const [upcomingRenewals, setUpcomingRenewals] = useState([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('7days');

  const timeFilters = [
    '1 Day',
    '1 Week',
    '1 Month',
    '1 Year',
    'Custom'
  ];

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.replace('/(auth)/login');
        return;
      }
      setIsAuthenticated(true);
      fetchStats();
    } catch (error) {
      console.error('Auth error:', error);
      router.replace('/(auth)/login');
    }
  };

  const fetchStats = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log('No active session');
        return;
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) throw error;

      console.log('All subscriptions:', data);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let endDate = new Date();
      switch (selectedPeriod) {
        case '2days':
          endDate.setDate(today.getDate() + 2);
          break;
        case '7days':
          endDate.setDate(today.getDate() + 7);
          break;
        case '1month':
          endDate.setMonth(today.getMonth() + 1);
          break;
        default:
          endDate.setDate(today.getDate() + 2);
      }
      endDate.setHours(23, 59, 59, 999);

      console.log('Checking expirations between:', today, 'and', endDate);

      const upcomingExpirations = data?.filter(sub => {
        const expiryDate = new Date(sub.expiry_date);
        expiryDate.setHours(0, 0, 0, 0);
        return expiryDate >= today && expiryDate <= endDate;
      });

      console.log('Found upcoming expirations:', upcomingExpirations);
      setNotifications(upcomingExpirations || []);

      // Calculate stats
      if (data) {
        const total = data.length;
        const active = data.filter(sub => {
          const expiryDate = new Date(sub.expiry_date);
          return expiryDate >= today;
        }).length;
        const expired = total - active;
        const thisMonth = data.filter(sub => {
          const expiryDate = new Date(sub.expiry_date);
          return expiryDate >= today && expiryDate <= endDate;
        }).length;

        setStats({
          total,
          active,
          expired,
          thisMonth
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [selectedPeriod]);

  const handleCardPress = useCallback((subscription: any) => {
    Animated.sequence([
      Animated.timing(new Animated.Value(1), {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(new Animated.Value(0.95), {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push({
        pathname: '/subscriptions',
        params: { subscriptionId: subscription.id }
      });
    });
  }, []);

  const clearNotification = async (notificationId: string) => {
    try {
      // Remove from UI immediately
      setNotifications(notifications.filter(n => n.id !== notificationId));
      
      // Update in database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('subscriptions')
          .update({ notification_dismissed: true })
          .eq('id', notificationId);
      }
    } catch (error) {
      console.error('Error clearing notification:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      // Clear from UI immediately
      setNotifications([]);
      
      // Update in database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const notificationIds = notifications.map(n => n.id);
        await supabase
          .from('subscriptions')
          .update({ notification_dismissed: true })
          .in('id', notificationIds);
      }
    } catch (error) {
      console.error('Error clearing all notifications:', error);
    }
  };

  const renderRightActions = useCallback((notificationId: string) => {
    return (
      <TouchableOpacity
        style={[styles.deleteAction, { backgroundColor: theme === 'dark' ? '#331F1F' : '#EF4444' }]}
        onPress={() => clearNotification(notificationId)}
      >
        <MaterialCommunityIcons name="delete" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    );
  }, [theme]);

  if (loading || !isAuthenticated) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const renderStatsCard = (
    title: string, 
    value: number, 
    icon: keyof typeof MaterialCommunityIcons.glyphMap,
    colors: { bg: string, text: string }
  ) => (
    <Card style={[styles.statsCard, { backgroundColor: colors.bg }]}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name={icon} size={24} color={colors.text} />
        </View>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.cardValue, { color: colors.text }]}>{value}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        scrollEventThrottle={16}
        decelerationRate="fast"
        removeClippedSubviews={true}
      >
      

        <View style={styles.statsGrid}>
          {renderStatsCard('Total', stats.total, 'calendar-blank', {
            bg: '#1C1F2C',
            text: '#FFFFFF'
          })}
          {renderStatsCard('Active', stats.active, 'checkbox-marked', {
            bg: '#2CB979',
            text: '#FFFFFF'
          })}
          {renderStatsCard('Expired', stats.expired, 'alert-circle', {
            bg: '#EF4444',
            text: '#FFFFFF'
          })}
          {renderStatsCard('This Month', stats.thisMonth, 'calendar-month', {
            bg: '#6366F1',
            text: '#FFFFFF'
          })}
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            mode="outlined" 
            onPress={() => router.push('/subscriptions')}
            style={[styles.button, styles.secondaryButton]}
            icon="format-list-bulleted"
            contentStyle={styles.buttonContent}
            textColor={colors.textPrimary}
          >
            View All Subscriptions
          </Button>
        </View>

        <View style={styles.filterContainer}>
          <SegmentedButtons
            value={selectedPeriod}
            onValueChange={setSelectedPeriod}
            buttons={[
              { value: '2days', label: '2 Days' },
              { value: '7days', label: '7 Days' },
              { value: '1month', label: '1 Month' },
            ]}
            style={[styles.segmentedButtons, { 
              backgroundColor: theme === 'dark' ? colors.dateBoxBackground : '#F1F5F9'
            }]}
            theme={{
              colors: {
                secondaryContainer: theme === 'dark' ? colors.primary : '#003F88',
                onSecondaryContainer: theme === 'dark' ? '#FFFFFF' : '#FFFFFF',
                outline: theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                onSurface: theme === 'dark' ? colors.textPrimary : '#171D1C',
              }
            }}
          />
        </View>

        <Text style={[styles.notificationCount, { color: colors.textPrimary }]}>
          Total Notifications: {notifications.length}
        </Text>

        {notifications.length > 0 ? (
          <View style={[styles.notificationPanel, { backgroundColor: colors.background }]}>
            <View style={styles.notificationHeader}>
              <Text variant="titleLarge" style={[styles.notificationTitle, { color: colors.textPrimary }]}>
                Notifications ({notifications.length})
              </Text>
              <Button 
                mode="text"
                onPress={clearAllNotifications}
                textColor={theme === 'dark' ? '#FF4D4F' : '#EF4444'}
              >
                Clear All
              </Button>
            </View>
            {notifications.map((notification) => (
              <Swipeable
                key={notification.id}
                renderRightActions={() => renderRightActions(notification.id)}
                renderLeftActions={() => renderRightActions(notification.id)}
                friction={2}
                overshootRight={false}
                overshootLeft={false}
                rightThreshold={40}
                leftThreshold={40}
              >
                <Card 
                  style={[styles.notificationCard, { 
                    backgroundColor: theme === 'dark' ? colors.dateBoxBackground : 'rgba(255, 255, 255, 0.95)',
                    borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)',
                  }]}
                  onPress={() => router.push({
                    pathname: '/subscriptions',
                    params: { subscriptionId: notification.id }
                  })}
                >
                  <Card.Content>
                    <View style={styles.notificationItem}>
                      <View style={styles.notificationContent}>
                        <MaterialCommunityIcons 
                          name="bell-alert" 
                          size={24} 
                          color={theme === 'dark' ? '#FF4D4F' : '#EF4444'} 
                          style={styles.notificationIcon}
                        />
                        <View>
                          <Text variant="titleMedium" style={[styles.notificationName, { 
                            color: colors.textPrimary 
                          }]}>
                            {notification.subscription_name}
                          </Text>
                          <Text variant="bodyMedium" style={[styles.notificationCustomer, { 
                            color: colors.textSecondary 
                          }]}>
                            {notification.customer_name}
                          </Text>
                          <Text variant="bodySmall" style={[styles.notificationDate, { 
                            color: theme === 'dark' ? '#FF4D4F' : '#EF4444' 
                          }]}>
                            Expires on {format(new Date(notification.expiry_date), 'MMM dd, yyyy')}
                          </Text>
                        </View>
                      </View>
                      <MaterialCommunityIcons 
                        name="chevron-right" 
                        size={24} 
                        color={colors.textSecondary} 
                      />
                    </View>
                  </Card.Content>
                </Card>
              </Swipeable>
            ))}
          </View>
        ) : (
          <Text style={[styles.noNotificationsText, { color: colors.textSecondary }]}>
            No upcoming expirations in {selectedPeriod === '2days' ? 'next 2 days' : 
              selectedPeriod === '7days' ? 'next 7 days' : 'next month'}
          </Text>
        )}
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 40,
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  timeFilterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  timeFilterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  statsCard: {
    width: '47%',
    borderRadius: 16,
    elevation: 4,
  },
  cardContent: {
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    opacity: 0.9,
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  buttonContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  button: {
    maxWidth: 250,
    height: 48,
    borderRadius: 12,
    borderColor: '#000000',
    borderWidth: 1,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
  },
  buttonContent: {
    height: 48,
  },
  filterContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  segmentedButtons: {
    backgroundColor: '#F1F5F9',
  },
  notificationPanel: {
    marginTop: 24,
    marginBottom: 24,
    borderRadius: 12,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  notificationTitle: {
    fontWeight: '600',
  },
  notificationCard: {
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationIcon: {
    marginRight: 12,
  },
  notificationName: {
    color: '#1E293B',
    fontWeight: '500',
  },
  notificationCustomer: {
    color: '#64748B',
    marginTop: 2,
  },
  notificationDate: {
    color: '#EF4444',
    marginTop: 2,
  },
  deleteActionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteAction: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 12,
  },
  notificationCount: {
    marginTop: 16,
    marginLeft: 16,
  },
  noNotificationsText: {
    marginTop: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


