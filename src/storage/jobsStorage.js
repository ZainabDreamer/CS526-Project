import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'saved_jobs';

export const getJobs = async () => {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
};

export const addJob = async (job) => {
  const jobs = await getJobs();
  jobs.push(job);
  await AsyncStorage.setItem(KEY, JSON.stringify(jobs));
};

export const removeJob = async (id) => {
  const jobs = await getJobs();
  const updated = jobs.filter((j) => j.id !== id);
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
};