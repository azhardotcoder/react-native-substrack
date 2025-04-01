import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Platform, Alert, Dimensions, Linking } from 'react-native';
import { Text, Card, Button, Chip, Menu, Searchbar, useTheme, ActivityIndicator } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';
import SubscriptionModal from '../components/SubscriptionModal';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { isWithinInterval } from 'date-fns';
import { analyzeSubscription, getCustomerInsights, getPriceRecommendation } from '../../lib/deepseekService';
import SubscriptionList from '../../components/SubscriptionList';
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

const SubscriptionsScreen = () => {
  return (
    <View style={styles.container}>
      <SubscriptionList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SubscriptionsScreen; 