import React, { useCallback, useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
} from 'firebase/firestore';

import { useTheme } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { SCREEN_NAMES } from '../constants/labels';
import { db } from '../services/firebase';

// Custom back arrow icon
const BackArrowIcon = ({ color = '#1F1655' }) => (
  <Text style={{ color, fontSize: 28, fontWeight: '800' }}>{'‹'}</Text>
);

const OrgJobsScreen = ({ navigation }) => {
  const { colors, darkMode } = useTheme();
  const { user } = useContext(AuthContext);

  // Organization jobs state
  const [jobs, setJobs] = useState([]);

  // Screen color palette based on current theme
  const palette = {
    bg: colors.background,
    card: colors.card,
    text: colors.text,
    subText: colors.subText,
    primary: colors.primary || '#4B3F72',
    border: darkMode ? '#39344E' : '#ECE7F7',
    danger: '#D94A4A',
    softBg: darkMode ? '#262334' : '#F8F6FC',
  };

  // Load jobs created by the current organization
  const loadJobs = async () => {
    try {
      const orgId = user?.uid || user?.id;

      if (!orgId) {
        setJobs([]);
        return;
      }

      const q = query(
        collection(db, 'jobs'),
        where('orgId', '==', orgId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      setJobs(data);
    } catch (error) {
      console.log('LOAD ORG JOBS ERROR:', error);
      setJobs([]);
    }
  };

  // Reload jobs whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      loadJobs();
    }, [user])
  );

  // Delete selected job from Firestore
  const handleDelete = (job) => {
  Alert.alert(
    'حذف الفرصة',
    `هل تريدين حذف فرصة "${job.title || 'فرصة وظيفية'}"؟`,
    [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'حذف',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'jobs', job.id));
            setJobs((prev) => prev.filter((item) => item.id !== job.id));
            Alert.alert('تم الحذف', 'تم حذف الفرصة بنجاح.');
          } catch (error) {
            console.log('DELETE JOB ERROR:', error);
            Alert.alert('خطأ', 'تعذر حذف الفرصة.');
          }
        },
      },
    ]
  );
};

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={palette.bg}
      />

      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: palette.card }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <BackArrowIcon color={palette.primary} />
        </TouchableOpacity>

        <Image
          source={require('../../assets/logo2.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Page description */}
        <Text style={[styles.subtitle, { color: palette.subText }]}>
          عرض وتعديل وحذف الفرص التي أضافتها المنظمة
        </Text>

        {/* Add new job */}
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: palette.primary }]}
          onPress={() => navigation.navigate(SCREEN_NAMES.ADD_JOB)}
          activeOpacity={0.85}
        >
          <Text style={styles.addButtonText}>إضافة فرصة جديدة</Text>
        </TouchableOpacity>

        {/* Organization jobs list */}
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <View
              key={job.id}
              style={[
                styles.card,
                {
                  backgroundColor: palette.card,
                  borderColor: palette.border,
                },
              ]}
            >
              <Text style={[styles.jobTitle, { color: palette.text }]}>
                {job.title || 'فرصة وظيفية'}
              </Text>

              <Text style={[styles.jobMeta, { color: palette.subText }]}>
                {job.city || job.location?.city || job.workEnv || 'الموقع غير محدد'}
              </Text>

              <Text
                style={[styles.jobDesc, { color: palette.subText }]}
                numberOfLines={2}
              >
                {job.description || 'لا يوجد وصف مضاف لهذه الفرصة.'}
              </Text>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[styles.editButton, { backgroundColor: palette.primary }]}
                  onPress={() =>
                    navigation.navigate(SCREEN_NAMES.ADD_JOB, {
                      mode: 'edit',
                      job,
                    })
                  }
                  activeOpacity={0.85}
                >
                  <Text style={styles.editButtonText}>تعديل</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.deleteButton,
                    {
                      borderColor: palette.danger,
                      backgroundColor: palette.softBg,
                    },
                  ]}
                  onPress={() => handleDelete(job)}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.deleteButtonText,
                      { color: palette.danger },
                    ]}
                  >
                    حذف
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor: palette.card,
                borderColor: palette.border,
              },
            ]}
          >
            <Text style={[styles.emptyTitle, { color: palette.text }]}>
              لا توجد فرص مضافة
            </Text>

            <Text style={[styles.emptyText, { color: palette.subText }]}>
              عند إضافة فرصة وظيفية ستظهر هنا لإدارتها.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default OrgJobsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 52,
    marginBottom: 12,
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerSpacer: {
    width: 42,
    height: 42,
  },

  logo: {
    width: 120,
    height: 60,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  title: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 6,
    paddingHorizontal: 10,
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 22,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 16,
    paddingHorizontal: 10,
  },

  addButton: {
    minHeight: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    writingDirection: 'rtl',
  },

  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },

  jobTitle: {
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 6,
  },

  jobMeta: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 8,
  },

  jobDesc: {
    fontSize: 13,
    lineHeight: 22,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 14,
  },

  actionsRow: {
    flexDirection: 'row-reverse',
    gap: 10,
  },

  editButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    writingDirection: 'rtl',
  },

  deleteButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteButtonText: {
    fontSize: 14,
    fontWeight: '900',
    writingDirection: 'rtl',
  },

  emptyCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 8,
    writingDirection: 'rtl',
  },

  emptyText: {
    fontSize: 13,
    lineHeight: 22,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
});
