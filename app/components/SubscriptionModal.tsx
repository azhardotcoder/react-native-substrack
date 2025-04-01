import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Linking, Platform, Alert } from 'react-native';
import { Modal, Portal, Text, Button, TextInput, Surface } from 'react-native-paper';
import { supabase } from '../../lib/supabase';
import DateTimePicker from '@react-native-community/datetimepicker';

type Subscription = {
  id: string;
  customer_email: string;
  customer_name: string;
  subscription_name: string;
  phone_number: string;
  amount: number;
  buy_date: string;
  expiry_date: string;
  status: 'active' | 'expired' | 'expiring_soon' | 'active_this_month';
  isActiveThisMonth: boolean;
  user_id: string;
};

type Props = {
  visible: boolean;
  subscription: Subscription | null;
  onDismiss: () => void;
  onUpdate: () => void;
};

export default function SubscriptionModal({ visible, subscription, onDismiss, onUpdate }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Subscription | null>(subscription);
  const [showBuyDatePicker, setShowBuyDatePicker] = useState(false);
  const [showExpiryDatePicker, setShowExpiryDatePicker] = useState(false);

  useEffect(() => {
    setFormData(subscription);
  }, [subscription]);

  const handleUpdate = async () => {
    if (!formData) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('subscriptions')
        .update({
          customer_email: formData.customer_email,
          customer_name: formData.customer_name,
          subscription_name: formData.subscription_name,
          phone_number: formData.phone_number,
          amount: formData.amount,
          buy_date: formData.buy_date,
          expiry_date: formData.expiry_date,
        })
        .eq('id', formData.id);

      if (error) throw error;
      
      onUpdate();
      onDismiss();
    } catch (error: any) {
      console.error('Error updating subscription:', error.message);
      alert('Failed to update subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    if (!formData?.phone_number) {
      Alert.alert('Error', 'Please add a phone number first');
      return;
    }
    
    const phoneNumber = formData.phone_number.replace(/\D/g, '');
    if (phoneNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    const expiryDate = new Date(formData.expiry_date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    const message = 
`Hi ${formData.customer_name},

Your ${formData.subscription_name} subscription is expiring on ${expiryDate}.

Amount: ₹${formData.amount}

Thank you for your business!`;

    const url = `https://wa.me/91${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        }
        Alert.alert('Error', 'WhatsApp is not installed on your device');
      })
      .catch(err => {
        console.error('Error opening WhatsApp:', err);
        Alert.alert('Error', 'Failed to open WhatsApp. Please try again.');
      });
  };

  if (!formData) return null;

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <ScrollView>
          <Surface style={styles.surface}>
            <Text variant="titleLarge" style={styles.title}>Subscription Details</Text>

            <TextInput
              label="Subscription Name"
              value={formData.subscription_name}
              onChangeText={text => setFormData({ ...formData, subscription_name: text })}
              style={styles.input}
            />

            <TextInput
              label="Customer Name"
              value={formData.customer_name}
              onChangeText={text => setFormData({ ...formData, customer_name: text })}
              style={styles.input}
            />

            <TextInput
              label="Customer Email"
              value={formData.customer_email}
              onChangeText={text => setFormData({ ...formData, customer_email: text })}
              style={styles.input}
              keyboardType="email-address"
            />

            <TextInput
              label="Phone Number"
              value={formData.phone_number}
              onChangeText={text => setFormData({ ...formData, phone_number: text })}
              style={styles.input}
              keyboardType="phone-pad"
            />

            <TextInput
              label="Amount"
              value={formData.amount.toString()}
              onChangeText={text => setFormData({ ...formData, amount: parseFloat(text) || 0 })}
              style={styles.input}
              keyboardType="numeric"
            />

            <Button 
              onPress={() => setShowBuyDatePicker(true)}
              mode="outlined"
              style={styles.dateButton}
            >
              Buy Date: {new Date(formData.buy_date).toLocaleDateString()}
            </Button>

            <Button 
              onPress={() => setShowExpiryDatePicker(true)}
              mode="outlined"
              style={styles.dateButton}
            >
              Expiry Date: {new Date(formData.expiry_date).toLocaleDateString()}
            </Button>

            {Platform.OS === 'ios' ? (
              (showBuyDatePicker || showExpiryDatePicker) && (
                <DateTimePicker
                  value={new Date(showBuyDatePicker ? formData.buy_date : formData.expiry_date)}
                  mode="date"
                  onChange={(event, date) => {
                    if (date) {
                      setFormData({
                        ...formData,
                        [showBuyDatePicker ? 'buy_date' : 'expiry_date']: date.toISOString(),
                      });
                    }
                  }}
                />
              )
            ) : (
              <>
                {showBuyDatePicker && (
                  <DateTimePicker
                    value={new Date(formData.buy_date)}
                    mode="date"
                    onChange={(event, date) => {
                      setShowBuyDatePicker(false);
                      if (date) {
                        setFormData({
                          ...formData,
                          buy_date: date.toISOString(),
                        });
                      }
                    }}
                  />
                )}
                {showExpiryDatePicker && (
                  <DateTimePicker
                    value={new Date(formData.expiry_date)}
                    mode="date"
                    onChange={(event, date) => {
                      setShowExpiryDatePicker(false);
                      if (date) {
                        setFormData({
                          ...formData,
                          expiry_date: date.toISOString(),
                        });
                      }
                    }}
                  />
                )}
              </>
            )}

            <View style={styles.buttonContainer}>
              <Button 
                mode="contained"
                onPress={handleWhatsApp}
                icon="whatsapp"
                style={[styles.button, { backgroundColor: '#25D366' }]}
              >
                WhatsApp
              </Button>

              <Button 
                mode="contained"
                onPress={handleUpdate}
                loading={loading}
                style={styles.button}
              >
                Update
              </Button>
            </View>
          </Surface>
        </ScrollView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    margin: 20,
    maxHeight: '90%',
  },
  surface: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
  },
  dateButton: {
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    minWidth: 120,
  },
}); 