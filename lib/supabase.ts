import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || '';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || '';

const storageConfig = {
  getItem: (key: string) => AsyncStorage.getItem(key),
  setItem: (key: string, data: string) => AsyncStorage.setItem(key, data),
  removeItem: (key: string) => AsyncStorage.removeItem(key)
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storageConfig,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce'
  }
}); 