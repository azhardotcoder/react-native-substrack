export type SubscriptionFormData = {
  customerName: string;
  phoneNumber: string;
  email: string;
  subscriptionName: string;
  customSubscriptionName: string;
  amount: string;
  validity: string;
  purchaseDate: Date | null;
  expiryDate: Date | null;
};

export interface ValidationErrors {
  customerName?: string;
  phoneNumber?: string;
  customerEmail?: string;
  subscriptionName?: string;
  amount?: string;
  validity?: string;
  buyDate?: string;
  expiryDate?: string;
}

export const validateSubscriptionForm = (formData: SubscriptionFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!formData.customerName) {
    errors.customerName = 'Customer name is required';
  }

  if (!formData.phoneNumber) {
    errors.phoneNumber = 'Phone number is required';
  } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
    errors.phoneNumber = 'Please enter a valid 10-digit phone number';
  }

  if (formData.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
    errors.customerEmail = 'Please enter a valid email address';
  }

  if (!formData.subscriptionName) {
    errors.subscriptionName = 'Subscription name is required';
  }

  if (!formData.amount) {
    errors.amount = 'Amount is required';
  } else if (isNaN(parseFloat(formData.amount))) {
    errors.amount = 'Amount must be a valid number';
  }

  if (!formData.validity) {
    errors.validity = 'Validity is required';
  }

  if (!formData.buyDate) {
    errors.buyDate = 'Purchase date is required';
  }

  if (!formData.expiryDate) {
    errors.expiryDate = 'Expiry date is required';
  } else if (formData.expiryDate < formData.buyDate) {
    errors.expiryDate = 'Expiry date cannot be before purchase date';
  }

  return errors;
}; 