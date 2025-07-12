import React, { useEffect } from 'react';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import NotificationScreen from './src/screens/NotificationScreen';

export const navigationRef = createNavigationContainerRef();
const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permission not granted');
        }
      }

      await messaging().registerDeviceForRemoteMessages();

      const token = await messaging().getToken();
      console.log('🔥 FCM Token:', token);
    };

    requestPermission();

    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        remoteMessage.notification?.title || '',
        remoteMessage.notification?.body || '',
      );
    });

    const unsubscribeOpenedApp = messaging().onNotificationOpenedApp(
      remoteMessage => {
        if (remoteMessage?.data?.screen === 'NotificationScreen') {
          navigationRef.navigate('NotificationScreen');
        }
      },
    );

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage?.data?.screen === 'NotificationScreen') {
          navigationRef.navigate('NotificationScreen');
        }
      });

    return () => {
      unsubscribeOnMessage();
      unsubscribeOpenedApp();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="NotificationScreen"
            component={NotificationScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
