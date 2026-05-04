import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'evaluations';

export const getEvaluations = async () => {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
};

export const addEvaluation = async (evaluation) => {
  const list = await getEvaluations();
  list.push(evaluation);
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
};