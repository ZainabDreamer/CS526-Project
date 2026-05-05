import React, {
  useMemo,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';

import { showOnceLocalNotification } from '../services/notificationService';
import { useTheme } from '../context/ThemeContext';
import { SCREEN_NAMES } from '../constants/labels';
import { AuthContext } from '../context/AuthContext';
import AppHeader from '../components/AppHeader';
import { db } from '../services/firebase';

const { width } = Dimensions.get('window');

const HOME_TABS = [
  { key: 'jobs', label: ' وظائف' },
  { key: 'companies', label: 'الشركات' },
  { key: 'evaluation', label: 'التقييم' },
  { key: 'map', label: 'الخريطة' },
];

// Custom search icon
const SearchIcon = ({ color = '#8F8B9E' }) => (
  <View style={styles.searchIconWrap}>
    <View style={[styles.searchCircle, { borderColor: color }]} />
    <View style={[styles.searchHandle, { backgroundColor: color }]} />
  </View>
);

// Custom filter icon
const FilterIcon = ({ color = '#8F8B9E' }) => (
  <View style={styles.filterWrap}>
    <View style={[styles.filterTop, { backgroundColor: color }]} />
    <View style={[styles.filterStem, { backgroundColor: color }]} />
  </View>
);

// Custom location icon
const LocationIcon = () => (
  <View style={styles.locationWrap}>
    <View style={styles.locationPin} />
    <View style={styles.locationDot} />
  </View>
);

// Featured card icon
const FeaturedIcon = ({ color = '#FFFFFF' }) => (
  <View style={styles.featuredIconBox}>
    <View style={[styles.iconBar1, { backgroundColor: color }]} />
    <View style={[styles.iconBar2, { backgroundColor: color }]} />
    <View style={[styles.iconBar3, { backgroundColor: color }]} />
    <View style={[styles.iconCircle, { borderColor: color }]} />
  </View>
);

// Circular score indicator
const ProgressRing = ({
  percentage,
  color,
  textColor = '#2D2D2D',
  trackColor = '#E8E2F2',
}) => {
  const size = 86;
  const strokeWidth = 10;
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

const HomeScreen = ({ navigation }) => {
  const { colors, darkMode } = useTheme();
  const { user } = useContext(AuthContext);

  const firstName = (user?.name || 'مستخدم شمولية').trim().split(' ')[0];

  // Screen states
  const [activeTab, setActiveTab] = useState('jobs');
  const [search, setSearch] = useState('');
  const [storedJobs, setStoredJobs] = useState([]);
  const [showCongrats, setShowCongrats] = useState(false);
  const [latestInterviewDate, setLatestInterviewDate] = useState(null);

  // Navigate when a notification is tapped
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const screen = response.notification.request.content.data?.screen;

        if (screen) {
          navigation.navigate(screen);
        }
      }
    );

    return () => subscription.remove();
  }, [navigation]);

  // Load jobs, evaluations, and interview notification status
  useFocusEffect(
    useCallback(() => {
      const loadJobs = async () => {
        try {
          setActiveTab('jobs');

          const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
          const snapshot = await getDocs(q);
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

          const jobs = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }));

          const mappedJobs = jobs.map((job) => {
            const score = Number(job.inclusivityScore ?? 0);
            const evaluationsCount = evaluationsCountByOrg[job.orgId] || 0;

            return {
              ...job,
              title: job.title || 'فرصة وظيفية',
              location: job.location?.city || job.city || job.workEnv || 'غير محدد',
              company: job.company || job.orgName || 'جهة معتمدة',
              orgId: job.orgId || null,
              orgName: job.orgName || job.company || 'جهة معتمدة',
              score,
              scoreColor:
                score >= 80 ? '#56B692' : score >= 60 ? '#F39A57' : '#D94A4A',
              evaluationsCount,
              scoreLabel:
                evaluationsCount > 0 ? `${evaluationsCount} تقييم` : 'لا توجد تقييمات',
              tags: [
                job.location?.city || job.city || 'موقع غير محدد',
                job.workEnv || 'بيئة غير محددة',
                job.vacancies ? `${job.vacancies} شواغر` : 'فرصة متاحة',
              ],
            };
          });

          setStoredJobs(mappedJobs);

          const userId = user?.uid || user?.id;

          if (userId) {
            const interviewsQuery = query(
              collection(db, 'interviews'),
              where('applicantId', '==', userId)
            );

            const interviewsSnapshot = await getDocs(interviewsQuery);

            if (!interviewsSnapshot.empty) {
              const interviews = interviewsSnapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data(),
              }));

              const sortedInterviews = interviews.sort((a, b) => {
                const aDate = a.date ? new Date(a.date) : new Date(0);
                const bDate = b.date ? new Date(b.date) : new Date(0);

                return bDate - aDate;
              });

              const latest = sortedInterviews[0];
              const latestDate = latest?.date || null;

              setLatestInterviewDate(latestDate);

              const storageKey = `lastSeenInterviewDate_${userId}`;
              const lastSeen = await AsyncStorage.getItem(storageKey);

              if (
                latestDate &&
                (!lastSeen || new Date(latestDate) > new Date(lastSeen))
              ) {
                setShowCongrats(true);

                await showOnceLocalNotification(
                  `newInterview_${userId}_${latest?.id || latestDate}`,
                  'مبروك! 🎉',
                  'تم تحديد مقابلة وظيفية جديدة لك.',
                  { screen: SCREEN_NAMES.JOB_SEEKER_INTERVIEWS },
                  userId
                );
              } else {
                setShowCongrats(false);
              }
            } else {
              setShowCongrats(false);
            }
          } else {
            setShowCongrats(false);
          }
        } catch (error) {
          console.log('LOAD FIREBASE JOBS ERROR:', error);
          setStoredJobs([]);
          setShowCongrats(false);
        }
      };

      loadJobs();
    }, [user])
  );

  // Screen color palette based on current theme
  const palette = {
    pageBg: colors.background,
    cardBg: colors.card,
    text: colors.text,
    subText: colors.subText,
    primary: '#4B3F72',
    iconMuted: darkMode ? '#B7B2C9' : '#8F8B9E',
    placeholder: darkMode ? '#A9A5BC' : '#AAA6BE',
    mutedText: darkMode ? '#B0ACC2' : '#B0AEBB',
    ringTrackColor: darkMode ? '#312D45' : '#E8E2F2',
    sectionLink: '#36B487',
    emptyBg: darkMode ? '#262334' : '#F8F6FC',
    emptyBorder: darkMode ? '#39344E' : '#ECE7F7',
    heroBorder: darkMode ? '#3A3650' : '#F0ECF8',
  };

  // Featured jobs shown horizontally
  const filteredFeatured = useMemo(() => {
    const source = storedJobs.slice(0, 5);

    if (!search.trim()) return source;

    const q = search.trim().toLowerCase();

    return source.filter((item) => {
      const company = String(item.company || '').toLowerCase();
      const title = String(item.title || '').toLowerCase();

      return company.includes(q) || title.includes(q);
    });
  }, [search, storedJobs]);

  const allJobs = useMemo(() => storedJobs, [storedJobs]);

  // All jobs filtered by search text
  const filteredJobs = useMemo(() => {
    if (!search.trim()) return allJobs;

    const q = search.trim().toLowerCase();

    return allJobs.filter((item) => {
      const title = String(item.title || '').toLowerCase();
      const location = String(item.location || '').toLowerCase();
      const company = String(item.company || '').toLowerCase();

      return title.includes(q) || location.includes(q) || company.includes(q);
    });
  }, [search, allJobs]);

  // Handle top tab navigation
  const handleTabPress = (key) => {
    setActiveTab(key);

    if (key === 'companies') {
      navigation.navigate(SCREEN_NAMES.COMPANIES);
      return;
    }

    if (key === 'evaluation') {
      navigation.navigate(SCREEN_NAMES.EVALUATION);
      return;
    }

    if (key === 'map') {
      navigation.navigate(SCREEN_NAMES.MAP);
      return;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.pageBg }]}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={palette.pageBg}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <AppHeader
          navigation={navigation}
          leftType="bell"
          rightType="profile"
          horizontalPadding={5}
        />

        {/* Welcome text */}
        <View style={styles.welcomeBlock}>
          <Text
            style={[styles.welcomeLine, { color: palette.text }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            مرحبًا بك ، {firstName}
          </Text>
        </View>

        {/* New interview congratulations card */}
        {showCongrats && (
          <TouchableOpacity
            style={styles.congratsCard}
            activeOpacity={0.9}
            onPress={async () => {
              const userId = user?.uid || user?.id;

              if (userId && latestInterviewDate) {
                await AsyncStorage.setItem(
                  `lastSeenInterviewDate_${userId}`,
                  latestInterviewDate
                );
              }

              setShowCongrats(false);
              navigation.navigate(SCREEN_NAMES.JOB_SEEKER_INTERVIEWS);
            }}
          >
            <Text style={styles.congratsTitle}>🎉 مبروك!</Text>

            <Text style={styles.congratsText}>
              تم قبولك لمقابلة وظيفية جديدة، اضغطي هنا لعرض التفاصيل.
            </Text>
          </TouchableOpacity>
        )}

        {/* Search bar */}
        <View style={[styles.searchBar, { backgroundColor: palette.cardBg }]}>
          <View style={styles.searchRightIcon}>
            <SearchIcon color={palette.iconMuted} />
          </View>

          <TextInput
            style={[styles.searchInput, { color: palette.text }]}
            placeholder="ابحث عن وظيفة"
            placeholderTextColor={palette.placeholder}
            value={search}
            onChangeText={setSearch}
            textAlign="right"
          />

          <View style={styles.searchLeftIcon}>
            <FilterIcon color={palette.iconMuted} />
          </View>
        </View>

        {/* Home tabs */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabsRow}>
            {HOME_TABS.map((tab, index) => {
              const isActive = activeTab === tab.key;

              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[
                    styles.tabButton,
                    {
                      backgroundColor: isActive ? palette.primary : palette.cardBg,
                      borderColor: isActive ? palette.primary : palette.heroBorder,
                      marginLeft: index === HOME_TABS.length - 1 ? 0 : 8,
                    },
                  ]}
                  onPress={() => handleTabPress(tab.key)}
                  activeOpacity={0.88}
                >
                  <Text
                    style={[
                      styles.tabButtonText,
                      { color: isActive ? '#FFFFFF' : palette.text },
                    ]}
                    numberOfLines={1}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Featured opportunities section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>
            جهات وفرص بارزة
          </Text>

          <Text style={[styles.sectionSubtle, { color: palette.subText }]}>
            مميزة لك
          </Text>
        </View>

        {filteredFeatured.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.featuredScroll}
            contentContainerStyle={styles.featuredScrollContent}
          >
            {filteredFeatured.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.featuredCardTouch,
                  index === filteredFeatured.length - 1 && styles.featuredLastCard,
                ]}
                activeOpacity={0.92}
                onPress={() =>
                  navigation.navigate(SCREEN_NAMES.JOB_DETAILS, {
                    job: item,
                  })
                }
              >
                <LinearGradient
                  colors={['#4B3F72', '#40357E', '#312767']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.featuredCard}
                >
                  <View style={styles.featuredContent}>
                    <FeaturedIcon color="#FFFFFF" />

                    <View style={styles.featuredInfo}>
                      <Text
                        style={styles.featuredCompany}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.company}
                      </Text>

                      <Text
                        style={styles.featuredTitle}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {item.title}
                      </Text>

                      <View style={styles.tagRow}>
                        {(item.tags || []).map((tag) => (
                          <View key={tag} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View
            style={[
              styles.emptyHorizontalCard,
              {
                backgroundColor: palette.emptyBg,
                borderColor: palette.emptyBorder,
              },
            ]}
          >
            <Text style={[styles.emptyTitle, { color: palette.text }]}>
              لا توجد نتائج مطابقة
            </Text>

            <Text style={[styles.emptySubText, { color: palette.subText }]}>
              جرّب كلمة بحث مختلفة لعرض الجهات أو الفرص المناسبة.
            </Text>
          </View>
        )}

        {/* Current jobs section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>
            الفرص الحالية
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate(SCREEN_NAMES.MAP)}
            activeOpacity={0.85}
          >
            <Text style={styles.sectionLink}>انظر للخريطة</Text>
          </TouchableOpacity>
        </View>

        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
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
              <View style={styles.jobProgressBlock}>
                <ProgressRing
                  percentage={job.score}
                  color={job.scoreColor}
                  textColor={palette.text}
                  trackColor={palette.ringTrackColor}
                />

                <Text style={[styles.scoreLabel, { color: palette.text }]}>
                  {job.scoreLabel}
                </Text>
              </View>

              <View style={styles.jobTextBlock}>
                <Text style={[styles.jobTitle, { color: palette.text }]}>
                  {job.title}
                </Text>

                <View style={styles.locationRow}>
                  <LocationIcon />

                  <Text style={[styles.jobLocation, { color: palette.text }]}>
                    {job.location}
                  </Text>
                </View>

                <Text style={[styles.moreText, { color: palette.mutedText }]}>
                  للمزيد من التفاصيل
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View
            style={[
              styles.emptyVerticalCard,
              {
                backgroundColor: palette.emptyBg,
                borderColor: palette.emptyBorder,
              },
            ]}
          >
            <Text style={[styles.emptyTitle, { color: palette.text }]}>
              لا توجد وظائف حالية
            </Text>

            <Text style={[styles.emptySubText, { color: palette.subText }]}>
              لم يتم العثور على وظائف تطابق بحثك الحالي.
            </Text>
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    alignItems: 'stretch',
  },

  welcomeBlock: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 16,
  },

  welcomeLine: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    alignSelf: 'stretch',
    paddingHorizontal: 10,
  },

  searchBar: {
    width: '100%',
    height: 52,
    borderRadius: 16,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 18,
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

  searchLeftIcon: {
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

  filterWrap: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterTop: {
    width: 12,
    height: 2,
    borderRadius: 2,
  },

  filterStem: {
    width: 4,
    height: 7,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    marginTop: 1,
  },

  tabsContainer: {
    marginBottom: 22,
  },

  tabsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  tabButton: {
    flex: 1,
    height: 42,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderWidth: 1,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },

  tabButtonText: {
    fontSize: 11,
    fontWeight: '700',
    writingDirection: 'rtl',
    textAlign: 'center',
  },

  sectionHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    writingDirection: 'rtl',
    textAlign: 'right',
    paddingHorizontal: 10,
  },

  sectionSubtle: {
    fontSize: 13,
    fontWeight: '700',
    writingDirection: 'rtl',
    textAlign: 'left',
  },

  sectionLink: {
    fontSize: 13,
    color: '#36B487',
    fontWeight: '700',
    writingDirection: 'rtl',
    textDecorationLine: 'underline',
    textDecorationColor: '#36B487',
    textAlign: 'left',
  },

  featuredScroll: {
    marginBottom: 20,
    marginHorizontal: -20,
    transform: [{ scaleX: -1 }],
  },

  featuredScrollContent: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },

  featuredCardTouch: {
    width: width - 68,
    marginLeft: 14,
    transform: [{ scaleX: -1 }],
  },

  featuredLastCard: {
    marginRight: 0,
  },

  featuredCard: {
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 18,
    minHeight: 182,
    justifyContent: 'center',
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },

  featuredContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  featuredIconBox: {
    width: 74,
    height: 74,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
    position: 'relative',
  },

  iconBar1: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    width: 4,
    height: 28,
    borderRadius: 2,
  },

  iconBar2: {
    position: 'absolute',
    left: 26,
    bottom: 16,
    width: 4,
    height: 40,
    borderRadius: 2,
  },

  iconBar3: {
    position: 'absolute',
    left: 36,
    bottom: 16,
    width: 4,
    height: 20,
    borderRadius: 2,
  },

  iconCircle: {
    position: 'absolute',
    right: 10,
    top: 18,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
  },

  featuredInfo: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 12,
    minWidth: 0,
  },

  featuredCompany: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'right',
    writingDirection: 'rtl',
    width: '100%',
  },

  featuredTitle: {
    marginTop: 6,
    fontSize: 14,
    color: 'rgba(255,255,255,0.88)',
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 20,
    width: '100%',
  },

  tagRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    marginTop: 16,
    alignSelf: 'flex-end',
  },

  tag: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginLeft: 8,
    marginBottom: 8,
  },

  tagText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
    writingDirection: 'rtl',
  },

  jobCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  jobTextBlock: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: 8,
  },

  jobTitle: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  locationRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: 6,
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

  jobLocation: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  moreText: {
    marginTop: 24,
    fontSize: 12,
    writingDirection: 'rtl',
    textAlign: 'right',
    alignSelf: 'flex-end',
  },

  jobProgressBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
  },

  ringWrapper: {
    width: 86,
    height: 86,
    justifyContent: 'center',
    alignItems: 'center',
  },

  ringCenter: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },

  ringText: {
    fontSize: 18,
    fontWeight: '800',
  },

  scoreLabel: {
    marginTop: 8,
    fontSize: 10,
    textAlign: 'center',
    writingDirection: 'rtl',
    lineHeight: 14,
  },

  emptyHorizontalCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    justifyContent: 'center',
    marginBottom: 20,
  },

  emptyVerticalCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    alignItems: 'flex-end',
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    writingDirection: 'rtl',
    textAlign: 'right',
    marginBottom: 6,
  },

  emptySubText: {
    fontSize: 13,
    lineHeight: 22,
    writingDirection: 'rtl',
    textAlign: 'right',
  },

  congratsCard: {
    backgroundColor: '#4B3F72',
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },

  congratsTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 6,
  },

  congratsText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 22,
  },
});

export default HomeScreen;
