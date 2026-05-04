import React, { useCallback, useContext, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import AppHeader from '../components/AppHeader';
import { SCREEN_NAMES } from '../constants/labels';
import { AuthContext } from '../context/AuthContext';
import { db } from '../services/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';

const SearchIcon = ({ color = '#8F8B9E' }) => (
  <View style={styles.searchIconWrap}>
    <View style={[styles.searchCircle, { borderColor: color }]} />
    <View style={[styles.searchHandle, { backgroundColor: color }]} />
  </View>
);

const BookmarkIcon = ({ color = '#4B3F72' }) => (
  <Text style={{ color, fontSize: 22, fontWeight: '900' }}>♥️</Text>
);

const LocationIcon = () => (
  <View style={styles.locationWrap}>
    <View style={styles.locationPin} />
    <View style={styles.locationDot} />
  </View>
);

const ProgressRing = ({ percentage = 0, color, textColor, trackColor }) => {
  const size = 76;
  const strokeWidth = 9;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (circumference * percentage) / 100;

  return (
    <View style={styles.ringWrapper}>
      <Svg width={size} height={size}>
        <Circle
          stroke={trackColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={progress}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      <View style={styles.ringCenter}>
        <Text style={[styles.ringText, { color: textColor }]}>
          {percentage}%
        </Text>
      </View>
    </View>
  );
};

const SavedJobsScreen = ({ navigation }) => {
  const { colors, darkMode } = useTheme();
  const { user } = useContext(AuthContext);
  const [savedJobs, setSavedJobs] = useState([]);
  const [search, setSearch] = useState('');

  const palette = {
    pageBg: colors.background,
    cardBg: colors.card,
    text: colors.text,
    subText: colors.subText,
    primary: colors.primary || '#4B3F72',
    iconMuted: darkMode ? '#B7B2C9' : '#8F8B9E',
    placeholder: darkMode ? '#A9A5BC' : '#AAA6BE',
    border: darkMode ? '#39344E' : '#ECE7F7',
    softBg: darkMode ? '#262334' : '#F8F6FC',
    ringTrack: darkMode ? '#312D45' : '#E8E2F2',
    danger: '#D94A4A',
    green: '#36B487',
  };

  const loadSavedJobs = async () => {
  try {
    const userId = user?.uid || user?.id;

    if (!userId) {
      setSavedJobs([]);
      return;
    }

    const savedQuery = query(
      collection(db, 'savedJobs'),
      where('userId', '==', userId)
    );

    const savedSnapshot = await getDocs(savedQuery);
    const evaluationsSnapshot = await getDocs(collection(db, 'evaluations'));

    const evaluations = evaluationsSnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    const evaluationsCountByOrg = {};

    evaluations.forEach((evaluation) => {
      const orgId = evaluation.orgId || evaluation.company?.id;
      if (!orgId) return;

      evaluationsCountByOrg[orgId] =
        (evaluationsCountByOrg[orgId] || 0) + 1;
    });

    const data = savedSnapshot.docs.map((docSnap) => {
      const savedData = docSnap.data();
      const job = savedData.job || {};
      const orgId = job.orgId || savedData.orgId || job.company?.id;

      return {
        savedDocId: docSnap.id,
        ...job,
        evaluationsCount: evaluationsCountByOrg[orgId] || 0,
      };
    });

    setSavedJobs(data);
  } catch (error) {
    console.log('LOAD SAVED JOBS ERROR:', error);
    setSavedJobs([]);
  }
};

  useFocusEffect(
    useCallback(() => {
      loadSavedJobs();
    }, [user])
  );

  const filteredJobs = useMemo(() => {
    if (!search.trim()) return savedJobs;

    const q = search.trim().toLowerCase();

    return savedJobs.filter((job) => {
      const title = String(job.title || '').toLowerCase();
      const company = String(job.company || job.orgName || '').toLowerCase();
      const location = String(job.location?.city || job.location || job.city || job.workEnv || '').toLowerCase();

      return title.includes(q) || company.includes(q) || location.includes(q);
    });
  }, [savedJobs, search]);

  const handleRemove = (job) => {
  Alert.alert('إزالة الوظيفة', 'هل تريد/ين حذف هذه الوظيفة من المحفوظات؟', [
    { text: 'إلغاء', style: 'cancel' },
    {
      text: 'حذف',
      style: 'destructive',
      onPress: async () => {
        try {
          if (job.savedDocId) {
            await deleteDoc(doc(db, 'savedJobs', job.savedDocId));
          }

          setSavedJobs((prev) => prev.filter((item) => item.id !== job.id));
        } catch (error) {
          Alert.alert('خطأ', 'تعذر حذف الوظيفة من المحفوظات.');
        }
      },
    },
  ]);
};

  return (
    <View style={[styles.container, { backgroundColor: palette.pageBg }]}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={palette.pageBg}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <AppHeader
          navigation={navigation}
          leftType="bell"
          rightType="profile"
          horizontalPadding={5}
        />

        <View style={styles.titleBlock}>
          <Text style={[styles.pageTitle, { color: palette.text }]}>
            الوظائف المحفوظة
          </Text>
          <Text style={[styles.pageSubtitle, { color: palette.subText }]}>
            استعرض/ي الفرص التي قمت بحفظها للرجوع إليها لاحقًا
          </Text>
        </View>

        <View style={[styles.searchBar, { backgroundColor: palette.cardBg }]}>
          <View style={styles.searchRightIcon}>
            <SearchIcon color={palette.iconMuted} />
          </View>

          <TextInput
            style={[styles.searchInput, { color: palette.text }]}
            placeholder="ابحث/ي في الوظائف المحفوظة"
            placeholderTextColor={palette.placeholder}
            value={search}
            onChangeText={setSearch}
            textAlign="right"
          />
        </View>

        <View style={[styles.heroCard, { backgroundColor: palette.primary }]}>
          <View style={styles.heroIcon}>
            <BookmarkIcon color="#FFFFFF" />
          </View>

          <View style={styles.heroTextBlock}>
            <Text style={styles.heroTitle}>
            لديك {savedJobs.length} وظيفة محفوظة
            </Text>
            <Text style={styles.heroSubtitle}>
              يمكنك فتح التفاصيل أو إزالة الوظيفة من القائمة في أي وقت.
            </Text>
          </View>
        </View>

        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => {
            const score = Number(job.score || job.inclusivity || job.inclusivityScore || 0);
            const scoreColor =
              score >= 80 ? palette.green : score >= 60 ? '#F39A57' : palette.danger;

            return (
              <TouchableOpacity
                key={job.id}
                style={[styles.jobCard, { backgroundColor: palette.cardBg }]}
                activeOpacity={0.92}
                onPress={() =>
                  navigation.navigate(SCREEN_NAMES.JOB_DETAILS, {
                    job,
                  })
                }
              >
                <View style={styles.jobMainRow}>
                  <View style={styles.scoreBlock}>
                    <ProgressRing
                      percentage={score}
                      color={scoreColor}
                      textColor={palette.text}
                      trackColor={palette.ringTrack}
                    />
                    <Text style={[styles.scoreLabel, { color: palette.subText }]}>
                      {job.evaluationsCount > 0
                       ? `${job.evaluationsCount} تقييم`
                        : 'لا توجد تقييمات'}
                    </Text>
                  </View>

                  <View style={styles.jobInfo}>
                    <Text style={[styles.jobTitle, { color: palette.text }]}>
                      {job.title || 'فرصة وظيفية'}
                    </Text>

                    <Text style={[styles.companyName, { color: palette.subText }]}>
                      {job.company || job.orgName || 'جهة معتمدة'}
                    </Text>

                    <View style={styles.locationRow}>
                      <LocationIcon />
                      <Text style={[styles.locationText, { color: palette.text }]}>
                        {job.location?.city || job.location || job.city || job.workEnv || 'غير محدد'}
                      </Text>
                    </View>

                    <Text style={[styles.moreText, { color: palette.subText }]}>
                      اضغط/ي لعرض التفاصيل
                    </Text>
                  </View>
                </View>

                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={[
                      styles.removeButton,
                      {
                        borderColor: palette.danger,
                        backgroundColor: palette.softBg,
                      },
                    ]}
                    onPress={() => handleRemove(job)}
                    activeOpacity={0.88}
                  >
                    <Text style={[styles.removeButtonText, { color: palette.danger }]}>
                      إزالة من المحفوظات
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.detailsButton, { backgroundColor: palette.primary }]}
                    onPress={() =>
                      navigation.navigate(SCREEN_NAMES.JOB_DETAILS, {
                        job,
                      })
                    }
                    activeOpacity={0.88}
                  >
                    <Text style={styles.detailsButtonText}>التفاصيل</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor: palette.softBg,
                borderColor: palette.border,
              },
            ]}
          >
            <Text style={[styles.emptyTitle, { color: palette.text }]}>
              لا توجد وظائف محفوظة
            </Text>
            <Text style={[styles.emptyText, { color: palette.subText }]}>
              عند حفظ أي وظيفة ستظهر هنا لتتمكن/ي من الرجوع إليها لاحقًا.
            </Text>
          </View>
        )}

        <View style={{ height: 28 }} />
      </ScrollView>
    </View>
  );
};

export default SavedJobsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  titleBlock: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },

  pageTitle: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 6,
    paddingHorizontal: 10,
  },

  pageSubtitle: {
    fontSize: 13,
    lineHeight: 22,
    textAlign: 'right',
    writingDirection: 'rtl',
    paddingHorizontal: 10,
  },

  searchBar: {
    width: '100%',
    height: 52,
    borderRadius: 16,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 16,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  searchRightIcon: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingHorizontal: 8,
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  heroCard: {
    borderRadius: 26,
    padding: 18,
    marginBottom: 18,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },

  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.14)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 14,
  },

  heroTextBlock: {
    flex: 1,
    alignItems: 'flex-end',
  },

  heroTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  heroSubtitle: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: 13,
    lineHeight: 21,
    marginTop: 6,
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  jobCard: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  jobMainRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 14,
  },

  jobInfo: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: 12,
  },

  jobTitle: {
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  companyName: {
    fontSize: 13,
    marginTop: 4,
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  locationRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: 8,
  },

  locationWrap: {
    width: 12,
    height: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 6,
    position: 'relative',
  },

  locationPin: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D94A4A',
  },

  locationDot: {
    width: 2,
    height: 6,
    backgroundColor: '#7B6E8D',
    marginTop: 1,
    borderRadius: 2,
  },

  locationText: {
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  moreText: {
    fontSize: 12,
    marginTop: 18,
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  scoreBlock: {
    width: 92,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ringWrapper: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ringCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },

  ringText: {
    fontSize: 16,
    fontWeight: '900',
  },

  scoreLabel: {
    fontSize: 10,
    marginTop: 6,
    textAlign: 'center',
    writingDirection: 'rtl',
  },

  actionsRow: {
    flexDirection: 'row-reverse',
    gap: 10,
  },

  detailsButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  detailsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    writingDirection: 'rtl',
  },

  removeButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  removeButtonText: {
    fontSize: 13,
    fontWeight: '800',
    writingDirection: 'rtl',
  },

  emptyCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
    writingDirection: 'rtl',
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 13,
    lineHeight: 22,
    textAlign: 'center',
    writingDirection: 'rtl',
  },

  searchIconWrap: {
    width: 16,
    height: 16,
    position: 'relative',
  },

  searchCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.8,
    position: 'absolute',
    top: 0,
    left: 0,
  },

  searchHandle: {
    width: 7,
    height: 1.8,
    position: 'absolute',
    right: 0,
    bottom: 2,
    transform: [{ rotate: '45deg' }],
    borderRadius: 2,
  },
});