import { Linking, Alert } from 'react-native';

interface WhatsAppMessage {
  customerName: string;
  subscriptionName: string;
  expiryDate: string;
  amount: number;
}

export const sendWhatsAppMessage = async (phoneNumber: string, message: WhatsAppMessage) => {
  if (!phoneNumber) {
    Alert.alert('Error', 'No phone number available');
    return;
  }
  
  const formattedPhoneNumber = phoneNumber.replace(/\D/g, '');
  if (formattedPhoneNumber.length < 10) {
    Alert.alert('Error', 'Please enter a valid phone number');
    return;
  }

  const formattedMessage = `Hi ${message.customerName}, your ${message.subscriptionName} subscription is expiring on ${message.expiryDate}. Amount: ₹${message.amount}`;
  const url = `https://wa.me/91${formattedPhoneNumber}?text=${encodeURIComponent(formattedMessage)}`;
  
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'WhatsApp is not installed');
    }
  } catch (error) {
    console.error('Error opening WhatsApp:', error);
    Alert.alert('Error', 'Failed to open WhatsApp');
  }
}; 