import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Shadows } from '../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type NavItem = 'index' | 'subscriptions' | 'chatbot' | 'settings';

interface BottomNavBarProps {
  selectedItem: NavItem;
  onItemSelect: (item: NavItem) => void;
}

const NAV_ITEMS: { name: NavItem; icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string }[] = [
  { name: 'index', icon: 'home', label: 'Home' },
  { name: 'subscriptions', icon: 'credit-card-multiple', label: 'Subs' },
  { name: 'chatbot', icon: 'robot', label: 'AI' },
  { name: 'settings', icon: 'cog', label: 'Settings' },
];

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  selectedItem,
  onItemSelect,
}) => {
  const insets = useSafeAreaInsets();
  const scaleAnims = React.useRef(
    NAV_ITEMS.map(() => new Animated.Value(1))
  ).current;

  const handlePress = (name: NavItem, index: number) => {
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => onItemSelect(name));
  };

  return (
    <View 
      style={[
        styles.container, 
        { paddingBottom: Platform.OS === 'ios' ? insets.bottom : 8 }
      ]}
    >
      {NAV_ITEMS.map(({ name, icon, label }, index) => (
        <Animated.View
          key={name}
          style={[
            styles.navItemContainer,
            {
              transform: [{ scale: scaleAnims[index] }],
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.navItem,
              name === selectedItem && styles.selectedItem,
            ]}
            onPress={() => handlePress(name, index)}
            testID={`nav-item-${name}`}
          >
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name={icon}
                size={24}
                color={name === selectedItem ? Colors.primary : Colors.textSecondary}
                style={styles.icon}
              />
              <Animated.Text
                style={[
                  styles.label,
                  name === selectedItem && styles.selectedLabel,
                ]}
                numberOfLines={1}
              >
                {label}
              </Animated.Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    paddingTop: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadows.card,
  },
  navItemContainer: {
    flex: 1,
    alignItems: 'center',
    maxWidth: 80,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  selectedItem: {
    backgroundColor: Colors.primary + '15',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  selectedLabel: {
    color: Colors.primary,
    fontWeight: '600',
  },
}); 