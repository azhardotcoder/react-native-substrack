import React, { useState } from 'react';
import { View, Platform, TouchableOpacity, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { commonStyles } from '../styles/commonStyles';
import { format } from 'date-fns';

interface DatePickerFieldProps {
  label: string;
  value: Date;
  onChange: (event: any, date?: Date) => void;
  showPicker: boolean;
  setShowPicker: (show: boolean) => void;
  error?: string;
  required?: boolean;
  containerStyle?: ViewStyle;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  value,
  onChange,
  showPicker,
  setShowPicker,
  error,
  required = true,
  containerStyle
}) => {
  return (
    <View style={[commonStyles.dateFieldContainer, containerStyle]}>
      <Text style={commonStyles.inputLabel}>
        {label} {required && <Text style={commonStyles.requiredStar}>*</Text>}
      </Text>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={commonStyles.dateContainer}
      >
        <Text style={commonStyles.dateValue}>
          {format(value, 'dd MMM yyyy')}
        </Text>
        <Text style={commonStyles.dateChangeButton}>
          Change
        </Text>
      </TouchableOpacity>
      {error && <Text style={commonStyles.errorText}>{error}</Text>}
      {showPicker && (
        <DateTimePicker
          value={value}
          mode="date"
          onChange={(event, date) => {
            setShowPicker(Platform.OS === 'ios');
            onChange(event, date);
          }}
        />
      )}
    </View>
  );
}; 