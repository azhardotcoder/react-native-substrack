import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Substrack',
  slug: 'substrack',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/Icon-512.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff'
    }
  },
  web: {
    favicon: './assets/favicon.png'
  },
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    openaiApiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
    googleApiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
    hfApiKey: process.env.EXPO_PUBLIC_HF_API_KEY,
    telegramBotToken: process.env.EXPO_PUBLIC_TELEGRAM_BOT_TOKEN,
    telegramChatId: process.env.EXPO_PUBLIC_TELEGRAM_CHAT_ID,
    eas: {
      projectId: "your-project-id"
    }
  }
}); 