import { Alert, Platform, AppState, AppStateStatus } from 'react-native';
import { supabase } from './supabase';
import { format, addDays } from 'date-fns';

// Types
export interface Subscription {
  id: string;
  user_id: string;
  customer_email: string;
  customer_name: string;
  subscription_name: string;
  phone_number: string;
  amount: number;
  buy_date: string;
  expiry_date: string;
}

// Get all expiring and expired subscriptions data
export async function getSubscriptionAlerts() {
  try {
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    if (!user) {
      console.log('No user logged in, cannot check subscriptions');
      return { expiringSubscriptions: [], expiredSubscriptions: [] };
    }

    // Get all subscriptions
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;
    if (!data || data.length === 0) {
      return { expiringSubscriptions: [], expiredSubscriptions: [] };
    }

    // Current date
    const today = new Date();
    
    // Check for subscriptions expiring in next 7 days
    const expiringSubscriptions = data.filter((sub: Subscription) => {
      const expiryDate = new Date(sub.expiry_date);
      const nextWeek = addDays(today, 7);
      
      return expiryDate > today && expiryDate <= nextWeek;
    });

    // Check for expired subscriptions
    const expiredSubscriptions = data.filter((sub: Subscription) => {
      const expiryDate = new Date(sub.expiry_date);
      return expiryDate < today;
    });

    return { expiringSubscriptions, expiredSubscriptions };
  } catch (error) {
    console.error('Error getting subscription alerts:', error);
    return { expiringSubscriptions: [], expiredSubscriptions: [] };
  }
}

// Check for subscriptions expiring soon and notify using simple Alert
export async function checkExpiringSubscriptions() {
  try {
    const { expiringSubscriptions, expiredSubscriptions } = await getSubscriptionAlerts();

    // Create alert message for expiring subscriptions
    if (expiringSubscriptions.length > 0) {
      showExpiringAlert(expiringSubscriptions);
      return true;
    }

    // Create alert message for expired subscriptions
    if (expiredSubscriptions.length > 0) {
      showExpiredAlert(expiredSubscriptions);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking expiring subscriptions:', error);
    return false;
  }
}

// Show alert for expiring subscriptions
function showExpiringAlert(subscriptions: Subscription[]) {
  try {
    const title = 'Subscriptions Expiring Soon';
    let message = '';

    if (subscriptions.length === 1) {
      const sub = subscriptions[0];
      message = `${sub.subscription_name} for ${sub.customer_name} expires on ${format(new Date(sub.expiry_date), 'dd MMM yyyy')}`;
    } else {
      message = `${subscriptions.length} subscriptions will expire in the next 7 days`;
    }

    Alert.alert(
      title,
      message,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') }
      ]
    );
  } catch (error) {
    console.error('Error showing expiring alert:', error);
  }
}

// Show alert for expired subscriptions
function showExpiredAlert(subscriptions: Subscription[]) {
  try {
    const title = 'Subscriptions Expired';
    let message = '';

    if (subscriptions.length === 1) {
      const sub = subscriptions[0];
      message = `${sub.subscription_name} for ${sub.customer_name} has expired on ${format(new Date(sub.expiry_date), 'dd MMM yyyy')}`;
    } else {
      message = `${subscriptions.length} subscriptions have expired`;
    }

    Alert.alert(
      title,
      message,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') }
      ]
    );
  } catch (error) {
    console.error('Error showing expired alert:', error);
  }
}

// Function to clear a notification
export async function clearNotification(id: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('subscriptions')
        .update({ notification_dismissed: true })
        .eq('id', id);
    }
    return true;
  } catch (error) {
    console.error('Error clearing notification:', error);
    return false;
  }
} 