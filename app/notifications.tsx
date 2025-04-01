import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Chip, Divider, ActivityIndicator, useTheme } from 'react-native-paper';
import { Stack, useRouter } from 'expo-router';
import { format } from 'date-fns';
import { checkExpiringSubscriptions, getSubscriptionAlerts, clearNotification } from '../lib/alertService';
import { Swipeable } from 'react-native-gesture-handler';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type Subscription = {
  id: string;
  user_id: string;
  customer_email: string;
  customer_name: string;
  subscription_name: string;
  phone_number: string;
  amount: number;
  buy_date: string;
  expiry_date: string;
  daysRemaining?: number;
};

export default function NotificationsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expiringSubscriptions, setExpiringSubscriptions] = useState<Subscription[]>([]);
  const [expiredSubscriptions, setExpiredSubscriptions] = useState<Subscription[]>([]);

  const processSubscriptionData = useCallback((data: Subscription[]) => {
    const today = new Date();
    
    const processedExpiring = data
      .filter(sub => new Date(sub.expiry_date) > today)
      .map(sub => ({
        ...sub,
        daysRemaining: Math.ceil((new Date(sub.expiry_date).getTime() - today.getTime()) / (1000 * 3600 * 24))
      }))
      .sort((a, b) => (a.daysRemaining || 0) - (b.daysRemaining || 0));
    
    const processedExpired = data
      .filter(sub => new Date(sub.expiry_date) <= today)
      .map(sub => ({
        ...sub,
        daysRemaining: -Math.ceil((today.getTime() - new Date(sub.expiry_date).getTime()) / (1000 * 3600 * 24))
      }))
      .sort((a, b) => (b.daysRemaining || 0) - (a.daysRemaining || 0));

    return { processedExpiring, processedExpired };
  }, []);

  const fetchNotificationData = useCallback(async () => {
    try {
      setLoading(true);
      const { expiringSubscriptions, expiredSubscriptions } = await getSubscriptionAlerts();
      const { processedExpiring, processedExpired } = processSubscriptionData([...expiringSubscriptions, ...expiredSubscriptions]);
      
      setExpiringSubscriptions(processedExpiring);
      setExpiredSubscriptions(processedExpired);
    } catch (error: any) {
      console.error('Error fetching notifications:', error.message);
      Alert.alert('Error', 'Failed to fetch subscription notifications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [processSubscriptionData]);

  useEffect(() => {
    fetchNotificationData();
  }, [fetchNotificationData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotificationData();
  };

  const showAlerts = async () => {
    try {
      await checkExpiringSubscriptions();
      fetchNotificationData(); // Refresh data after showing alerts
    } catch (error) {
      console.error('Error checking subscriptions:', error);
      Alert.alert('Error', 'Failed to check subscriptions');
    }
  };

  const handleClearNotification = useCallback(async (id: string) => {
    try {
      await clearNotification(id);
      setExpiringSubscriptions(prev => prev.filter(sub => sub.id !== id));
      setExpiredSubscriptions(prev => prev.filter(sub => sub.id !== id));
    } catch (error) {
      console.error('Error clearing notification:', error);
    }
  }, []);

  const renderExpiringItem = useCallback(({ item }: { item: Subscription }) => (
    <Card style={[styles.card, { marginBottom: 12 }]} mode="outlined">
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.subscriptionNamePill}>
            <Text style={styles.subscriptionNameText}>
              {item.subscription_name}
            </Text>
          </View>
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              onPress={() => handleClearNotification(item.id)}
              style={styles.clearButton}
            >
              <MaterialCommunityIcons name="close" size={20} color="#666" />
            </TouchableOpacity>
            <View style={[
              styles.statusPill,
              { backgroundColor: item.daysRemaining <= 7 ? '#F44336' : '#2E7D32' }
            ]}>
              <Text style={styles.statusText}>
                {item.daysRemaining <= 7 ? 'URGENT' : 'EXPIRING'}
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.cardTitle}>Expires in {item.daysRemaining} days</Text>
        <Text style={styles.cardSubtitle}>
          Renewal Date: {new Date(item.expiry_date).toLocaleDateString()}
        </Text>
      </Card.Content>
    </Card>
  ), [handleClearNotification]);

  const renderExpiredItem = useCallback(({ item }: { item: Subscription }) => (
    <Card style={[styles.card, { marginBottom: 12, opacity: 0.8 }]} mode="outlined">
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.subscriptionNamePill}>
            <Text style={styles.subscriptionNameText}>
              {item.subscription_name}
            </Text>
          </View>
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              onPress={() => handleClearNotification(item.id)}
              style={styles.clearButton}
            >
              <MaterialCommunityIcons name="close" size={20} color="#666" />
            </TouchableOpacity>
            <View style={[styles.statusPill, { backgroundColor: '#F44336' }]}>
              <Text style={styles.statusText}>EXPIRED</Text>
            </View>
          </View>
        </View>
        <Text style={styles.cardTitle}>Expired {Math.abs(item.daysRemaining)} days ago</Text>
        <Text style={styles.cardSubtitle}>
          Expiry Date: {new Date(item.expiry_date).toLocaleDateString()}
        </Text>
      </Card.Content>
    </Card>
  ), [handleClearNotification]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16 }}>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Notifications',
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
      }} />
      
      <View style={styles.headerActionContainer}>
        <Button 
          mode="contained" 
          onPress={showAlerts}
          icon="bell-ring"
        >
          Show Alerts
        </Button>
      </View>
      
      <FlatList
        style={styles.list}
        data={[]}
        removeClippedSubviews={true}
        windowSize={5}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        ListHeaderComponent={
          <View>
            {expiringSubscriptions.length > 0 && (
              <View style={styles.section}>
                <Text variant="titleLarge" style={styles.sectionTitle}>Expiring Soon</Text>
                <Divider style={styles.divider} />
                
                {expiringSubscriptions.map(item => (
                  <View key={item.id} style={{ marginBottom: 12 }}>
                    {renderExpiringItem({ item })}
                  </View>
                ))}
              </View>
            )}
            
            {expiredSubscriptions.length > 0 && (
              <View style={styles.section}>
                <Text variant="titleLarge" style={styles.sectionTitle}>Recently Expired</Text>
                <Divider style={styles.divider} />
                
                {expiredSubscriptions.slice(0, 5).map(item => (
                  <View key={item.id} style={{ marginBottom: 12 }}>
                    {renderExpiredItem({ item })}
                  </View>
                ))}
                
                {expiredSubscriptions.length > 5 && (
                  <Button 
                    mode="text" 
                    onPress={() => router.push('/subscriptions?filter=expired')}
                  >
                    View All Expired ({expiredSubscriptions.length})
                  </Button>
                )}
              </View>
            )}
            
            {expiringSubscriptions.length === 0 && expiredSubscriptions.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text variant="titleMedium">No subscription notifications</Text>
                <Text variant="bodyMedium" style={{ textAlign: 'center', marginTop: 8 }}>
                  You don't have any subscriptions expiring soon or recently expired
                </Text>
                <Button 
                  mode="contained" 
                  onPress={() => router.push('/(subscription)/new')}
                  style={{ marginTop: 16 }}
                >
                  Add Subscription
                </Button>
              </View>
            )}
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActionContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  list: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  divider: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    flex: 1,
  },
  statusChip: {
    height: 28,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 48,
  },
  subscriptionNamePill: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: '#2196F3',
  },
  subscriptionNameText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  statusPill: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: '#2E7D32',
  },
  statusText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: '#757575',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 