import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Surface, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  periodSelector: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  periodText: {
    color: '#1E293B',
    fontSize: 14,
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statsCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  totalCard: {
    backgroundColor: '#1A237E',
  },
  activeCard: {
    backgroundColor: '#22C55E',
  },
  expiredCard: {
    backgroundColor: '#EF4444',
  },
  thisMonthCard: {
    backgroundColor: '#3B82F6',
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  viewAllButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  viewAllText: {
    color: '#1E293B',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  periodFilterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  periodFilter: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 12,
  },
  activePeriodFilter: {
    backgroundColor: '#1A237E',
  },
  periodFilterText: {
    color: '#64748B',
    fontSize: 14,
    textAlign: 'center',
  },
  activePeriodFilterText: {
    color: '#FFFFFF',
  },
  notificationsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  notificationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  notificationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  notificationCount: {
    color: '#64748B',
  },
  clearAllButton: {
    color: '#3B82F6',
    fontSize: 14,
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 4,
  },
  notificationDate: {
    fontSize: 14,
    color: '#EF4444',
  },
});

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <TouchableOpacity style={styles.periodSelector}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#1E293B" />
            <Text style={styles.periodText}>1 Week</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <Surface style={[styles.statsCard, styles.totalCard]}>
          <View style={styles.cardIcon}>
            <MaterialCommunityIcons name="apps" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.cardLabel}>Total</Text>
          <Text style={styles.cardValue}>11</Text>
        </Surface>

        <Surface style={[styles.statsCard, styles.activeCard]}>
          <View style={styles.cardIcon}>
            <MaterialCommunityIcons name="check-circle" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.cardLabel}>Active</Text>
          <Text style={styles.cardValue}>9</Text>
        </Surface>

        <Surface style={[styles.statsCard, styles.expiredCard]}>
          <View style={styles.cardIcon}>
            <MaterialCommunityIcons name="close-circle" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.cardLabel}>Expired</Text>
          <Text style={styles.cardValue}>2</Text>
        </Surface>

        <Surface style={[styles.statsCard, styles.thisMonthCard]}>
          <View style={styles.cardIcon}>
            <MaterialCommunityIcons name="calendar-month" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.cardLabel}>This Month</Text>
          <Text style={styles.cardValue}>2</Text>
        </Surface>
      </View>

      <TouchableOpacity style={styles.viewAllButton}>
        <Text style={styles.viewAllText}>View All Subscriptions</Text>
      </TouchableOpacity>

      <View style={styles.periodFilterContainer}>
        <TouchableOpacity style={[styles.periodFilter, styles.activePeriodFilter]}>
          <Text style={[styles.periodFilterText, styles.activePeriodFilterText]}>2 Days</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.periodFilter}>
          <Text style={styles.periodFilterText}>7 Days</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.periodFilter}>
          <Text style={styles.periodFilterText}>1 Month</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.notificationsContainer}>
        <View style={styles.notificationsHeader}>
          <View>
            <Text style={styles.notificationsTitle}>Notifications (2)</Text>
            <Text style={styles.notificationCount}>Total Notifications: 2</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.clearAllButton}>Clear All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.notification}>
          <View style={styles.notificationIcon}>
            <MaterialCommunityIcons name="bell" size={24} color="#EF4444" />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>Vijay</Text>
            <Text style={styles.notificationDate}>Expires on Apr 02, 2025</Text>
          </View>
        </View>

        <View style={styles.notification}>
          <View style={styles.notificationIcon}>
            <MaterialCommunityIcons name="bell" size={24} color="#EF4444" />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>Ranjeet</Text>
            <Text style={styles.notificationDate}>Expires on Apr 05, 2025</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen; 