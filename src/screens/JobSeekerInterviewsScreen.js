import React, { useContext, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import AppHeader from '../components/AppHeader';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { db } from '../services/firebase';
import {
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { SCREEN_NAMES } from '../constants/labels';

const JobSeekerInterviewsScreen = ({ navigation }) => {
  const { colors, darkMode } = useTheme();
  const { user } = useContext(AuthContext);

  const [interviews, setInterviews] = useState([]);

  const palette = {
    bg: colors.background,
    card: colors.card,
    text: colors.text,
    subText: colors.subText,
    primary: colors.primary,
    border: darkMode ? '#39344E' : '#ECE7F7',
    softBg: darkMode ? '#2A273A' : '#F8F6FC',
  };

  // Firebase
  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        try {
          const userId = user?.uid || user?.id;

          if (!userId) return;

          const q = query(
            collection(db, 'interviews'),
            where('applicantId', '==', userId)
          );

          const snapshot = await getDocs(q);

          const data = snapshot.docs.map((doc) => {
            const item = doc.data();

            const dateObj = item.date?.toDate
              ? item.date.toDate()
              : new Date(item.date);

            return {
              id: doc.id,
              title: item.jobTitle || 'مقابلة وظيفية',
              company: item.orgName || 'جهة توظيف',
              date: dateObj.toLocaleDateString('ar-SA'),
              time: dateObj.toLocaleTimeString('ar-SA', {
                hour: '2-digit',
                minute: '2-digit',
              }),
              mode: item.type || 'عن بعد',
              location:
                item.type === 'عن بعد' ? 'عن بعد' : 'مقر الجهة',
              raw: item,
            };
          });

          setInterviews(data);
        } catch (e) {
          console.log('LOAD INTERVIEWS ERROR:', e);
        }
      };

      load();
    }, [user])
  );

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={palette.bg}
      />

      <AppHeader navigation={navigation} showBack />

      <ScrollView contentContainerStyle={styles.content}>
        
        <Text style={[styles.title, { color: palette.text }]}>
          المقابلات
        </Text>

        <Text style={[styles.subTitle, { color: palette.subText }]}>
          جميع مواعيد المقابلات الخاصة بك
        </Text>

        {interviews.length === 0 ? (
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
              لا توجد مقابلات حالياً
            </Text>

            <Text style={[styles.emptyText, { color: palette.subText }]}>
              سيتم عرض المقابلات هنا عند تحديد موعد لك من قبل الجهة.
            </Text>
          </View>
        ) : (
          interviews.map((item) => (
            <View
              key={item.id}
              style={[styles.card, { backgroundColor: palette.card }]}
            >
              <View style={styles.cardTop}>
                
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.mode}</Text>
                </View>

                <View style={styles.textWrap}>
                  <Text style={[styles.jobTitle, { color: palette.text }]}>
                    {item.title}
                  </Text>

                  <Text style={[styles.company, { color: palette.subText }]}>
                    {item.company}
                  </Text>

                  <Text style={[styles.meta, { color: palette.primary }]}>
                    {item.date} • {item.time}
                  </Text>

                  <Text style={[styles.location, { color: palette.subText }]}>
                    {item.location}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: palette.primary },
                ]}
                onPress={() =>
                  navigation.navigate(
                    SCREEN_NAMES.JOB_SEEKER_INTERVIEW_DETAILS,
                    { interview: item }
                  )
                }
              >
                <Text style={styles.buttonText}>عرض التفاصيل</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default JobSeekerInterviewsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 30,
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 4,
    paddingHorizontal: 10,
  },

  subTitle: {
    fontSize: 13,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 16,
    paddingHorizontal: 10,
  },

  card: {
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },

  cardTop: {
    flexDirection: 'row-reverse',
    alignItems: 'center' ,
    marginBottom: 12,
  },

  textWrap: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 2,
  },

  jobTitle: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'right',
  },

  company: {
    fontSize: 13,
    marginTop: 4,
    textAlign: 'right',
  },

  meta: {
    fontSize: 13,
    marginTop: 4,
    fontWeight: '700',
  },

  location: {
    fontSize: 12,
    marginTop: 2,
  },

  badge: {
  minWidth: 86,
  height: 86,
  borderRadius: 18,
  backgroundColor: '#F0ECFA',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 14,
},

badgeText: {
  color: '#1F1655',
  fontSize: 15,
  fontWeight: '800',
  writingDirection: 'rtl',
  textAlign: 'center',
  },

  button: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },

  emptyCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 13,
    textAlign: 'center',
  },
});
