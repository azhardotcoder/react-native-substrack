import React from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Colors, Shadows } from '../constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type SubscriptionStatus = 'Active' | 'Expiring Soon' | 'Expired';
export type SubscriptionType = 'streaming' | 'software' | 'gaming' | 'utilities' | 'other';

interface SubscriptionCardProps {
  name: string;
  provider: string;
  amount: number;
  renewalDate: Date;
  status: SubscriptionStatus;
  type: SubscriptionType;
  onPress?: () => void;
}

const getStatusColor = (status: SubscriptionStatus) => {
  switch (status) {
    case 'Active':
      return Colors.active;
    case 'Expiring Soon':
      return Colors.expiringSoon;
    case 'Expired':
      return Colors.expired;
  }
};

const getTypeIcon = (type: SubscriptionType) => {
  switch (type) {
    case 'streaming':
      return 'play-circle-outline';
    case 'software':
      return 'laptop-outline';
    case 'gaming':
      return 'gamepad-variant-outline';
    case 'utilities':
      return 'flash-outline';
    case 'other':
      return 'cube-outline';
  }
};

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  name,
  provider,
  amount,
  renewalDate,
  status,
  type,
  onPress,
}) => {
  const insets = useSafeAreaInsets();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const translateYAnim = React.useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    if (!onPress) return;
    
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 2,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      onPress();
    });
  };

  const daysUntilRenewal = Math.ceil((renewalDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { scale: scaleAnim },
            { translateY: translateYAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={handlePress}
        activeOpacity={0.7}
        testID="subscription-card"
      >
        <View style={styles.leftContent}>
          <View style={styles.textContainer}>
            <Text style={styles.subtitle}>{provider}</Text>
            <Text style={styles.title}>{name}</Text>
            <View style={styles.renewalContainer}>
              <MaterialCommunityIcons 
                name="calendar-clock-outline" 
                size={16} 
                color={Colors.primary} 
              />
              <Text style={styles.renewalText}>
                {daysUntilRenewal > 0 
                  ? `Renews in ${daysUntilRenewal} days`
                  : `Renewed ${format(renewalDate, 'dd MMM yyyy')}`
                }
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.rightContent}>
          <View style={[
            styles.iconContainer,
            { backgroundColor: Colors[type] + '15' }
          ]} testID="subscription-icon">
            <MaterialCommunityIcons 
              name={getTypeIcon(type)} 
              size={24} 
              color={Colors[type]} 
            />
          </View>
          <Text style={styles.amount}>₹{amount}/mo</Text>
          <View style={[
            styles.statusContainer,
            { backgroundColor: getStatusColor(status) + '15' }
          ]}>
            <View style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(status) }
            ]} />
            <Text style={[
              styles.status,
              { color: getStatusColor(status) }
            ]}>
              {status}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    ...Shadows.card,
  },
  content: {
    flexDirection: 'row',
    padding: 16,
  },
  leftContent: {
    flex: 1,
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
  renewalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  renewalText: {
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
  },
}); 