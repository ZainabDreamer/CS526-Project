import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'applications';

export const addApplication = async (app) => {
  const data = await AsyncStorage.getItem(KEY);
  const list = data ? JSON.parse(data) : [];

  list.push(app);
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
};