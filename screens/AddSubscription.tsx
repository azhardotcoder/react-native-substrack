const handleSubmit = async () => {
  const validationErrors = validateForm(formData);
  setErrors(validationErrors);

  if (Object.keys(validationErrors).length === 0) {
    try {
      await saveSubscription(formData);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Error saving subscription:', error);
      // Handle error
    }
  }
};

const handleSubmitSuccess = () => {
  // Reset form
  setFormData({
    customerName: '',
    phoneNumber: '',
    email: '',
    subscriptionName: '',
    customSubscriptionName: '',
    amount: '',
    validity: '',
    purchaseDate: null,
    expiryDate: null,
  });
  setShowSuccessDialog(false);
}; 