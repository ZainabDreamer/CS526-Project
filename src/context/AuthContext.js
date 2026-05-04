import React, { createContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../services/firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setUser(null);
          setAuthLoading(false);
          return;
        }

        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUser({
            id: firebaseUser.uid,
            uid: firebaseUser.uid,
            ...userSnap.data(),
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.log('Auth state error:', error);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const register = async (data) => {
    try {
      const { password, confirmPassword, ...safeData } = data;

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email.trim(),
        password
      );

      const uid = userCredential.user.uid;

      const newUser = {
      ...safeData,
      id: uid,
      uid,
      email: data.email.trim().toLowerCase(),
      username: data.username?.trim().toLowerCase() || '',
      createdAt: serverTimestamp(),
      };
      await setDoc(doc(db, 'users', uid), newUser);

      setUser(newUser);

      return {
        success: true,
        user: newUser,
      };
    } catch (error) {
      console.log('Register error:', error);

      return {
        success: false,
        message:
          error.code === 'auth/email-already-in-use'
            ? 'البريد الإلكتروني مستخدم مسبقًا.'
            : error.code === 'auth/weak-password'
            ? 'الرمز السري ضعيف. يجب أن يكون 6 أحرف على الأقل.'
            : 'تعذر إنشاء الحساب.',
      };
    }
  };

  const login = async (identifier, password, role = null) => {
    try {
      const cleanIdentifier = identifier.trim().toLowerCase();
      let emailToLogin = cleanIdentifier;

      if (!cleanIdentifier.includes('@')) {
        const q = query(
          collection(db, 'users'),
          where('username', '==', cleanIdentifier)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          return {
            success: false,
            user: null,
            message: 'اسم المستخدم غير موجود.',
          };
        }

        emailToLogin = snapshot.docs[0].data().email;
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailToLogin,
        password
      );

      const uid = userCredential.user.uid;
      const userSnap = await getDoc(doc(db, 'users', uid));

      if (!userSnap.exists()) {
        return {
          success: false,
          user: null,
          message: 'لم يتم العثور على بيانات الحساب.',
        };
      }

      const foundUser = {
        id: uid,
        uid,
        ...userSnap.data(),
      };

      if (role && foundUser.role !== role) {
        await signOut(auth);
        return {
          success: false,
          user: null,
          message: 'نوع الحساب المحدد غير مطابق لهذا المستخدم.',
        };
      }

      setUser(foundUser);

      return {
        success: true,
        user: foundUser,
      };
    } catch (error) {
      console.log('Login error:', error);

      return {
        success: false,
        user: null,
        message: 'بيانات الدخول غير صحيحة.',
      };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};