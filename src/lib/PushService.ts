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

  // Create Android Channel for "Heads-up" notifications (Crucial for popups)
  if (Capacitor.getPlatform() === 'android') {
    await PushNotifications.createChannel({
      id: 'j-notifications',
      name: 'J Alerts',
      description: 'Critical alerts from J',
      importance: 5, // High importance for heads-up
      visibility: 1,
      vibration: true,
    });
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

  // Handle incoming notifications
  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    // Show in-app toast
    toast.success(notification.title || 'New Notification', {
      description: notification.body,
    });
  });

  // This ensures notifications SHOW UP even when the app is open (Foreground)
  PushNotifications.removeAllListeners(); // Clean up
  
  // Re-add listeners with presentation options
  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    toast.success(notification.title || 'New Notification', {
      description: notification.body,
    });
  });
};
