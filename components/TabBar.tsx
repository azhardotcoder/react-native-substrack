import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

export type TabType = 'All' | 'Active' | 'Expiring Soon' | 'Expired';

interface TabBarProps {
  selectedTab: TabType;
  onTabSelect: (tab: TabType) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ selectedTab, onTabSelect }) => {
  const tabs: TabType[] = ['All', 'Active', 'Expiring Soon', 'Expired'];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tab,
            selectedTab === tab && styles.selectedTab,
          ]}
          onPress={() => onTabSelect(tab)}
        >
          <Text style={[
            styles.tabText,
            selectedTab === tab && styles.selectedTabText,
          ]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.background,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: Colors.tabInactive,
  },
  selectedTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  selectedTabText: {
    color: Colors.cardBackground,
    fontWeight: '600',
  },
}); 