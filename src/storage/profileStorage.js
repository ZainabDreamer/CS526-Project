import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'profile';

export const saveProfile = async (profile) => {
  await AsyncStorage.setItem(KEY, JSON.stringify(profile));
};

export const getProfile = async () => {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : null;
};