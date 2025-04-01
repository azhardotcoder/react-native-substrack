import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { TextInput, Button, Menu, useTheme, Portal, Dialog } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { commonStyles } from '../styles/commonStyles';
import { SubscriptionFormData, ValidationErrors } from '../utils/validation';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DatePickerField from './DatePickerField';

type RootStackParamList = {
  Subscriptions: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Subscriptions'>;

interface SubscriptionFormFieldsProps {
  formData: SubscriptionFormData;
  onChange: (field: keyof SubscriptionFormData, value: string | Date) => void;
  errors: ValidationErrors;
  showDateFields: boolean;
  onSubmitSuccess: () => void;
  onSubmit: () => void;
}

const RequiredStar = () => <Text style={commonStyles.requiredStar}>*</Text>;

const validityOptions = [
  { label: '1 Month', value: '1_month' },
  { label: '3 Months', value: '3_months' },
  { label: '6 Months', value: '6_months' },
  { label: '1 Year', value: '1_year' },
  { label: 'Custom', value: 'custom' },
];

const subscriptionOptions = [
  { label: 'Netflix', value: 'Netflix' },
  { label: 'Prime Video', value: 'Prime Video' },
  { label: 'YouTube Premium', value: 'YouTube Premium' },
  { label: 'Zee5', value: 'Zee5' },
  { label: 'SonyLiv', value: 'SonyLiv' },
  { label: 'Hotstar', value: 'Hotstar' },
  { label: 'Spotify', value: 'Spotify' },
  { label: 'Custom', value: 'custom' },
];

export const SubscriptionFormFields: React.FC<SubscriptionFormFieldsProps> = ({
  formData,
  onChange,
  errors,
  showDateFields,
  onSubmitSuccess,
  onSubmit,
}) => {
  const [visible, setVisible] = useState(false);
  const [subscriptionMenuVisible, setSubscriptionMenuVisible] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const getValidityLabel = (value: string) => {
    const option = validityOptions.find(opt => opt.value === value);
    return option ? option.label : 'Select Validity';
  };

  const calculateExpiryDate = (validity: string) => {
    const buyDate = new Date();
    const expiryDate = new Date(buyDate);

    switch (validity) {
      case '1_month':
        expiryDate.setMonth(buyDate.getMonth() + 1);
        break;
      case '3_months':
        expiryDate.setMonth(buyDate.getMonth() + 3);
        break;
      case '6_months':
        expiryDate.setMonth(buyDate.getMonth() + 6);
        break;
      case '1_year':
        expiryDate.setFullYear(buyDate.getFullYear() + 1);
        break;
      default:
        return null;
    }

    return expiryDate;
  };

  const handleValidityChange = (value: string) => {
    onChange('validity', value);
    
    if (value !== 'custom') {
      // Set purchase date to today
      const today = new Date();
      onChange('purchaseDate', today);
      
      // Calculate and set expiry date
      const expiryDate = calculateExpiryDate(value);
      if (expiryDate) {
        onChange('expiryDate', expiryDate);
      }
    }
    
    setVisible(false);
  };

  const handleViewSubscription = () => {
    setShowSuccessDialog(false);
    navigation.navigate('Subscriptions');
  };

  const handleAddAnother = () => {
    setShowSuccessDialog(false);
    onSubmitSuccess();
  };

  return (
    <>
      <View style={commonStyles.formContainer}>
        <View>
          <Text style={commonStyles.inputLabel}>Customer Name <RequiredStar /></Text>
          <TextInput
            value={formData.customerName}
            onChangeText={(text) => onChange('customerName', text)}
            mode="outlined"
            outlineColor="#E0E0E0"
            activeOutlineColor="#1A237E"
            style={commonStyles.input}
            error={!!errors.customerName}
            placeholder="Enter customer name"
          />
          {errors.customerName && (
            <Text style={commonStyles.errorText}>{errors.customerName}</Text>
          )}
        </View>

        <View>
          <Text style={commonStyles.inputLabel}>Phone Number <RequiredStar /></Text>
          <TextInput
            value={formData.phoneNumber}
            onChangeText={(text) => onChange('phoneNumber', text)}
            mode="outlined"
            outlineColor="#E0E0E0"
            activeOutlineColor="#1A237E"
            style={commonStyles.input}
            keyboardType="phone-pad"
            error={!!errors.phoneNumber}
            placeholder="Enter phone number"
          />
          {errors.phoneNumber && (
            <Text style={commonStyles.errorText}>{errors.phoneNumber}</Text>
          )}
        </View>

        <View>
          <Text style={commonStyles.inputLabel}>Email ID</Text>
          <TextInput
            value={formData.email}
            onChangeText={(text) => onChange('email', text)}
            mode="outlined"
            outlineColor="#E0E0E0"
            activeOutlineColor="#1A237E"
            style={commonStyles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            error={!!errors.customerEmail}
            placeholder="Enter email address"
          />
          {errors.customerEmail && (
            <Text style={commonStyles.errorText}>{errors.customerEmail}</Text>
          )}
        </View>

        <View>
          <Text style={commonStyles.inputLabel}>Subscription Name <RequiredStar /></Text>
          {formData.subscriptionName === 'custom' ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <TextInput
                  style={commonStyles.input}
                  placeholder="Enter subscription name"
                  value={formData.customSubscriptionName}
                  onChangeText={(text) => onChange('customSubscriptionName', text)}
                  error={!!errors.subscriptionName}
                />
              </View>
              <TouchableOpacity 
                style={[commonStyles.changeButton, { marginLeft: 8 }]}
                onPress={() => {
                  onChange('subscriptionName', '');
                  onChange('customSubscriptionName', '');
                  setSubscriptionMenuVisible(true);
                }}
              >
                <MaterialCommunityIcons 
                  name="pencil" 
                  size={20} 
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <Menu
              visible={subscriptionMenuVisible}
              onDismiss={() => setSubscriptionMenuVisible(false)}
              anchor={
                <TouchableOpacity 
                  style={commonStyles.dropdownButton}
                  onPress={() => setSubscriptionMenuVisible(true)}
                >
                  <View style={commonStyles.dropdownButtonInner}>
                    <Text style={commonStyles.dropdownButtonText}>
                      {formData.subscriptionName || 'Select Subscription'}
                    </Text>
                    <MaterialCommunityIcons 
                      name={subscriptionMenuVisible ? 'chevron-up' : 'chevron-down'} 
                      size={24} 
                      color={theme.colors.primary}
                    />
                  </View>
                </TouchableOpacity>
              }
              contentStyle={commonStyles.menuContent}
            >
              {subscriptionOptions.map((option) => (
                <Menu.Item
                  key={option.value}
                  onPress={() => {
                    onChange('subscriptionName', option.value);
                    if (option.value === 'custom') {
                      onChange('customSubscriptionName', '');
                    }
                    setSubscriptionMenuVisible(false);
                  }}
                  title={option.label}
                  style={commonStyles.menuItem}
                  titleStyle={commonStyles.menuItemText}
                  leadingIcon={() => 
                    formData.subscriptionName === option.value ? (
                      <MaterialCommunityIcons 
                        name="check" 
                        size={20} 
                        color={theme.colors.primary}
                      />
                    ) : null
                  }
                />
              ))}
            </Menu>
          )}
          {errors.subscriptionName && (
            <Text style={commonStyles.errorText}>{errors.subscriptionName}</Text>
          )}
        </View>

        <View>
          <Text style={commonStyles.inputLabel}>Amount (₹) <RequiredStar /></Text>
          <TextInput
            value={formData.amount}
            onChangeText={(text) => onChange('amount', text)}
            mode="outlined"
            outlineColor="#E0E0E0"
            activeOutlineColor="#1A237E"
            style={commonStyles.input}
            keyboardType="numeric"
            error={!!errors.amount}
            placeholder="Enter amount"
          />
          {errors.amount && (
            <Text style={commonStyles.errorText}>{errors.amount}</Text>
          )}
        </View>

        <View>
          <Text style={commonStyles.inputLabel}>Validity <RequiredStar /></Text>
          <Menu
            visible={visible}
            onDismiss={() => setVisible(false)}
            anchor={
              <TouchableOpacity 
                style={commonStyles.dropdownButton}
                onPress={() => setVisible(true)}
              >
                <View style={commonStyles.dropdownButtonInner}>
                  <Text style={commonStyles.dropdownButtonText}>
                    {formData.validity ? 
                      validityOptions.find(opt => opt.value === formData.validity)?.label || 'Select Validity' 
                      : 'Select Validity'}
                  </Text>
                  <MaterialCommunityIcons 
                    name={visible ? 'chevron-up' : 'chevron-down'} 
                    size={24} 
                    color={theme.colors.primary}
                  />
                </View>
              </TouchableOpacity>
            }
            contentStyle={commonStyles.menuContent}
          >
            {validityOptions.map((option) => (
              <Menu.Item
                key={option.value}
                onPress={() => {
                  handleValidityChange(option.value);
                  setVisible(false);
                }}
                title={option.label}
                style={commonStyles.menuItem}
                titleStyle={commonStyles.menuItemText}
                leadingIcon={() => 
                  formData.validity === option.value ? (
                    <MaterialCommunityIcons 
                      name="check" 
                      size={20} 
                      color={theme.colors.primary}
                    />
                  ) : null
                }
              />
            ))}
          </Menu>
          {errors.validity && (
            <Text style={commonStyles.errorText}>{errors.validity}</Text>
          )}
        </View>
      </View>

      <Portal>
        <Dialog
          visible={showSuccessDialog}
          onDismiss={() => setShowSuccessDialog(false)}
          style={commonStyles.dialog}
        >
          <Dialog.Title style={commonStyles.dialogTitle}>
            Subscription Added Successfully! 🎉
          </Dialog.Title>
          <Dialog.Content>
            <Text style={commonStyles.dialogText}>
              What would you like to do next?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="outlined"
              onPress={handleAddAnother}
              style={commonStyles.dialogButton}
              labelStyle={commonStyles.dialogButtonLabel}
            >
              Add Another
            </Button>
            <Button
              mode="contained"
              onPress={handleViewSubscription}
              style={[commonStyles.dialogButton, { marginLeft: 8 }]}
              labelStyle={commonStyles.dialogButtonLabel}
            >
              View Subscriptions
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}; 