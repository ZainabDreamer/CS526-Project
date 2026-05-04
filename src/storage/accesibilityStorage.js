import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'accessibility_issues';

export const getIssues = async () => {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
};

export const addIssue = async (issue) => {
  const list = await getIssues();

  list.push({
    id: Date.now().toString(),
    status: 'pending',
    ...issue,
  });

  await AsyncStorage.setItem(KEY, JSON.stringify(list));
};

export const addResponse = async (id, response) => {
  const list = await getIssues();

  const updated = list.map((item) =>
    item.id === id
      ? {
          ...item,
          response,
          status: 'resolved',
          respondedAt: new Date().toISOString(),
        }
      : item
  );

  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
};

export const deleteIssue = async (id) => {
  const list = await getIssues();
  const filtered = list.filter((item) => item.id !== id);
  await AsyncStorage.setItem(KEY, JSON.stringify(filtered));
};