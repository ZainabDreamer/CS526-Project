import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'current_user';

export const getUsers = async () => {
  const existing = await AsyncStorage.getItem(USERS_KEY);
  return existing ? JSON.parse(existing) : [];
};

export const saveUser = async (user) => {
  const users = await getUsers();

  const normalizedEmail = String(user.email || '').trim().toLowerCase();
  const normalizedUsername = String(user.username || '').trim().toLowerCase();

  const exists = users.some((u) => {
    const uEmail = String(u.email || '').trim().toLowerCase();
    const uUsername = String(u.username || '').trim().toLowerCase();

    return (
      uEmail === normalizedEmail ||
      (normalizedUsername && uUsername === normalizedUsername)
    );
  });

  if (exists) {
    throw new Error('هذا الحساب مسجل مسبقًا.');
  }

  const newUser = {
    id: user.id || Date.now().toString(),
    ...user,
    email: normalizedEmail,
    username: normalizedUsername,
    createdAt: user.createdAt || new Date().toISOString(),
  };

  users.push(newUser);
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));

  return newUser;
};

export const loginUser = async (identifier, password) => {
  const users = await getUsers();

  const normalizedIdentifier = String(identifier || '').trim().toLowerCase();
  const normalizedPassword = String(password || '').trim();

  return users.find((u) => {
    const email = String(u.email || '').trim().toLowerCase();
    const username = String(u.username || '').trim().toLowerCase();
    const savedPassword = String(u.password || '').trim();

    return (
      (email === normalizedIdentifier || username === normalizedIdentifier) &&
      savedPassword === normalizedPassword
    );
  });
};

export const setCurrentUser = async (user) => {
  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const getCurrentUser = async () => {
  const user = await AsyncStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem(CURRENT_USER_KEY);
};

export const updateCurrentUser = async (updates) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error('لا يوجد مستخدم مسجل دخول.');
  }

  const users = await getUsers();

  const updatedUser = {
    ...currentUser,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const updatedUsers = users.map((u) =>
    u.id === currentUser.id ? updatedUser : u
  );

  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

  return updatedUser;
};