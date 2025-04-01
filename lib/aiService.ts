import { supabase } from './supabase';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { HfInference } from "@huggingface/inference";

// Environment variables
const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
const HF_API_KEY = process.env.EXPO_PUBLIC_HF_API_KEY;

if (!GOOGLE_API_KEY || !HF_API_KEY) {
  throw new Error('Missing required API keys in environment variables');
}

// Initialize AI clients
const googleAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const hf = new HfInference(HF_API_KEY);

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface SubscriptionDetails {
  customerName: string;
  customerEmail: string;
  subscriptionName: string;
  phoneNumber: string;
  amount: number;
  buyDate: string;
  expiryDate: string;
}

// Mock responses for different types of queries
const MOCK_RESPONSES: { [key: string]: string } = {
  greeting: `Namaste! Main aapki kya madad kar sakta hun?

1. Subscription details dekhne ke liye
2. Revenue analysis ke liye
3. Customer details update karne ke liye
4. Naya subscription add karne ke liye

Bas puchh lijiye, main help kar dunga! 😊`,

  subscription: `Subscription Details:
- Name: Netflix
- Price: ₹499/month
- Next Payment: 15 April 2024
- Status: Active

Kya aap koi update karna chahte hain?`,

  revenue: `Revenue Analysis:
Total Revenue: ₹25,000
Active Subscriptions: 12
Categories:
- Entertainment: 45%
- Utilities: 30%
- Others: 25%`,

  help: `Main in cheezon mein help kar sakta hun:

1. "subscription status" - Check current subscriptions
2. "revenue kitna hai" - See revenue details
3. "naya subscription" - Add new subscription
4. "help" - Show this menu again

Kripya natural language mein puchhein!`
};

// Unified AI response generation (Mock version)
export async function generateAIResponse(
  userMessage: string,
  context: ChatMessage[] = [],
  subscriptionData?: any
): Promise<string> {
  const message = userMessage.toLowerCase();

  // Simple intent matching
  if (message.includes('hello') || message.includes('hi') || message.includes('namaste')) {
    return MOCK_RESPONSES.greeting;
  }
  
  if (message.includes('subscription') || message.includes('details')) {
    return MOCK_RESPONSES.subscription;
  }
  
  if (message.includes('revenue') || message.includes('income') || message.includes('paisa')) {
    return MOCK_RESPONSES.revenue;
  }
  
  if (message.includes('help') || message.includes('madad')) {
    return MOCK_RESPONSES.help;
  }

  // Default response
  return `Main samajh gaya. Lekin specific details ke liye, please:
1. "subscription" ke bare mein puchhein
2. "revenue" ke bare mein puchhein
3. Ya "help" type karein`;
}

// Mock subscription details extraction
export async function extractSubscriptionDetails(userInput: string): Promise<SubscriptionDetails> {
  return {
    customerName: "Test User",
    customerEmail: "test@example.com",
    subscriptionName: "Netflix",
    phoneNumber: "1234567890",
    amount: 499,
    buyDate: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  };
}

// Mock message template generation
export async function generateMessageTemplate(subscriptionData: any): Promise<string> {
  return `Namaste ${subscriptionData.customerName}!
Aapka ${subscriptionData.subscriptionName} subscription renew hone wala hai.
Amount: ₹${subscriptionData.amount}
Date: ${new Date(subscriptionData.expiryDate).toLocaleDateString()}

Dhanyawad!`;
}

// Mock analysis report generation
export async function generateAnalysisReport(filters?: any): Promise<any> {
  return {
    totalRevenue: 25000,
    totalSubscriptions: 12,
    categoryBreakdown: {
      Entertainment: 45,
      Utilities: 30,
      Others: 25
    }
  };
}

// Example usage for each case:

/*
1. Add Subscription:
"Add a new subscription for John Doe, email john@example.com, 
Netflix subscription, phone 9876543210, amount 499, 
starting from today for 1 year"

2. Generate Template:
"Create a renewal message template for subscription ID 123, 
customer name John Doe, due in 5 days"

3. Analysis Report:
"Show me total revenue from Netflix subscriptions in last 3 months"
"Generate a report of all expiring subscriptions next month"
*/

export const examplePrompts = {
  subscription: [
    "Add subscription: John Doe, Netflix, 499/month, starting today",
    "New subscription for customer Sarah with email sarah@example.com"
  ],
  template: [
    "Create renewal message for Netflix subscription of John Doe",
    "Generate payment reminder template for expired subscriptions"
  ],
  analysis: [
    "Show total revenue this month",
    "How many subscriptions are expiring next week?",
    "Generate report for Netflix category subscriptions"
  ]
}; 