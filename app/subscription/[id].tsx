import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';

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
};

export default function EditSubscription() {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [showBuyDatePicker, setShowBuyDatePicker] = useState(false);
  const [showExpiryDatePicker, setShowExpiryDatePicker] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, [id]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setSubscription(data);
    } catch (error: any) {
      console.error('Error fetching subscription:', error.message);
      Alert.alert('Error', 'Failed to fetch subscription details');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!subscription) return;

    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          customer_email: subscription.customer_email,
          customer_name: subscription.customer_name,
          subscription_name: subscription.subscription_name,
          phone_number: subscription.phone_number,
          amount: subscription.amount,
          buy_date: subscription.buy_date,
          expiry_date: subscription.expiry_date,
        })
        .eq('id', id);

      if (error) throw error;

      Alert.alert('Success', 'Subscription updated successfully');
      router.back();
    } catch (error: any) {
      console.error('Error updating subscription:', error.message);
      Alert.alert('Error', 'Failed to update subscription');
    }
  };

  if (loading || !subscription) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Edit Subscription</Text>

        <TextInput
          label="Subscription Name"
          value={subscription.subscription_name}
          onChangeText={(text) => setSubscription({ ...subscription, subscription_name: text })}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Customer Name"
          value={subscription.customer_name}
          onChangeText={(text) => setSubscription({ ...subscription, customer_name: text })}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Customer Email"
          value={subscription.customer_email}
          onChangeText={(text) => setSubscription({ ...subscription, customer_email: text })}
          style={styles.input}
          mode="outlined"
          keyboardType="email-address"
        />

        <TextInput
          label="Phone Number"
          value={subscription.phone_number}
          onChangeText={(text) => setSubscription({ ...subscription, phone_number: text })}
          style={styles.input}
          mode="outlined"
          keyboardType="phone-pad"
        />

        <TextInput
          label="Amount"
          value={subscription.amount.toString()}
          onChangeText={(text) => setSubscription({ ...subscription, amount: parseFloat(text) || 0 })}
          style={styles.input}
          mode="outlined"
          keyboardType="numeric"
        />

        <Button
          mode="outlined"
          onPress={() => setShowBuyDatePicker(true)}
          style={styles.dateButton}
        >
          Purchase Date: {format(new Date(subscription.buy_date), 'dd MMM yyyy')}
        </Button>

        {showBuyDatePicker && (
          <DateTimePicker
            value={new Date(subscription.buy_date)}
            mode="date"
            onChange={(event, date) => {
              setShowBuyDatePicker(false);
              if (date) {
                setSubscription({ ...subscription, buy_date: date.toISOString() });
              }
            }}
          />
        )}

        <Button
          mode="outlined"
          onPress={() => setShowExpiryDatePicker(true)}
          style={styles.dateButton}
        >
          Expiry Date: {format(new Date(subscription.expiry_date), 'dd MMM yyyy')}
        </Button>

        {showExpiryDatePicker && (
          <DateTimePicker
            value={new Date(subscription.expiry_date)}
            mode="date"
            onChange={(event, date) => {
              setShowExpiryDatePicker(false);
              if (date) {
                setSubscription({ ...subscription, expiry_date: date.toISOString() });
              }
            }}
          />
        )}

        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={handleUpdate}
            style={[styles.button, { backgroundColor: '#16BAC5' }]}
          >
            Update Subscription
          </Button>
          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={styles.button}
          >
            Cancel
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFE9F4',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    color: '#171D1C',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  dateButton: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
  },
}); 