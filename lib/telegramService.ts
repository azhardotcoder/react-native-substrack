import axios from 'axios';

interface TelegramNotificationData {
  customerName: string;
  phoneNumber: string;
  customerEmail: string;
  subscriptionName: string;
  buyDate: string;
  expiryDate: string;
  amount: number;
}

export const sendTelegramNotification = async (data: TelegramNotificationData) => {
  try {
    const TELEGRAM_BOT_TOKEN = process.env.EXPO_PUBLIC_TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.EXPO_PUBLIC_TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error('Telegram configuration missing');
    }

    const message = `
🆕 New Subscription Added!

👤 Customer: ${data.customerName}
📱 Phone: ${data.phoneNumber}
📧 Email: ${data.customerEmail}
📦 Subscription: ${data.subscriptionName}
💰 Amount: ₹${data.amount}
📅 Buy Date: ${new Date(data.buyDate).toLocaleDateString()}
⏰ Expiry Date: ${new Date(data.expiryDate).toLocaleDateString()}
    `.trim();

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send Telegram notification');
    }

    return true;
  } catch (error) {
    console.error('Telegram notification error:', error);
    throw error;
  }
}; 