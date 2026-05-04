import React, { useMemo, useState, useCallback, useContext } from 'react';
import { showOnceLocalNotification } from '../services/notificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { SCREEN_NAMES } from '../constants/labels';
import { useTheme } from '../context/ThemeContext';
import AppHeader from '../components/AppHeader';
import { db } from '../services/firebase';
import {
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore'; 

const SearchIcon = ({ color = '#8F8B9E' }) => (
  <View style={styles.searchIconWrap}>
    <View style={[styles.searchCircle, { borderColor: color }]} />
    <View style={[styles.searchHandle, { backgroundColor: color }]} />
  </View>
);

const FilterIcon = ({ color = '#8F8B9E' }) => (
  <View style={styles.filterWrap}>
    <View style={[styles.filterTop, { backgroundColor: color }]} />
    <View style={[styles.filterStem, { backgroundColor: color }]} />
  </View>
);

const LocationIcon = () => (
  <View style={styles.locationWrap}>
    <View style={styles.locationPin} />
    <View style={styles.locationDot} />
  </View>
);

const EvaluationScreen = ({ navigation }) => {
  const theme = useTheme();
  const darkMode = theme?.darkMode ?? false;
  const colors = theme?.colors ?? {
    background: '#F3F1FA',
    card: '#FFFFFF',
    text: '#111111',
    subText: '#6E6A8A',
    primary: '#4B3F72',
  };

  const [activeTab, setActiveTab] = useState('current');
  const [search, setSearch] = useState('');
  const { user } = useContext(AuthContext);
  const [companies, setCompanies] = useState([]);
  const [evaluations, setEvaluations] = useState([]);

  const palette = {
    pageBg: colors.background,
    cardBg: colors.card,
    text: colors.text,
    subText: colors.subText,
    primary: '#4B3F72',
    iconMuted: darkMode ? '#B7B2C9' : '#8F8B9E',
    placeholder: darkMode ? '#A9A5BC' : '#AAA6BE',
    mutedText: darkMode ? '#B7B2C9' : '#B0AEBB',
    softBg: darkMode ? '#2A273A' : '#F8F6FC',
    softBorder: darkMode ? '#3A3650' : '#ECE7F7',
    tabBg: darkMode ? '#262334' : '#FFFFFF',
    tabBorder: darkMode ? '#39344E' : '#ECE7F7',
    emptyBg: darkMode ? '#262334' : '#F8F6FC',
    emptyBorder: darkMode ? '#39344E' : '#ECE7F7',
    bannerSubText: 'rgba(255,255,255,0.85)',
    bannerAccent: '#56B692',
  };


  useFocusEffect(
  useCallback(() => {
    const loadData = async () => {
      try {
        const userId = user?.uid || user?.id;

        const jobsSnapshot = await getDocs(collection(db, 'jobs'));
        const evaluationsSnapshot = await getDocs(
          query(
            collection(db, 'evaluations'),
            where('userId', '==', userId)
          )
        );

        const jobs = jobsSnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        const evaluations = evaluationsSnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

// 🔔 جلب الردود التي تم عرضها سابقًا
const storageKey = `seenReplies_${userId}`;
const stored = await AsyncStorage.getItem(storageKey);
const seenReplies = stored ? JSON.parse(stored) : [];

const updatedSeen = [...seenReplies];

// 🔔 إرسال إشعار فقط للجديد
for (const evaluation of evaluations) {
  if (evaluation.orgReply?.text && !seenReplies.includes(evaluation.id)) {
    await showOnceLocalNotification(
  `orgReply_${userId}_${evaluation.id}`,
  'وصل رد من الجهة',
  `ردت ${evaluation.orgName || evaluation.company?.name || 'الجهة'} على تقييمك.`,
  { screen: SCREEN_NAMES.EVALUATION },
  userId
);

    updatedSeen.push(evaluation.id);
  }
}

// 🔔 تحديث التخزين
await AsyncStorage.setItem(storageKey, JSON.stringify(updatedSeen));

        const uniqueCompanies = {};

        jobs.forEach((job) => {
          const orgId = job.orgId || job.orgName;

          if (!uniqueCompanies[orgId]) {
            uniqueCompanies[orgId] = {
              id: orgId,
              orgId,
              name: job.orgName || 'شركة غير محددة',
              orgName: job.orgName || 'شركة غير محددة',
              city: job.location?.city || job.city || job.workEnv || 'غير محدد',
              jobs: [job],
            };
          } else {
            uniqueCompanies[orgId].jobs.push(job);
          }
        });

       setCompanies(Object.values(uniqueCompanies));
       setEvaluations(evaluations);

      } catch (error) {
        console.log('LOAD EVALUATION COMPANIES ERROR:', error);
        setCompanies([]);
        setEvaluations([]);
      }
    };

    loadData();
  }, [user])
);

  const filteredCompanies = useMemo(() => {
  const evaluatedIds = evaluations.map((e) => e.company?.id || e.orgId);

  const base =
    activeTab === 'current'
      ? companies
          .filter((company) => !evaluatedIds.includes(company.id))
          .map((company) => ({ ...company, evaluation: null }))
      : companies
          .filter((company) => evaluatedIds.includes(company.id))
          .map((company) => {
            const evaluation = evaluations.find(
              (e) => (e.company?.id || e.orgId) === company.id
            );

            return {
              ...company,
              evaluation,
            };
          });

  if (!search.trim()) return base;

  const q = search.trim().toLowerCase();

  return base.filter((company) => {
    const name = String(company.name || '').toLowerCase();
    const city = String(company.city || '').toLowerCase();
    return name.includes(q) || city.includes(q);
  });
}, [activeTab, search, companies, evaluations]);

  return (
    <View style={[styles.container, { backgroundColor: palette.pageBg }]}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={palette.pageBg}
      />

      <AppHeader
        navigation={navigation}
        leftType="bell"
        rightType="profile"
        horizontalPadding={25}
      />

      
      <View style={[styles.searchBar, { backgroundColor: palette.cardBg }]}>
        <View style={styles.searchRightIcon}>
          <SearchIcon color={palette.iconMuted} />
        </View>

        <TextInput
          style={[styles.searchInput, { color: palette.text }]}
          placeholder="ابحث عن جهة للتقييم"
          value={search}
          onChangeText={setSearch}
          textAlign="right"
          placeholderTextColor={palette.placeholder}
        />

        <View style={styles.searchLeftIcon}>
          <FilterIcon color={palette.iconMuted} />
        </View>
      </View>

      
      <LinearGradient
        colors={['#4B3F72', '#40357E', '#312767']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.banner}
      >
        <Text style={styles.bannerText}>
          التقييم الصحيح لبيئة <Text style={styles.bannerHighlight}>شاملة</Text>
        </Text>
        <Text style={[styles.bannerSubText, { color: palette.bannerSubText }]}>
          شارك تجربتك وساهم في بناء بيئة عمل أكثر شمولية
        </Text>
      </LinearGradient>

      
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: palette.cardBg }]}
          activeOpacity={0.85}
        >
          <FilterIcon color={palette.iconMuted} />
        </TouchableOpacity>

        <View
  style={[
    styles.tabs,
    {
      backgroundColor: palette.tabBg,
      borderColor: palette.tabBorder,
    },
  ]}
>

  <TouchableOpacity
             style={[
              styles.tab,
              activeTab === 'current' && { backgroundColor: palette.primary },
                      ]}
                     onPress={() => setActiveTab('current')}
                     activeOpacity={0.88}
                     >
                    <Text
                    style={[
                    styles.tabText,
                    { color: activeTab === 'current' ? '#FFFFFF' : palette.text },
                         ]}
                        >
                   الحالي
            </Text>
           </TouchableOpacity>

           <TouchableOpacity
    style={[
      styles.tab,
      activeTab === 'previous' && { backgroundColor: palette.primary },
    ]}
    onPress={() => setActiveTab('previous')}
    activeOpacity={0.88}
  >
    <Text
      style={[
        styles.tabText,
        { color: activeTab === 'previous' ? '#FFFFFF' : palette.text },
      ]}
    >
      السابق
    </Text>
  </TouchableOpacity>
         </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>
            جهات التقييم
          </Text>
          <Text style={[styles.sectionSubtle, { color: palette.subText }]}>
            {activeTab === 'current' ? 'الجهات الحالية' : 'الجهات السابقة'}
          </Text>
        </View>

        {filteredCompanies.length > 0 ? (
  filteredCompanies.map((company) => (
    <View
      key={company.id}
      style={[styles.companyCard, { backgroundColor: palette.cardBg }]}
    >
      <View style={styles.companyInfo}>
        <Text style={[styles.companyName, { color: palette.text }]}>
          {company.name}
        </Text>

        <View style={styles.locationRow}>
          <LocationIcon />
          <Text style={[styles.companyCity, { color: palette.subText }]}>
            {company.city}
          </Text>
        </View>

        {activeTab === 'previous' && company.evaluation?.orgReply?.text && (
          <View style={styles.replyBox}>
            <Text style={styles.replyTitle}>رد الجهة</Text>
            <Text style={styles.replyText}>
              {company.evaluation.orgReply.text}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: palette.primary }]}
        onPress={() =>
          navigation.navigate(SCREEN_NAMES.EVALUATION_FORM, {
            company,
            mode: activeTab,
            evaluation: company.evaluation,
          })
        }
        activeOpacity={0.88}
      >
        <Text style={styles.addBtnText}>
          {activeTab === 'current' ? 'أضف تقييمك' : 'الوصول إلى تقييمك'}
        </Text>
      </TouchableOpacity>
    </View>
  ))
) : (
  <View
    style={[
      styles.emptyCard,
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
      جرّب البحث باسم جهة أخرى أو غيّر نوع القائمة من الحالي إلى السابق.
    </Text>
  </View>
)}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  searchBar: {
    height: 50,
    borderRadius: 14,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginHorizontal: 20,
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

  banner: {
    marginHorizontal: 20,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 25,
    marginBottom: 18,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },

  bannerText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'right',
    fontWeight: '700',
    writingDirection: 'rtl',
  },

  bannerHighlight: {
    color: '#56B692',
    fontWeight: '800',
  },

  bannerSubText: {
    fontSize: 13,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: 8,
    lineHeight: 20,
  },

  tabRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
  },

  filterButton: {
    width: 42,
    height: 42,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },

  tabs: {
    flex: 1,
    flexDirection: 'row-reverse',
    borderRadius: 18,
    padding: 4,
    borderWidth: 1,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },

  tab: {
    flex: 1,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },

  activeTab: {},

  tabText: {
    fontSize: 14,
    fontWeight: '700',
    writingDirection: 'rtl',
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  },

  sectionSubtle: {
    fontSize: 13,
    fontWeight: '700',
    writingDirection: 'rtl',
    textAlign: 'left',
  },

  companyCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  cardTop: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  companyInfo: {
   alignItems: 'flex-end',
   width: '100%',
  },

  companyName: {
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

  companyCity: {
    fontSize: 14,
    textAlign: 'right',
    writingDirection: 'rtl',
    fontWeight: '700',
  },

  moreDetails: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
    writingDirection: 'rtl',
  },

  addBtn: {
  marginTop: 14,
  borderRadius: 14,
  paddingVertical: 12,
  paddingHorizontal: 16,
  width: '100%',
  alignItems: 'center',
},

  addBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    writingDirection: 'rtl',
  },

  emptyCard: {
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

  replyBox: {
  width: '100%',
  backgroundColor: '#F8F6FC',
  borderRadius: 14,
  padding: 12,
  marginTop: 12,
  borderWidth: 1,
  borderColor: '#ECE7F7',
},

replyTitle: {
  fontSize: 13,
  fontWeight: '800',
  color: '#4B3F72',
  textAlign: 'right',
  writingDirection: 'rtl',
  marginBottom: 4,
},

replyText: {
  fontSize: 13,
  color: '#6E6A8A',
  textAlign: 'right',
  writingDirection: 'rtl',
  lineHeight: 21,
},
});

export default EvaluationScreen;