import React, { useState, useEffect } from 'react';
import { ScrollView, View, Alert, Platform } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import { sendTelegramNotification } from '../lib/telegramService';
import { useSubscriptionForm } from '../hooks/useSubscriptionForm';
import SubscriptionFormFields from './SubscriptionFormFields';
import { DatePickerField } from './DatePickerField';
import { commonStyles } from '../styles/commonStyles';

const SubscriptionForm = () => {
  const [showBuyDate, setShowBuyDate] = useState(false);
  const [showExpiryDate, setShowExpiryDate] = useState(false);

  const {
    formData,
    errors,
    loading,
    handleChange,
    handleSubmit
  } = useSubscriptionForm({
    initialData: {
      customerEmail: '',
      customerName: '',
      subscriptionName: '',
      phoneNumber: '',
      amount: '',
      validity: '1_month',
      buyDate: new Date(),
      expiryDate: new Date(),
    },
    onSubmit: async (data) => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Calculate expiry date based on validity if not custom
      let expiryDate = data.expiryDate;
      if (data.validity !== 'custom') {
        const buyDate = new Date(data.buyDate);
        switch (data.validity) {
          case '1_month':
            expiryDate = new Date(buyDate.setMonth(buyDate.getMonth() + 1));
            break;
          case '3_months':
            expiryDate = new Date(buyDate.setMonth(buyDate.getMonth() + 3));
            break;
          case '6_months':
            expiryDate = new Date(buyDate.setMonth(buyDate.getMonth() + 6));
            break;
          case '1_year':
            expiryDate = new Date(buyDate.setFullYear(buyDate.getFullYear() + 1));
            break;
        }
      }

      const { error } = await supabase.from('subscriptions').insert({
        customer_email: data.customerEmail,
        customer_name: data.customerName,
        subscription_name: data.subscriptionName,
        phone_number: data.phoneNumber,
        amount: parseFloat(data.amount),
        buy_date: data.buyDate.toISOString().split('T')[0],
        expiry_date: expiryDate.toISOString().split('T')[0],
        user_id: user.id
      }).select();

      if (error) throw error;

      try {
        await sendTelegramNotification({
          customerName: data.customerName,
          phoneNumber: data.phoneNumber,
          customerEmail: data.customerEmail,
          subscriptionName: data.subscriptionName,
          buyDate: data.buyDate.toISOString(),
          expiryDate: expiryDate.toISOString(),
          amount: parseFloat(data.amount)
        });
      } catch (telegramError) {
        console.error('Failed to send Telegram notification:', telegramError);
      }
      
      Alert.alert('Success', 'Subscription added successfully');
      router.back();
    }
  });

  // Update expiry date when validity changes
  useEffect(() => {
    if (formData.validity !== 'custom') {
      const buyDate = new Date(formData.buyDate);
      let expiryDate = new Date(buyDate);

      switch (formData.validity) {
        case '1_month':
          expiryDate.setMonth(buyDate.getMonth() + 1);
          break;
        case '3_months':
          expiryDate.setMonth(buyDate.getMonth() + 3);
          break;
        case '6_months':
          expiryDate.setMonth(buyDate.getMonth() + 6);
          break;
        case '1_year':
          expiryDate.setFullYear(buyDate.getFullYear() + 1);
          break;
      }

      handleChange('expiryDate', expiryDate);
    }
  }, [formData.validity, formData.buyDate]);

  return (
    <ScrollView 
      style={commonStyles.container}
      contentContainerStyle={commonStyles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <SubscriptionFormFields
        formData={formData}
        onChange={handleChange}
        errors={errors}
        showDateFields={formData.validity === 'custom'}
      />

      {formData.validity === 'custom' && (
        <>
          <View style={commonStyles.divider} />

          <View style={commonStyles.datesContainer}>
            <DatePickerField
              label="Purchase Date"
              value={formData.buyDate}
              onChange={(event, date) => {
                if (date) handleChange('buyDate', date);
              }}
              showPicker={showBuyDate}
              setShowPicker={setShowBuyDate}
              error={errors.buyDate}
              containerStyle={{ marginRight: 8 }}
            />

            <DatePickerField
              label="Expiry Date"
              value={formData.expiryDate}
              onChange={(event, date) => {
                if (date) handleChange('expiryDate', date);
              }}
              showPicker={showExpiryDate}
              setShowPicker={setShowExpiryDate}
              error={errors.expiryDate}
              containerStyle={{ marginLeft: 8 }}
            />
          </View>
        </>
      )}

      <Button 
        mode="contained" 
        onPress={handleSubmit}
        style={commonStyles.button}
        loading={loading}
        disabled={loading}
        contentStyle={commonStyles.buttonContent}
        labelStyle={commonStyles.buttonLabel}
      >
        Add Subscription
      </Button>
    </ScrollView>
  );
};

export default SubscriptionForm; 