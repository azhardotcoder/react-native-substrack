import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Shadows } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export type TaskStatus = 'Done' | 'In Progress' | 'To-do';

interface TaskCardProps {
  title: string;
  subtitle: string;
  time: string;
  status: TaskStatus;
  icon?: string;
}

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case 'Done':
      return Colors.active;
    case 'In Progress':
      return Colors.expiringSoon;
    case 'To-do':
      return Colors.textSecondary;
  }
};

export const TaskCard: React.FC<TaskCardProps> = ({
  title,
  subtitle,
  time,
  status,
  icon,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={16} color={Colors.primary} />
            <Text style={styles.time}>{time}</Text>
          </View>
        </View>
        
        <View style={styles.rightContainer}>
          {icon && (
            <View style={styles.iconContainer}>
              <Ionicons name={icon as any} size={24} color={Colors.primary} />
            </View>
          )}
          <Text style={[
            styles.status,
            { color: getStatusColor(status) }
          ]}>
            {status}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    ...Shadows.card,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 4,
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.tabInactive,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  status: {
    fontSize: 12,
    fontWeight: '500',
  },
}); 