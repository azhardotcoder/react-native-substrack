import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { SubscriptionCard } from '../SubscriptionCard';

jest.useFakeTimers();

describe('SubscriptionCard', () => {
  const mockProps = {
    name: 'Netflix',
    provider: 'Netflix Inc.',
    amount: 499,
    renewalDate: new Date(),
    status: 'Active' as const,
    type: 'streaming' as const,
  };

  it('renders correctly with all props', () => {
    const { getByText } = render(<SubscriptionCard {...mockProps} />);
    
    expect(getByText('Netflix')).toBeTruthy();
    expect(getByText('Netflix Inc.')).toBeTruthy();
    expect(getByText('₹499/mo')).toBeTruthy();
    expect(getByText('Active')).toBeTruthy();
  });

  it('displays correct renewal text for future dates', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    
    const { getByText } = render(
      <SubscriptionCard {...mockProps} renewalDate={futureDate} />
    );
    
    expect(getByText('Renews in 5 days')).toBeTruthy();
  });

  it('displays correct renewal text for past dates', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    
    const { getByText } = render(
      <SubscriptionCard {...mockProps} renewalDate={pastDate} />
    );
    
    expect(getByText(/Renewed/)).toBeTruthy();
  });

  it('calls onPress when pressed', async () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <SubscriptionCard {...mockProps} onPress={onPressMock} />
    );
    
    await act(async () => {
      fireEvent.press(getByTestId('subscription-card'));
      jest.runAllTimers();
    });

    expect(onPressMock).toHaveBeenCalled();
  });

  it('renders with different status colors', () => {
    const { getByText } = render(
      <SubscriptionCard {...mockProps} status="Expiring Soon" />
    );
    
    expect(getByText('Expiring Soon')).toBeTruthy();
  });

  it('renders with different subscription types', () => {
    const { getByTestId } = render(
      <SubscriptionCard {...mockProps} type="gaming" />
    );
    
    expect(getByTestId('subscription-icon')).toBeTruthy();
  });
}); 