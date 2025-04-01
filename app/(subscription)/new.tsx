import React from 'react';
import { View, StyleSheet } from 'react-native';
import SubscriptionForm from '../../components/SubscriptionForm';

export default function NewSubscriptionScreen() {
  return (
    <View style={styles.container}>
      <SubscriptionForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
}); 