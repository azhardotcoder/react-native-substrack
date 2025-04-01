import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Platform, Alert, Linking, Pressable, Animated, TouchableOpacity, ScrollView } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Text, Card, Button, Chip, Menu, Searchbar, useTheme, ActivityIndicator, Portal, Modal, Surface } from 'react-native-paper';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import SubscriptionModal from './SubscriptionModal';
import { sendWhatsAppMessage } from '../lib/whatsappService';
import { AlertMessages } from '../lib/alertMessages';
import { useTheme as useThemeContext } from '../context/ThemeContext';
import { ThemeColors } from '../constants/ThemeColors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
  status: 'active' | 'expired' | 'expiring_soon' | 'active_this_month';
  isActiveThisMonth: boolean;
  isExpiredThisMonth: boolean;
};

// Helper function to calculate validity period
const getValidityPeriod = (buyDate: string, expiryDate: string) => {
  const start = new Date(buyDate);
  const end = new Date(expiryDate);
  const monthsDiff = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();
  
  if (monthsDiff === 12) return '1 Year';
  if (monthsDiff === 6) return '6 Months';
  if (monthsDiff === 3) return '3 Months';
  return '1 Month';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  searchBar: {
    elevation: 2,
    borderRadius: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
    zIndex: 1,
  },
  filterGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 12,
    elevation: 2,
  },
  activeFilterButton: {
    backgroundColor: '#1A237E',
  },
  filterIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  cardContainer: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    elevation: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subscriptionNamePill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    maxWidth: '60%',
  },
  subscriptionNameText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  statusPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  details: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailIcon: {
    fontSize: 16,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dateBox: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
  },
  dateLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  whatsappButton: {
    flex: 1,
  },
  copyButton: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    margin: 20,
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalDetails: {
    marginBottom: 24,
  },
  modalDetailText: {
    fontSize: 16,
    marginBottom: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    minWidth: 100,
  },
  editButton: {
    backgroundColor: '#16BAC5',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearAllContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  clearAllButton: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  clearAllText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },
  expiredCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  activeCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#22C55E',
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuWrapper: {
    position: 'absolute',
    top: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    elevation: 4,
    minWidth: 180,
  },
  menuItemWrapper: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeMenuItemWrapper: {
    backgroundColor: '#F1F5F9',
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
  },
  activeMenuItemText: {
    color: '#1A237E',
  },
  menu: {
    width: '80%',
    alignSelf: 'center',
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
  },
  renewModalContent: {
    margin: 20,
    borderRadius: 24,
    padding: 24,
    width: '80%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  renewModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  renewOptionsContainer: {
    gap: 16,
  },
  currentPlanButton: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  currentPlanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  currentPlanValidity: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },
  renewOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  renewOptionButton: {
    width: '48%',
    aspectRatio: 1.2,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  renewOptionDuration: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  renewOptionLabel: {
    fontSize: 13,
  },
  cancelButton: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

interface RenewModalProps {
  visible: boolean;
  onDismiss: () => void;
  onRenew: (subscription: Subscription, renewalPeriod: string) => void;
  subscription: Subscription | null;
  colors: any;
}

const RenewModal = ({ visible, onDismiss, onRenew, subscription, colors }: RenewModalProps) => {
  if (!subscription) return null;
  
  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={[styles.renewModalContent, { backgroundColor: colors.background }]}
    >
      <View>
        <Text style={[styles.renewModalTitle, { color: colors.textPrimary }]}>
          Renew Subscription
        </Text>
        
        <View style={styles.renewOptionsContainer}>
          {/* Continue with current plan button */}
          <TouchableOpacity 
            style={[styles.currentPlanButton, { backgroundColor: colors.primary }]}
            onPress={() => onRenew(subscription, 'same')}
          >
            <Text style={styles.currentPlanButtonText}>Continue with current plan</Text>
            <Text style={styles.currentPlanValidity}>
              {getValidityPeriod(subscription.buy_date, subscription.expiry_date)}
            </Text>
          </TouchableOpacity>

          {/* Grid of other options */}
          <View style={styles.renewOptionsGrid}>
            <TouchableOpacity 
              style={[styles.renewOptionButton, { backgroundColor: colors.dateBoxBackground }]}
              onPress={() => onRenew(subscription, '1_month')}
            >
              <Text style={[styles.renewOptionDuration, { color: colors.textPrimary }]}>1</Text>
              <Text style={[styles.renewOptionLabel, { color: colors.textSecondary }]}>Month</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.renewOptionButton, { backgroundColor: colors.dateBoxBackground }]}
              onPress={() => onRenew(subscription, '3_months')}
            >
              <Text style={[styles.renewOptionDuration, { color: colors.textPrimary }]}>3</Text>
              <Text style={[styles.renewOptionLabel, { color: colors.textSecondary }]}>Months</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.renewOptionButton, { backgroundColor: colors.dateBoxBackground }]}
              onPress={() => onRenew(subscription, '6_months')}
            >
              <Text style={[styles.renewOptionDuration, { color: colors.textPrimary }]}>6</Text>
              <Text style={[styles.renewOptionLabel, { color: colors.textSecondary }]}>Months</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.renewOptionButton, { backgroundColor: colors.dateBoxBackground }]}
              onPress={() => onRenew(subscription, '1_year')}
            >
              <Text style={[styles.renewOptionDuration, { color: colors.textPrimary }]}>1</Text>
              <Text style={[styles.renewOptionLabel, { color: colors.textSecondary }]}>Year</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.cancelButton, { borderColor: colors.textSecondary }]}
          onPress={onDismiss}
        >
          <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const SubscriptionList = () => {
  const { theme } = useThemeContext();
  const colors = ThemeColors[theme];
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'expired' | 'active_this_month' | 'expired_this_month'>('all');
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardScale] = useState(new Animated.Value(1));
  const [validityFilter, setValidityFilter] = useState<'all' | '1_month' | '3_months' | '6_months' | '1_year'>('all');
  const [subscriptionTypeFilter, setSubscriptionTypeFilter] = useState<string>('all');
  const [validityMenuVisible, setValidityMenuVisible] = useState(false);
  const [subscriptionMenuVisible, setSubscriptionMenuVisible] = useState(false);
  const [renewModalVisible, setRenewModalVisible] = useState(false);

  const handleCopyDetails = useCallback(async (subscription: Subscription) => {
    try {
      const details = `
Subscription: ${subscription.subscription_name}
Customer: ${subscription.customer_name}
Phone: ${subscription.phone_number}
Amount: ₹${subscription.amount}
Purchase Date: ${format(new Date(subscription.buy_date), 'dd MMM yyyy')}
Expiry Date: ${format(new Date(subscription.expiry_date), 'dd MMM yyyy')}
`;
      await Clipboard.setStringAsync(details.trim());
      Alert.alert('Success', 'Subscription details copied to clipboard');
    } catch (error) {
      console.error('Error copying details:', error);
      Alert.alert('Error', 'Failed to copy subscription details');
    }
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      if (!data) {
        setSubscriptions([]);
        return;
      }

      // Calculate status and filter data
      const today = new Date();
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      const processedData = data.map(sub => {
        const expiryDate = new Date(sub.expiry_date);
        const buyDate = new Date(sub.buy_date);
        
        let status: 'active' | 'expired' | 'expiring_soon' | 'active_this_month';
        if (expiryDate < today) {
          status = 'expired';
        } else {
          status = 'active';
        }

        const isActiveThisMonth = buyDate <= monthEnd && expiryDate >= monthStart;
        
        return { 
          ...sub, 
          status,
          isActiveThisMonth,
          isExpiredThisMonth: expiryDate < today,
        };
      });

      setSubscriptions(processedData);
    } catch (error: any) {
      console.error('Error in fetchSubscriptions:', error.message);
      Alert.alert('Error', 'Failed to fetch subscriptions. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSubscriptions();
  };

  const getFilterLabel = useCallback((filterType: string) => {
    switch(filterType) {
      case 'all': return 'All Subscriptions';
      case 'active': return 'Active';
      case 'expired': return 'Expired';
      case 'active_this_month': return 'Active This Month';
      case 'expired_this_month': return 'Expired This Month';
      default: return filterType;
    }
  }, []);

  // Get unique subscription names
  const subscriptionTypes = useMemo(() => {
    const types = new Set(subscriptions.map(sub => sub.subscription_name));
    return ['all', ...Array.from(types)];
  }, [subscriptions]);

  const getValidityLabel = (validity: string) => {
    switch(validity) {
      case 'all': return 'All Validity';
      case '1_month': return '1 Month';
      case '3_months': return '3 Months';
      case '6_months': return '6 Months';
      case '1_year': return '1 Year';
      default: return validity;
    }
  };

  const getSubscriptionTypeLabel = (type: string) => {
    return type === 'all' ? 'All Services' : type;
  };

  const filteredSubscriptions = useMemo(() => {
    return subscriptions
      .filter(sub => {
        // Search filter
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          sub.subscription_name.toLowerCase().includes(searchLower) ||
          sub.customer_name.toLowerCase().includes(searchLower) ||
          sub.phone_number.includes(searchQuery);

        if (!matchesSearch) return false;

        // Status filter
        if (filter !== 'all' && sub.status !== filter) return false;

        // Validity filter
        if (validityFilter !== 'all') {
          const validity = getValidityPeriod(sub.buy_date, sub.expiry_date).replace(' ', '_').toLowerCase();
          if (validity !== validityFilter) return false;
        }

        // Subscription type filter
        if (subscriptionTypeFilter !== 'all' && sub.subscription_name !== subscriptionTypeFilter) return false;

        return true;
      })
      .sort((a, b) => new Date(b.buy_date).getTime() - new Date(a.buy_date).getTime());
  }, [subscriptions, searchQuery, filter, validityFilter, subscriptionTypeFilter]);

  const handleWhatsApp = useCallback((subscription: Subscription) => {
    sendWhatsAppMessage(subscription.phone_number, {
      customerName: subscription.customer_name,
      subscriptionName: subscription.subscription_name,
      expiryDate: new Date(subscription.expiry_date).toLocaleDateString(),
      amount: subscription.amount
    });
  }, []);

  // Add animation functions
  const animatePress = () => {
    Animated.sequence([
      Animated.timing(cardScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleRenewSubscription = async (subscription: Subscription, renewalPeriod: string) => {
    try {
      const today = new Date();
      const currentExpiryDate = new Date(subscription.expiry_date);
      const isExpired = currentExpiryDate < today;
      
      // If subscription is expired, start from today
      // If subscription is active, start from current expiry date
      const startDate = isExpired ? today : currentExpiryDate;
      const newExpiryDate = new Date(startDate);
      
      switch(renewalPeriod) {
        case 'same':
          const currentValidity = getValidityPeriod(subscription.buy_date, subscription.expiry_date);
          switch(currentValidity) {
            case '1 Month':
              newExpiryDate.setMonth(startDate.getMonth() + 1);
              break;
            case '3 Months':
              newExpiryDate.setMonth(startDate.getMonth() + 3);
              break;
            case '6 Months':
              newExpiryDate.setMonth(startDate.getMonth() + 6);
              break;
            case '1 Year':
              newExpiryDate.setFullYear(startDate.getFullYear() + 1);
              break;
          }
          break;
        case '1_month':
          newExpiryDate.setMonth(startDate.getMonth() + 1);
          break;
        case '3_months':
          newExpiryDate.setMonth(startDate.getMonth() + 3);
          break;
        case '6_months':
          newExpiryDate.setMonth(startDate.getMonth() + 6);
          break;
        case '1_year':
          newExpiryDate.setFullYear(startDate.getFullYear() + 1);
          break;
      }

      const { error } = await supabase
        .from('subscriptions')
        .update({
          buy_date: isExpired ? today.toISOString() : subscription.buy_date,
          expiry_date: newExpiryDate.toISOString()
        })
        .eq('id', subscription.id);

      if (error) throw error;

      setModalVisible(false);
      fetchSubscriptions();
      Alert.alert('Success', 'Subscription renewed successfully');
    } catch (error: any) {
      console.error('Error renewing subscription:', error.message);
      Alert.alert('Error', 'Failed to renew subscription');
    }
  };

  const showRenewOptions = (subscription: Subscription) => {
    setModalVisible(false);
    setRenewModalVisible(true);
  };

  const renderSubscription = ({ item }: { item: Subscription }) => (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          transform: [{ scale: cardScale }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => {
          animatePress();
          setSelectedSubscription(item);
          setModalVisible(true);
        }}
        activeOpacity={0.95}
      >
        <Card 
          style={[
            styles.card,
            item.status === 'expired' 
              ? [styles.expiredCard, { backgroundColor: theme === 'dark' ? colors.cardBackgroundExpired : '#FFF1F0' }]
              : [styles.activeCard, { backgroundColor: theme === 'dark' ? colors.cardBackgroundActive : '#F6FFED' }]
          ]}
        >
          <Card.Content style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={[styles.subscriptionNamePill, { backgroundColor: colors.subscriptionPill }]}>
                <Text style={styles.subscriptionNameText}>
                  {item.subscription_name}
                </Text>
              </View>
              <View style={[
                styles.statusPill,
                {
                  backgroundColor: item.status === 'expired' ? colors.statusExpired : colors.statusActive
                }
              ]}>
                <Text style={styles.statusText}>
                  {item.status.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={[styles.details, { backgroundColor: colors.dateBoxBackground }]}>
              <View style={styles.detailRow}>
                <View style={[styles.detailIconContainer, { backgroundColor: colors.iconBackground }]}>
                  <Text style={styles.detailIcon}>👤</Text>
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Customer</Text>
                  <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{item.customer_name}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={[styles.detailIconContainer, { backgroundColor: colors.iconBackground }]}>
                  <Text style={styles.detailIcon}>📱</Text>
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Phone</Text>
                  <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{item.phone_number}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={[styles.detailIconContainer, { backgroundColor: colors.iconBackground }]}>
                  <Text style={styles.detailIcon}>💰</Text>
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Amount</Text>
                  <Text style={[styles.detailValue, { color: colors.textPrimary }]}>₹{item.amount}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={[styles.detailIconContainer, { backgroundColor: colors.iconBackground }]}>
                  <Text style={styles.detailIcon}>⏳</Text>
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Validity</Text>
                  <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                    {getValidityPeriod(item.buy_date, item.expiry_date)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.dateContainer}>
              <View style={[styles.dateBox, { backgroundColor: colors.dateBoxBackground }]}>
                <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>Purchase Date</Text>
                <Text style={[styles.dateValue, { color: colors.textPrimary }]}>
                  {format(new Date(item.buy_date), 'dd MMM yyyy')}
                </Text>
              </View>
              <View style={[styles.dateBox, { backgroundColor: colors.dateBoxBackground }]}>
                <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>Expiry Date</Text>
                <Text style={[styles.dateValue, { color: colors.textPrimary }]}>
                  {format(new Date(item.expiry_date), 'dd MMM yyyy')}
                </Text>
              </View>
            </View>

            <View style={styles.actions}>
              <Button
                mode="contained"
                onPress={() => handleWhatsApp(item)}
                icon="whatsapp"
                style={[styles.whatsappButton, { backgroundColor: colors.whatsapp }]}
              >
                WhatsApp
              </Button>
              <Button
                mode="contained"
                onPress={() => handleCopyDetails(item)}
                icon="content-copy"
                style={[styles.copyButton, { backgroundColor: colors.copyButton }]}
              >
                Copy
              </Button>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );

  const clearAllFilters = () => {
    setValidityFilter('all');
    setSubscriptionTypeFilter('all');
    setSearchQuery('');
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Searchbar
          placeholder="Search subscriptions..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchBar, { backgroundColor: colors.dateBoxBackground }]}
          inputStyle={{ color: colors.textPrimary }}
          iconColor={colors.textPrimary}
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={[styles.filterContainer, { backgroundColor: colors.background }]}>
        <View style={styles.filterGroup}>
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              { backgroundColor: colors.dateBoxBackground },
              validityFilter !== 'all' && [styles.activeFilterButton, { backgroundColor: colors.primary }]
            ]} 
            onPress={() => setValidityMenuVisible(true)}
          >
            <Text style={styles.filterIcon}>⏳</Text>
            <Text style={[
              styles.filterText, 
              { color: colors.textPrimary },
              validityFilter !== 'all' && styles.activeFilterText
            ]}>
              {getValidityLabel(validityFilter)}
            </Text>
          </TouchableOpacity>
          {validityFilter !== 'all' && (
            <TouchableOpacity 
              style={[styles.clearButton, { backgroundColor: colors.dateBoxBackground }]}
              onPress={() => setValidityFilter('all')}
            >
              <Text style={[styles.clearButtonText, { color: colors.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterGroup}>
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              { backgroundColor: colors.dateBoxBackground },
              subscriptionTypeFilter !== 'all' && [styles.activeFilterButton, { backgroundColor: colors.primary }]
            ]} 
            onPress={() => setSubscriptionMenuVisible(true)}
          >
            <Text style={styles.filterIcon}>📱</Text>
            <Text style={[
              styles.filterText, 
              { color: colors.textPrimary },
              subscriptionTypeFilter !== 'all' && styles.activeFilterText
            ]}>
              {getSubscriptionTypeLabel(subscriptionTypeFilter)}
            </Text>
          </TouchableOpacity>
          {subscriptionTypeFilter !== 'all' && (
            <TouchableOpacity 
              style={[styles.clearButton, { backgroundColor: colors.dateBoxBackground }]}
              onPress={() => setSubscriptionTypeFilter('all')}
            >
              <Text style={[styles.clearButtonText, { color: colors.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {(validityFilter !== 'all' || subscriptionTypeFilter !== 'all' || searchQuery) && (
        <View style={styles.clearAllContainer}>
          <TouchableOpacity 
            style={styles.clearAllButton}
            onPress={clearAllFilters}
          >
            <Text style={styles.clearAllText}>Clear All Filters</Text>
          </TouchableOpacity>
        </View>
      )}

      <Portal>
        {(validityMenuVisible || subscriptionMenuVisible) && (
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.menuOverlay}
              activeOpacity={1}
              onPress={() => {
                setValidityMenuVisible(false);
                setSubscriptionMenuVisible(false);
              }}
            />
            
            {validityMenuVisible && (
              <View style={[styles.menuWrapper, { left: 16 }]}>
                {['all', '1_month', '3_months', '6_months', '1_year'].map((period) => (
                  <TouchableOpacity
                    key={period}
                    style={[
                      styles.menuItemWrapper,
                      validityFilter === period && styles.activeMenuItemWrapper
                    ]}
                    onPress={() => {
                      setValidityFilter(period as any);
                      setValidityMenuVisible(false);
                    }}
                  >
                    <Text style={[
                      styles.menuItemText,
                      validityFilter === period && styles.activeMenuItemText
                    ]}>
                      {getValidityLabel(period)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {subscriptionMenuVisible && (
              <View style={[styles.menuWrapper, { right: 16 }]}>
                {subscriptionTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.menuItemWrapper,
                      subscriptionTypeFilter === type && styles.activeMenuItemWrapper
                    ]}
                    onPress={() => {
                      setSubscriptionTypeFilter(type);
                      setSubscriptionMenuVisible(false);
                    }}
                  >
                    <Text style={[
                      styles.menuItemText,
                      subscriptionTypeFilter === type && styles.activeMenuItemText
                    ]}>
                      {getSubscriptionTypeLabel(type)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </Portal>

      {loading ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} size="large" />
      ) : (
        <FlatList
          data={filteredSubscriptions}
          renderItem={renderSubscription}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          removeClippedSubviews={true}
          windowSize={5}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          }
        />
      )}

      <RenewModal
        visible={renewModalVisible}
        onDismiss={() => setRenewModalVisible(false)}
        onRenew={handleRenewSubscription}
        subscription={selectedSubscription}
        colors={colors}
      />

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={[styles.modalContent, { backgroundColor: colors.background }]}
        >
          {selectedSubscription && (
            <View>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                {selectedSubscription.subscription_name}
              </Text>
              <View style={styles.modalDetails}>
                <Text style={[styles.modalDetailText, { color: colors.textPrimary }]}>
                  Customer: {selectedSubscription.customer_name}
                </Text>
                <Text style={[styles.modalDetailText, { color: colors.textPrimary }]}>
                  Phone: {selectedSubscription.phone_number}
                </Text>
                <Text style={[styles.modalDetailText, { color: colors.textPrimary }]}>
                  Amount: ₹{selectedSubscription.amount}
                </Text>
                <Text style={[styles.modalDetailText, { color: colors.textPrimary }]}>
                  Purchase Date: {format(new Date(selectedSubscription.buy_date), 'dd MMM yyyy')}
                </Text>
                <Text style={[styles.modalDetailText, { color: colors.textPrimary }]}>
                  Expiry Date: {format(new Date(selectedSubscription.expiry_date), 'dd MMM yyyy')}
                </Text>
              </View>
              <View style={styles.modalActions}>
                <Button
                  mode="contained"
                  onPress={() => showRenewOptions(selectedSubscription)}
                  style={[styles.modalButton, { backgroundColor: colors.primary }]}
                  icon="refresh"
                >
                  Renew
                </Button>
                <Button
                  mode="contained"
                  onPress={() => {
                    router.push(`/subscription/${selectedSubscription.id}`);
                    setModalVisible(false);
                  }}
                  style={[styles.modalButton, styles.editButton]}
                  icon="pencil"
                >
                  Edit
                </Button>
                <Button
                  mode="contained"
                  onPress={() => {
                    Alert.alert(
                      AlertMessages.titles.deleteSubscription,
                      AlertMessages.errors.deleteConfirmation,
                      [
                        {
                          text: AlertMessages.buttons.cancel,
                          style: 'cancel',
                        },
                        {
                          text: AlertMessages.buttons.delete,
                          style: 'destructive',
                          onPress: async () => {
                            try {
                              const { error } = await supabase
                                .from('subscriptions')
                                .delete()
                                .eq('id', selectedSubscription.id);
                              
                              if (error) throw error;
                              
                              setModalVisible(false);
                              fetchSubscriptions();
                              Alert.alert('Success', AlertMessages.errors.deleteSuccess);
                            } catch (error: any) {
                              console.error('Error deleting subscription:', error.message);
                              Alert.alert('Error', AlertMessages.errors.deleteError);
                            }
                          },
                        },
                      ],
                      { cancelable: true }
                    );
                  }}
                  style={[styles.modalButton, styles.deleteButton]}
                  icon="delete"
                  textColor="white"
                >
                  Delete
                </Button>
              </View>
            </View>
          )}
        </Modal>
      </Portal>
    </View>
  );
};

export default SubscriptionList; 