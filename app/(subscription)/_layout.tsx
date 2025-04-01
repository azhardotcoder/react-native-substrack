import { Stack } from 'expo-router';

export default function SubscriptionLayout() {
  return (
    <Stack 
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1A237E',
        },
        headerTintColor: '#fff',
        presentation: 'modal',
        animation: 'slide_from_bottom',
      }}
    >
      <Stack.Screen 
        name="new" 
        options={{
          title: 'Add New Subscription',
        }} 
      />
    </Stack>
  );
} 