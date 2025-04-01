import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  totalBuyersCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  revenueCard: {
    backgroundColor: '#1A237E',
  },
  activeSubsCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  lightIconBg: {
    backgroundColor: '#F1F5F9',
  },
  darkIconBg: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  cardLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  darkText: {
    color: '#1E293B',
  },
  lightText: {
    color: '#FFFFFF',
  },
  grayText: {
    color: '#64748B',
  },
});

const AnalysisScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Subscription Analysis</Text>
      </View>
      
      <View style={styles.cardsContainer}>
        <Surface style={[styles.card, styles.totalBuyersCard]}>
          <View style={[styles.cardIcon, styles.lightIconBg]}>
            <MaterialCommunityIcons 
              name="account-group" 
              size={24} 
              color="#1A237E" 
            />
          </View>
          <Text style={[styles.cardLabel, styles.grayText]}>Total Buyers</Text>
          <Text style={[styles.cardValue, styles.darkText]}>11</Text>
        </Surface>

        <Surface style={[styles.card, styles.revenueCard]}>
          <View style={[styles.cardIcon, styles.darkIconBg]}>
            <MaterialCommunityIcons 
              name="currency-inr" 
              size={24} 
              color="#FFFFFF" 
            />
          </View>
          <Text style={[styles.cardLabel, styles.lightText]}>Total Revenue</Text>
          <Text style={[styles.cardValue, styles.lightText]}>₹2760</Text>
        </Surface>

        <Surface style={[styles.card, styles.activeSubsCard]}>
          <View style={[styles.cardIcon, styles.lightIconBg]}>
            <MaterialCommunityIcons 
              name="check-circle" 
              size={24} 
              color="#22C55E" 
            />
          </View>
          <Text style={[styles.cardLabel, styles.grayText]}>Active Subs</Text>
          <Text style={[styles.cardValue, styles.darkText]}>8</Text>
        </Surface>
      </View>
    </View>
  );
};

export default AnalysisScreen; 