import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { useTheme } from 'react-native-paper';
import { processChatMessage } from '../lib/chatbotService';
import { useNavigation } from '@react-navigation/native';

// Default bot avatar
const BOT_AVATAR = 'https://raw.githubusercontent.com/substrack/assets/main/bot-avatar.png';

const ChatbotInterface = () => {
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState("");
  const theme = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Namaste! Main aapka Substrack assistant hoon. Main aapki subscription information, naye subscribers add karne, ya general sawaalon mein madad kar sakta hoon. Aap kaise help chahte hain?",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Substrack Assistant',
          avatar: BOT_AVATAR,
        },
      },
    ]);
  }, []);

  const onSend = useCallback(async (newMessages = []) => {
    const userMessage = newMessages[0];
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    
    const updatedHistory = `${chatHistory}\nUser: ${userMessage.text}`;
    setChatHistory(updatedHistory);
    
    const botResponse = await processChatMessage(userMessage.text, chatHistory);
    
    if (typeof botResponse === 'object' && botResponse.type === 'FORM_DATA') {
      const textResponseMessage = {
        _id: Math.round(Math.random() * 1000000),
        text: botResponse.message,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Substrack Assistant',
          avatar: BOT_AVATAR,
        },
      };
      
      setMessages(previousMessages => GiftedChat.append(previousMessages, [textResponseMessage]));
      
      if (botResponse.data) {
        setTimeout(() => {
          navigation.navigate('/(subscription)/new', { 
            prefilledData: botResponse.data 
          });
        }, 1500);
      }
    } else {
      const botMessage = {
        _id: Math.round(Math.random() * 1000000),
        text: botResponse,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Substrack Assistant',
          avatar: BOT_AVATAR,
        },
      };
      
      setMessages(previousMessages => GiftedChat.append(previousMessages, [botMessage]));
    }
    
    setChatHistory(`${updatedHistory}\nAssistant: ${typeof botResponse === 'object' ? botResponse.message : botResponse}`);
  }, [chatHistory, navigation]);

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
        placeholder="Apna message type karein..."
        renderBubble={props => (
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: theme.colors.primary,
              },
              left: {
                backgroundColor: theme.colors.surface,
              },
            }}
            textStyle={{
              left: {
                color: theme.colors.text,
              },
            }}
          />
        )}
        renderInputToolbar={props => (
          <InputToolbar
            {...props}
            containerStyle={{
              backgroundColor: theme.colors.surface,
              borderTopColor: theme.colors.disabled,
              paddingBottom: Platform.OS === 'ios' ? 20 : 0,
            }}
          />
        )}
        listViewProps={{
          style: {
            backgroundColor: '#f5f5f5',
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default ChatbotInterface; 