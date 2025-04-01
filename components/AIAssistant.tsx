import React, { useState, useCallback, useMemo } from 'react';
import { View, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { Text, TextInput, Button, Surface } from 'react-native-paper';
import { extractSubscriptionDetails, generateMessageTemplate, generateAnalysisReport } from '../lib/aiService';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollViewRef = React.useRef<ScrollView>(null);

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      let response: string;

      if (input.toLowerCase().includes('add subscription')) {
        response = await handleSubscriptionRequest(input);
      } else if (input.toLowerCase().includes('template')) {
        response = await handleTemplateRequest(input);
      } else if (input.toLowerCase().includes('analysis')) {
        response = await handleAnalysisRequest(input);
      } else {
        response = "Main aapki kya madad kar sakta hun?\n\n" +
                  "1. Add subscription - Naya subscription add karein\n" +
                  "2. Template - Renewal message template generate karein\n" +
                  "3. Analysis - Subscription analysis dekhein";
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kuch error aa gaya');
    } finally {
      setLoading(false);
    }
  }, [input]);

  const handleSubscriptionRequest = async (input: string) => {
    const details = await extractSubscriptionDetails(input);
    
    const { error } = await supabase
      .from('subscriptions')
      .insert([details]);

    if (error) throw error;

    return `Subscription add ho gaya:\n
            Customer: ${details.customerName}\n
            Service: ${details.subscriptionName}\n
            Amount: ₹${details.amount}\n
            Expiry: ${details.expiryDate}`;
  };

  const handleTemplateRequest = async (input: string) => {
    return await generateMessageTemplate(input);
  };

  const handleAnalysisRequest = async (input: string) => {
    const report = await generateAnalysisReport({ query: input });
    return formatAnalysisResponse(report);
  };

  const formatAnalysisResponse = (report: any) => {
    let response = "Analysis Report:\n\n";
    
    if (report.totalRevenue) {
      response += `Total Revenue: ₹${report.totalRevenue}\n`;
    }
    if (report.totalSubscriptions) {
      response += `Total Subscriptions: ${report.totalSubscriptions}\n`;
    }
    if (report.categoryBreakdown) {
      response += "\nCategory Breakdown:\n";
      Object.entries(report.categoryBreakdown).forEach(([category, count]) => {
        response += `${category}: ${count}\n`;
      });
    }
    
    return response;
  };

  const messageList = useMemo(() => (
    messages.map(message => (
      <Surface key={message.id} style={[
        styles.messageBubble,
        message.sender === 'user' ? styles.userMessage : styles.aiMessage
      ]}>
        <Text style={styles.messageText}>{message.text}</Text>
        <Text style={styles.timestamp}>
          {message.timestamp.toLocaleTimeString()}
        </Text>
      </Surface>
    ))
  ), [messages]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.messageList}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
      >
        {messageList}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" />
          </View>
        )}
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          multiline
          disabled={loading}
        />
        <Button
          mode="contained"
          onPress={handleSend}
          disabled={loading || !input.trim()}
          style={styles.sendButton}
        >
          Send
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messageList: {
    flex: 1,
    padding: 16,
  },
  messageBubble: {
    padding: 12,
    marginVertical: 4,
    borderRadius: 12,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  input: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#f5f5f5',
  },
  sendButton: {
    justifyContent: 'center',
  },
  loadingContainer: {
    padding: 8,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 8,
  },
});

export default AIAssistant; 