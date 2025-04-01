import { supabase } from './supabase';
import { generateResponse } from './huggingfaceService';

enum ChatIntent {
  REVENUE_QUERY,
  ACTIVE_SUBSCRIPTIONS,
  FORM_FILLING,
  GENERAL_QUERY
}

const detectIntent = (message: string): ChatIntent => {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('revenue') || lowerMsg.includes('earning') || lowerMsg.includes('income')) {
    return ChatIntent.REVENUE_QUERY;
  } else if (lowerMsg.includes('active subscription') || lowerMsg.includes('current subscription')) {
    return ChatIntent.ACTIVE_SUBSCRIPTIONS;
  } else if (
    (lowerMsg.includes('add') || lowerMsg.includes('create') || lowerMsg.includes('new')) && 
    (lowerMsg.includes('subscriber') || lowerMsg.includes('customer') || lowerMsg.includes('subscription'))
  ) {
    return ChatIntent.FORM_FILLING;
  }
  
  return ChatIntent.GENERAL_QUERY;
};

export const processChatMessage = async (message: string, chatHistory: string = "") => {
  const intent = detectIntent(message);
  
  switch (intent) {
    case ChatIntent.REVENUE_QUERY:
      return await getRevenueData();
    
    case ChatIntent.ACTIVE_SUBSCRIPTIONS:
      return await getActiveSubscriptions();
    
    case ChatIntent.FORM_FILLING:
      return await extractSubscriberData(message);
    
    case ChatIntent.GENERAL_QUERY:
    default:
      return await generateResponse(message, chatHistory);
  }
};

const getRevenueData = async () => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('amount');
  
  if (error) {
    console.error("Supabase error:", error);
    return "I couldn't fetch the revenue data at this moment.";
  }
  
  const totalRevenue = data.reduce((sum, item) => sum + Number(item.amount), 0);
  return `The total revenue from all subscriptions is ₹${totalRevenue.toLocaleString()}.`;
};

const getActiveSubscriptions = async () => {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('subscriptions')
    .select('id')
    .gte('expiry_date', today);
  
  if (error) {
    console.error("Supabase error:", error);
    return "I couldn't fetch the active subscriptions at this moment.";
  }
  
  return `You currently have ${data.length} active subscriptions.`;
};

const extractSubscriberData = async (message: string) => {
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const phonePattern = /(\+\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const namePattern = /(?:name is|for|customer|subscriber|client)\s+([A-Za-z]+\s+[A-Za-z]+)/i;
  
  const emailMatch = message.match(emailPattern);
  const phoneMatch = message.match(phonePattern);
  const nameMatch = message.match(namePattern);
  
  const subscriberData: any = {};
  
  if (emailMatch) subscriberData.customer_email = emailMatch[0];
  if (phoneMatch) subscriberData.phone_number = phoneMatch[0].replace(/\D/g, '');
  if (nameMatch) subscriberData.customer_name = nameMatch[1];
  
  if (Object.keys(subscriberData).length > 0) {
    return {
      type: "FORM_DATA",
      message: "I found some subscriber information. Would you like me to create a new subscription with these details?",
      data: subscriberData
    };
  }
  
  return "I couldn't extract enough information to fill the subscription form. Please provide details like name, email, and phone number.";
};

const getSubscriptionOverview = async () => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*');

    if (error) throw error;

    const today = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(today.getDate() + 7);

    const overview = {
      total: data.length,
      active: 0,
      expired: 0,
      revenue: 0,
      categories: {},
      expiring: []
    };

    data.forEach(sub => {
      const expiryDate = new Date(sub.expiry_date);
      const amount = parseFloat(String(sub.amount).replace(/[₹,]/g, '')) || 0;

      if (expiryDate > today) {
        overview.active++;
        overview.revenue += amount;
      } else {
        overview.expired++;
      }

      // Track categories
      if (sub.subscription_name) {
        overview.categories[sub.subscription_name] = (overview.categories[sub.subscription_name] || 0) + 1;
      }

      // Track expiring subscriptions
      if (expiryDate > today && expiryDate <= oneWeekFromNow) {
        overview.expiring.push(sub);
      }
    });

    return overview;
  } catch (error) {
    console.error('Error getting subscription overview:', error);
    throw error;
  }
};

const searchCustomerSubscriptions = async (query: { type: string, value: string }) => {
  try {
    let data;
    const { error } = await supabase
      .from('subscriptions')
      .select('*')
      .ilike(
        query.type === 'email' ? 'customer_email' :
        query.type === 'phone' ? 'phone_number' : 'customer_name',
        `%${query.value}%`
      );

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error searching customer subscriptions:', error);
    throw error;
  }
};

const extractSearchQuery = (message: string) => {
  const emailMatch = message.match(/email:\s*([^\s]+@[^\s]+)/i);
  const phoneMatch = message.match(/phone:\s*(\d+)/i);
  const nameMatch = message.match(/customer:\s*(.+)$/i) || message.match(/(.+)\s+ki subscription/i);

  if (emailMatch) return { type: 'email', value: emailMatch[1] };
  if (phoneMatch) return { type: 'phone', value: phoneMatch[1] };
  if (nameMatch) return { type: 'name', value: nameMatch[1].trim() };

  return null;
}; 