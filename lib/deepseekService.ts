import axios from 'axios';

const DEEPSEEK_API_KEY = 'YOUR_DEEPSEEK_API_KEY';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1';

interface SubscriptionAnalysis {
  customerSegment: string;
  renewalProbability: number;
  recommendedActions: string[];
  priceOptimization?: {
    recommendedPrice: number;
    reasoning: string;
  };
}

export async function analyzeSubscription(subscriptionData: any): Promise<SubscriptionAnalysis> {
  try {
    const response = await axios.post(`${DEEPSEEK_API_URL}/analyze`, {
      subscription: subscriptionData,
    }, {
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error analyzing subscription:', error);
    throw error;
  }
}

export async function getCustomerInsights(customerData: any) {
  try {
    const response = await axios.post(`${DEEPSEEK_API_URL}/insights`, {
      customer: customerData,
    }, {
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error getting customer insights:', error);
    throw error;
  }
}

export async function getPriceRecommendation(subscriptionData: any) {
  try {
    const response = await axios.post(`${DEEPSEEK_API_URL}/price-optimize`, {
      subscription: subscriptionData,
      marketData: {
        // Add relevant market data
      }
    }, {
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error getting price recommendation:', error);
    throw error;
  }
} 