import * as Notifications from 'expo-notifications';

// Notifications handler setup
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Function to schedule a notification
export async function scheduleNotification(title: string, body: string, trigger: any = null) {
  try {
    const permission = await Notifications.requestPermissionsAsync();
    if (!permission.granted) {
      return false;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: trigger || {
        seconds: 1, // Default trigger after 1 second
      },
    });

    return true;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return false;
  }
}

// Function to cancel all notifications
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
} 