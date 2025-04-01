import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Text, Surface, TextInput, useTheme, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { generateAIResponse } from '../lib/aiService';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/auth';
import { LinearGradient } from 'expo-linear-gradient';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Subscription {
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  category?: string;
  nextPayment?: Date;
}

export default function AIChatbot() {
  const theme = useTheme();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `🤖 Main aapki kya madad kar sakta hun?\n\n1. Overview dekhne ke liye "Hello" ya "Hi" type karein\n2. Customer details ke liye type karein:\n   - email: customer@example.com\n   - phone: 1234567890\n   - customer: Customer Name`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        setSubscriptions(data as Subscription[]);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  const handleSend = useCallback(async () => {
    if (!inputMessage.trim() || isLoading) return;

    try {
      setIsLoading(true);
      const newMessages = [...messages, { 
        role: 'user' as const, 
        content: inputMessage,
        timestamp: new Date()
      }];
      setMessages(newMessages);
      setInputMessage('');

      let subscriptionData;
      if (user) {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id);
        
        if (!error) {
          subscriptionData = data;
        }
      }

      const response = await generateAIResponse(inputMessage, messages, subscriptionData);
      setMessages(prev => [...prev, { 
        role: 'assistant' as const, 
        content: response,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant' as const, 
          content: 'Sorry, kuch error aa gaya. Please try again.',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, isLoading, messages, user]);

  const renderMessage = useCallback(({ message, index }: { message: Message; index: number }) => (
    <View
      key={`msg-${index}-${message.timestamp.getTime()}`}
      style={[
        styles.messageRow,
        message.role === 'user' ? styles.userMessageRow : styles.assistantMessageRow
      ]}
    >
      {message.role === 'assistant' && (
        <View style={styles.avatarContainer}>
          <MaterialCommunityIcons name="robot-excited" size={24} color="#6750A4" />
        </View>
      )}
      
      <View 
        style={[
          styles.messageBubble,
          message.role === 'user' ? styles.userBubble : styles.assistantBubble
        ]}
      >
        <Text style={[
          styles.messageText,
          { color: message.role === 'user' ? '#FFFFFF' : '#000000' }
        ]}>
          {message.content}
        </Text>
        <Text style={[
          styles.timeText,
          { color: message.role === 'user' ? '#E0E0E0' : '#666666' }
        ]}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
    </View>
  ), []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#6750A4', '#9C27B0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <MaterialCommunityIcons name="robot-excited" size={28} color="#fff" />
          <Text style={styles.headerText}>Substrack AI</Text>
        </View>
      </LinearGradient>

      {/* Chat Messages */}
      <View style={styles.chatContainer}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          scrollEventThrottle={16}
          decelerationRate="fast"
        >
          {messages.map((message, index) => renderMessage({ message, index }))}

          {isLoading && (
            <View style={[styles.messageRow, styles.assistantMessageRow]}>
              <View style={styles.avatarContainer}>
                <MaterialCommunityIcons name="robot-excited" size={24} color="#6750A4" />
              </View>
              <View style={[styles.messageBubble, styles.assistantBubble, styles.loadingBubble]}>
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Typing</Text>
                  <View style={styles.loadingDots}>
                    {[0, 1, 2].map((i) => (
                      <View key={i} style={styles.dot} />
                    ))}
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.inputWrapper}
      >
        <View style={styles.inputContainer}>
          <TextInput
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholder="Kuch bhi puchho..."
            style={styles.input}
            multiline
            maxLength={500}
            onSubmitEditing={handleSend}
            right={
              <TextInput.Icon
                icon={isLoading ? "loading" : "send"}
                disabled={!inputMessage.trim() || isLoading}
                onPress={handleSend}
                color={!inputMessage.trim() || isLoading ? '#9CA3AF' : '#6750A4'}
              />
            }
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 10,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 16,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 8,
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  assistantMessageRow: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: '#6750A4',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  timeText: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  loadingBubble: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#6750A4',
    marginRight: 8,
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6750A4',
    marginHorizontal: 2,
  },
  inputWrapper: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  inputContainer: {
    padding: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    fontSize: 16,
    maxHeight: 100,
  }
}); 