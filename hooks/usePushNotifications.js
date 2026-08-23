import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { useAlert } from '../AlertContext';

export default function usePushNotifications() {
  const { showAlert } = useAlert();

  useEffect(() => {
    messaging()
      .requestPermission()
      .catch((e) => console.log('Notification permission request failed:', e.message));

    // FCM only auto-displays notifications in the system tray when the app is
    // backgrounded/killed. While the app is open, we surface them ourselves.
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const title = remoteMessage.notification?.title || 'নোটিফিকেশন';
      const body = remoteMessage.notification?.body || '';
      if (title || body) {
        showAlert(title, body, [], 'bell-ring-outline');
      }
    });

    return unsubscribe;
  }, [showAlert]);
}
