import React, { useEffect } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';

export default function App() {
  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Permission Required',
            message: 'We need permission to show notifications.',
            buttonPositive: 'OK',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permission not granted');
        }
      }

      await messaging().registerDeviceForRemoteMessages();

      const token = await messaging().getToken();
      console.log('FCM Token:', token);
    };

    requestPermission();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('New Notification', JSON.stringify(remoteMessage.notification));
    });

    return unsubscribe;
  }, []);

  return null; // for now, no UI
}
