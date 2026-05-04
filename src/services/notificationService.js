import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermission = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
  }

  return finalStatus === 'granted';
};

export const getStoredNotifications = async (userId) => {
  if (!userId) return [];

  const raw = await AsyncStorage.getItem(`notifications_${userId}`);
  return raw ? JSON.parse(raw) : [];
};

export const saveNotificationToCenter = async ({
  userId,
  id,
  title,
  body,
  data = {},
}) => {
  if (!userId || !id) return;

  const current = await getStoredNotifications(userId);

  const exists = current.some((item) => item.id === id);
  if (exists) return;

  const newNotification = {
    id,
    title,
    body,
    data,
    read: false,
    createdAt: new Date().toISOString(),
  };

  await AsyncStorage.setItem(
    `notifications_${userId}`,
    JSON.stringify([newNotification, ...current])
  );
};

export const markNotificationAsRead = async (userId, notificationId) => {
  const current = await getStoredNotifications(userId);

  const updated = current.map((item) =>
    item.id === notificationId ? { ...item, read: true } : item
  );

  await AsyncStorage.setItem(`notifications_${userId}`, JSON.stringify(updated));
};

export const markAllNotificationsAsRead = async (userId) => {
  const current = await getStoredNotifications(userId);

  const updated = current.map((item) => ({ ...item, read: true }));

  await AsyncStorage.setItem(`notifications_${userId}`, JSON.stringify(updated));
};

export const showLocalNotification = async (title, body, data = {}) => {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: 'default',
      data,
    },
    trigger: null,
  });
};

export const showOnceLocalNotification = async (
  key,
  title,
  body,
  data = {},
  userId = null
) => {
  const alreadyShown = await AsyncStorage.getItem(key);
  if (alreadyShown) return;

  if (userId) {
    await saveNotificationToCenter({
      userId,
      id: key,
      title,
      body,
      data,
    });
  }

  await showLocalNotification(title, body, data);

  await AsyncStorage.setItem(key, 'shown');
};