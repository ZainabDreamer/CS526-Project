import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'interviews';

// جلب كل المقابلات
export const getInterviews = async () => {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
};

// إضافة مقابلة جديدة
export const addInterview = async (interview) => {
  const list = await getInterviews();

  list.push({
    id: Date.now().toString(),
    ...interview,
  });

  await AsyncStorage.setItem(KEY, JSON.stringify(list));
};

// تحديث مقابلة
export const updateInterview = async (id, updatedData) => {
  const list = await getInterviews();

  const updated = list.map((item) =>
    item.id === id ? { ...item, ...updatedData } : item
  );

  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
};

// حذف مقابلة
export const deleteInterview = async (id) => {
  const list = await getInterviews();

  const filtered = list.filter((item) => item.id !== id);

  await AsyncStorage.setItem(KEY, JSON.stringify(filtered));
};