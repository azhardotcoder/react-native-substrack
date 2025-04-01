import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, Menu, SegmentedButtons } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/context/ThemeContext';
import { ThemeColors, Theme } from '@/constants/ThemeColors';

export default function AnalysisScreen() {
  const { theme } = useTheme();
  const themeColors = ThemeColors[theme as Theme];
  const [subscriptionNames, setSubscriptionNames] = useState<string[]>([]);
  const [selectedSubscription, setSelectedSubscription] = useState<string>('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [subscriptionStats, setSubscriptionStats] = useState({
    totalBuyers: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    expiredSubscriptions: 0
  });

  useEffect(() => {
    fetchSubscriptionNames();
  }, []);

  useEffect(() => {
    if (selectedSubscription) {
      fetchSubscriptionStats();
    }
  }, [selectedSubscription]);

  const fetchSubscriptionNames = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from('subscriptions')
        .select('subscription_name')
        .eq('user_id', user?.id)
        .order('subscription_name');

      if (error) throw error;

      if (data) {
        const uniqueNames = Array.from(new Set(data.map(sub => sub.subscription_name)));
        setSubscriptionNames(['All', ...uniqueNames]);
        if (uniqueNames.length > 0) {
          setSelectedSubscription('All');
        }
      }
    } catch (error) {
      console.error('Error fetching subscription names:', error);
      Alert.alert('Error', 'Failed to fetch subscription names');
    }
  };

  const fetchSubscriptionStats = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      let query = supabase
        .from('subscriptions')
        .select('id, amount, expiry_date, subscription_name')
        .eq('user_id', user?.id);

      if (selectedSubscription !== 'All') {
        query = query.eq('subscription_name', selectedSubscription);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        const today = new Date();
        const stats = data.reduce((acc, sub) => {
          const expiryDate = new Date(sub.expiry_date);
          acc.totalBuyers++;
          
          console.log('Original amount:', sub.amount);
          console.log('Amount type:', typeof sub.amount);
          
          let price = 0;
          if (sub.amount) {
            const cleanPrice = String(sub.amount).replace(/[₹,]/g, '');
            console.log('Cleaned price:', cleanPrice);
            price = parseFloat(cleanPrice) || 0;
            console.log('Parsed price:', price);
          }
          acc.totalRevenue += price;
          console.log('Current total revenue:', acc.totalRevenue);
          
          if (sub.expiry_date && expiryDate instanceof Date && !isNaN(expiryDate.getTime())) {
            if (expiryDate < today) {
              acc.expiredSubscriptions++;
            } else {
              acc.activeSubscriptions++;
            }
          } else {
            acc.activeSubscriptions++;
          }
          
          return acc;
        }, {
          totalBuyers: 0,
          totalRevenue: 0,
          activeSubscriptions: 0,
          expiredSubscriptions: 0
        });

        stats.totalRevenue = Math.round(stats.totalRevenue * 100) / 100;
        setSubscriptionStats(stats);
      }
    } catch (error) {
      console.error('Error fetching subscription stats:', error);
      Alert.alert('Error', 'Failed to fetch subscription statistics');
    }
  };

  const renderAnalysisCard = (title: string, value: string | number, icon: string, colors: { bg: string, text: string }) => (
    <Card style={[styles.analysisCard, { backgroundColor: colors.bg }]}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name={icon as any} size={24} color="#FFFFFF" />
        </View>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.cardValue, { color: colors.text }]}>{value}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={[styles.header, { backgroundColor: '#FFFFFF' }]}>
      

      </View>

      <View style={styles.filterContainer}>
        <Text variant="titleMedium" style={[styles.filterLabel, { color: themeColors.textSecondary }]}>
          Select Subscription
        </Text>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMenuVisible(true)}
              icon="chevron-down"
              style={[styles.dropdownButtonContainer, { 
                borderColor: themeColors.textPrimary,
                backgroundColor: themeColors.background
              }]}
              contentStyle={styles.dropdownButton}
              labelStyle={[styles.dropdownButtonText, { color: themeColors.textPrimary }]}
            >
              {selectedSubscription || 'Select Subscription'}
            </Button>
          }
          style={styles.menu}
          contentStyle={[styles.menuContent, { backgroundColor: themeColors.background }]}
        >
          {subscriptionNames.map((name) => (
            <Menu.Item
              key={name}
              onPress={() => {
                setSelectedSubscription(name);
                setMenuVisible(false);
              }}
              title={name}
              titleStyle={{ color: themeColors.textPrimary }}
            />
          ))}
        </Menu>
      </View>

      <View style={styles.statsGrid}>
        {renderAnalysisCard('Total Buyers', subscriptionStats.totalBuyers, 'account-group', {
          bg: '#1C1F2C',
          text: '#FFFFFF'
        })}
        {renderAnalysisCard('Total Revenue', `₹${subscriptionStats.totalRevenue}`, 'currency-inr', {
          bg: '#2CB979',
          text: '#FFFFFF'
        })}
        {renderAnalysisCard('Active', subscriptionStats.activeSubscriptions, 'check-circle', {
          bg: '#6366F1',
          text: '#FFFFFF'
        })}
        {renderAnalysisCard('Expired', subscriptionStats.expiredSubscriptions, 'alert-circle', {
          bg: '#EF4444',
          text: '#FFFFFF'
        })}
      </View>

    
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    
    
    marginBottom: 16,
  },


  filterContainer: {
    paddingHorizontal: 20,  
    marginBottom: 16,
  },
  filterLabel: {
    marginBottom: 8,
  },
  dropdownButtonContainer: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
  },
  dropdownButton: {
    height: 48,
  },
  dropdownButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  analysisCard: {
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
  segmentedButtonContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  segmentedButtons: {
    backgroundColor: '#F1F5F9',
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
}); 