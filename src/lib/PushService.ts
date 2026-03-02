import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/config';

export const initializePush = async () => {
  if (Capacitor.getPlatform() === 'web') {
    console.log('Push notifications not supported on web.');
    return;
  }

  // Request permissions
  let permStatus = await PushNotifications.checkPermissions();

  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions();
  }

  if (permStatus.receive !== 'granted') {
    console.error('User denied permissions!');
    return;
  }

  // Register with FCM
  await PushNotifications.register();

  // On success, send token to our backend
  PushNotifications.addListener('registration', async (token) => {
    console.log('Push registration success, token: ' + token.value);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/register-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.value }),
      });
      
      if (response.ok) {
        console.log('Token registered with backend');
      }
    } catch (error) {
      console.error('Error registering token with backend:', error);
    }
  });

  PushNotifications.addListener('registrationError', (error: any) => {
    console.error('Error on registration: ' + JSON.stringify(error));
  });

  // Handle incoming notifications while app is open
  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    toast.success(notification.title || 'New Notification', {
      description: notification.body,
    });
  });
};
