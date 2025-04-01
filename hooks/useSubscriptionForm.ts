import { useState } from 'react';
import { Alert } from 'react-native';
import { SubscriptionFormData, ValidationErrors, validateSubscriptionForm } from '../utils/validation';

interface UseSubscriptionFormProps {
  initialData?: Partial<SubscriptionFormData>;
  onSubmit: (data: SubscriptionFormData) => Promise<void>;
}

export const useSubscriptionForm = ({ initialData = {}, onSubmit }: UseSubscriptionFormProps) => {
  const [formData, setFormData] = useState<SubscriptionFormData>({
    customerEmail: '',
    customerName: '',
    subscriptionName: '',
    phoneNumber: '',
    amount: '',
    buyDate: new Date(),
    expiryDate: new Date(),
    ...initialData
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof SubscriptionFormData, value: string | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const validationErrors = validateSubscriptionForm(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    errors,
    loading,
    handleChange,
    handleSubmit,
    setFormData
  };
}; 