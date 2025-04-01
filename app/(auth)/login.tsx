import React, { useState } from 'react';
import { View, StyleSheet, Platform, Image } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  const handleAuth = async () => {
    if (!username || !password) {
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password,
      });
      if (error) throw error;
      console.log('Login successful:', data);
    } catch (error: any) {
      let errorMessage = 'Invalid username or password';
      if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please verify your email first';
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#f8f9fa', '#e9ecef']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/Icon-512.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <Text style={styles.appName}>Substrack</Text>
        </View>

        <Text style={styles.loginText}>LOG IN TO CONTINUE</Text>

        <View style={styles.form}>
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            style={styles.input}
            autoCapitalize="none"
            disabled={loading}
            left={<TextInput.Icon icon="account" />}
            outlineStyle={styles.inputOutline}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry={!showPassword}
            disabled={loading}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon 
                icon={showPassword ? "eye-off" : "eye"} 
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            outlineStyle={styles.inputOutline}
          />

          <Button
            mode="contained"
            onPress={handleAuth}
            style={styles.loginButton}
            loading={loading}
            disabled={loading}
            contentStyle={styles.buttonContent}
          >
            LOG IN
          </Button>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A55A2',
  },
  loginText: {
    color: '#4A55A2',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 30,
    letterSpacing: 1,
  },
  form: {
    gap: 15,
  },
  input: {
    backgroundColor: '#fff',
  },
  inputOutline: {
    borderRadius: 8,
  },
  loginButton: {
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: '#4A55A2',
    height: 50,
    justifyContent: 'center',
  },
  buttonContent: {
    height: 50,
  },
}); 