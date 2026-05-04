import React, { useMemo, useState, useCallback, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Image,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import AccessibilityIssueCard from '../components/AccessibilityIssueCard';
import { SCREEN_NAMES } from '../constants/labels';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { db } from '../services/firebase';
import {
  collection,
  getDocs,
} from 'firebase/firestore';

const TABS = [
  { key: 'dashboard', label: 'الشمولية' },
  { key: 'evaluations', label: 'التقييمات' },
  { key: 'interviews', label: 'المقابلات' },
  { key: 'orgJobs', label: 'فُرصي' },
];
const BellIcon = ({ color = '#1F1655' }) => (
  <View style={styles.bellShapeWrap}>
    <View style={[styles.bellTop, { backgroundColor: color }]} />
    <View style={[styles.bellBody, { backgroundColor: color }]} />
    <View style={[styles.bellClapper, { backgroundColor: color }]} />
  </View>
);
const UserAvatarIcon = ({ color = '#1F1655' }) => (
  <View style={styles.avatarMiniWrap}>
    <View style={[styles.avatarMiniHead, { backgroundColor: color }]} />
    <View style={[styles.avatarMiniBody, { backgroundColor: color }]} />
  </View>
);
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
const AccessibilityIssuesScreen = ({ navigation }) => {
  const { colors, darkMode } = useTheme();
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('new');
  const [search, setSearch] = useState('');
  const [issues, setIssues] = useState([]);

  const palette = {
    pageBg: colors.background,
    cardBg: colors.card,
    text: colors.text,
    subText: colors.subText,
    primary: '#4B3F72',
    iconColor: darkMode ? '#F5F3FB' : '#1F1655',
    searchIcon: darkMode ? '#B7B2C9' : '#8F8B9E',
    inputPlaceholder: darkMode ? '#A9A5BC' : '#AAA6BE',
    border: darkMode ? '#39344E' : '#ECE7F7',
    softBg: darkMode ? '#262334' : '#F8F6FC',
    tabBg: colors.card,
    activeTabBg: '#4B3F72',
    activeTabText: '#FFFFFF',
    inactiveTabText: darkMode ? '#C0BAD5' : '#6E6A8A',
    avatarBg: darkMode ? '#2A273A' : '#F0EEF7',
  };

  useFocusEffect(
  useCallback(() => {
    const loadIssues = async () => {
      try {
        const orgIdentifiers = [
          user?.uid,
          user?.id,
          user?.orgId,
          user?.orgName,
          user?.name,
        ].filter(Boolean);

        if (orgIdentifiers.length === 0) {
          setIssues([]);
          return;
        }

        const snapshot = await getDocs(collection(db, 'evaluations'));

        const data = snapshot.docs
          .map((docSnap) => {
            const item = {
              id: docSnap.id,
              ...docSnap.data(),
            };

            const matchOrg =
              orgIdentifiers.includes(item.orgId) ||
              orgIdentifiers.includes(item.orgName) ||
              orgIdentifiers.includes(item.company?.id) ||
              orgIdentifiers.includes(item.company?.name);

            if (!matchOrg) return null;

            return {
              id: item.id,
              title: item.orgName || item.company?.name || 'تقييم جديد',
              description: item.notes || 'لا توجد ملاحظات',
              rating: item.rating || 0,
              isReady: item.isReady || '',
              treatment: item.treatment || '',
              suggestions: item.suggestions || '',
              applicantName: item.userName || 'باحث عن عمل',
              status: item.orgReply?.text ? 'resolved' : 'new',
              response: item.orgReply?.text || '',
              rawEvaluation: item,
            };
          })
          .filter(Boolean)
          .sort((a, b) => {
            const aDate = a.rawEvaluation?.createdAt?.toDate
              ? a.rawEvaluation.createdAt.toDate()
              : new Date(0);

            const bDate = b.rawEvaluation?.createdAt?.toDate
              ? b.rawEvaluation.createdAt.toDate()
              : new Date(0);

            return bDate - aDate;
          });

        setIssues(data);
      } catch (error) {
        console.log('LOAD ORG EVALUATIONS ERROR:', error);
        setIssues([]);
      }
    };

    loadIssues();
  }, [user])
);
   const filteredIssues = useMemo(() => {
  const base =
    activeTab === 'previous'
      ? issues.filter((issue) => issue.status === 'resolved' || issue.response)
      : issues.filter((issue) => issue.status !== 'resolved' && !issue.response);

  if (!search.trim()) return base;

  const q = search.trim().toLowerCase();

  return base.filter((issue) => {
    const title = String(issue.title || '').toLowerCase();
    const description = String(issue.description || '').toLowerCase();

    return title.includes(q) || description.includes(q);
  });
}, [activeTab, search, issues]);


  const handleMainTab = (key) => {
    if (key === 'dashboard') {
      navigation.navigate(SCREEN_NAMES.ORG_DASHBOARD);
      return;
    }
    if (key === 'interviews') {
      navigation.navigate(SCREEN_NAMES.APPLICANTS_LIST);
      return;
    }
    if (key === 'orgJobs') {
  navigation.navigate(SCREEN_NAMES.ORG_JOBS);
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
        
      <View style={styles.headerRow}>

      <TouchableOpacity
       style={[styles.iconButton, { backgroundColor: palette.cardBg }]}
       onPress={() => navigation.navigate(SCREEN_NAMES.PROFILE)}
       activeOpacity={0.85}
      >
        <UserAvatarIcon color={palette.iconColor} />
       </TouchableOpacity>

  
       <Image
       source={require('../../assets/logo2.png')}
       style={styles.topLogo}
      resizeMode="contain"
      />


  <TouchableOpacity
  
  onPress={() => navigation.navigate(SCREEN_NAMES.NOTIFICATIONS)}
  activeOpacity={0.85}
>
  <BellIcon color={palette.iconColor} />
</TouchableOpacity>

</View>
        
        <View style={styles.welcomeBlock}>
          <Text style={[styles.welcomeHint, { color: palette.subText }]}>
            متابعة الملاحظات والتقييمات
          </Text>
        </View>
       
        <View style={[styles.searchBar, { backgroundColor: palette.cardBg }]}>
          <View style={styles.searchRightIcon}>
            <SearchIcon color={palette.searchIcon} />
          </View>
          <TextInput
            style={[styles.searchInput, { color: palette.text }]}
            placeholder="ابحث عن مشكلة..."
            placeholderTextColor={palette.inputPlaceholder}
            value={search}
            onChangeText={setSearch}
            textAlign="right"
          />
          <View style={styles.searchLeftIcon}>
            <FilterIcon color={palette.searchIcon} />
          </View>
        </View>
       
        <View style={styles.tabsContainer}>
          <View style={styles.tabsRow}>
            {TABS.map((tab) => {
              const isActive = tab.key === 'evaluations';
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[
                    styles.tabButton,
                    { backgroundColor: palette.tabBg },
                    isActive && { backgroundColor: palette.activeTabBg },
                  ]}
                  onPress={() => handleMainTab(tab.key)}
                  activeOpacity={0.88}
                >
                  <Text
                    style={[
                      styles.tabText,
                      {
                        color: isActive
                          ? palette.activeTabText
                          : palette.text,
                      },
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
        
        <View
          style={[
            styles.subTabsOuter,
            {
              backgroundColor: palette.cardBg,
              borderColor: palette.border,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.subTabButton,
              activeTab === 'new' && { backgroundColor: palette.activeTabBg },
            ]}
            onPress={() => setActiveTab('new')}
            activeOpacity={0.88}
          >
            <Text
              style={[
                styles.subTabText,
                {
                  color:
                    activeTab === 'new'
                      ? palette.activeTabText
                      : palette.inactiveTabText,
                },
              ]}
            >
              جديد
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.subTabButton,
              activeTab === 'previous' && {
                backgroundColor: palette.activeTabBg,
              },
            ]}
            onPress={() => setActiveTab('previous')}
            activeOpacity={0.88}
          >
            <Text
              style={[
                styles.subTabText,
                {
                  color:
                    activeTab === 'previous'
                      ? palette.activeTabText
                      : palette.inactiveTabText,
                },
              ]}
            >
              السابقة
            </Text>
          </TouchableOpacity>
        </View>
        {/* List */}
        <View style={styles.cardsList}>
          {filteredIssues.map((issue) => (
            <AccessibilityIssueCard
              key={issue.id}
              issue={issue}
              onAddResponse={() =>
                navigation.navigate(SCREEN_NAMES.ACCESSIBILITY_RESPONSE, {
                  issue,
                })
              }
              showResponse={activeTab === 'previous'}
            />
          ))}
          {filteredIssues.length === 0 && (
            <View
              style={[
                styles.emptyCard,
                {
                  backgroundColor: palette.cardBg,
                  borderColor: palette.border,
                },
              ]}
            >
              <Text style={[styles.emptyTitle, { color: palette.text }]}>
                لا توجد عناصر هنا حاليًا
              </Text>
              <Text style={[styles.emptyText, { color: palette.subText }]}>
                {activeTab === 'new'
                  ? 'لا توجد ملاحظات جديدة مطابقة للبحث.'
                  : 'لا توجد ملاحظات سابقة أو ردود محفوظة مطابقة للبحث.'}
              </Text>
            </View>
          )}
        </View>
        <View style={{ height: 28 }} />
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
    paddingTop: 52,
    paddingBottom: 24,
    alignItems: 'stretch',
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 44,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarMiniCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarMiniWrap: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMiniHead: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 2,
  },
  avatarMiniBody: {
    width: 11,
    height: 6,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  topLogo: {
    width: 118,
    height: 60,
  },
  welcomeBlock: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  welcomeHint: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 4,
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
  },
  welcome: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    alignSelf: 'flex-end',
  },
  searchBar: {
    width: '100%',
    height: 50,
    borderRadius: 14,
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
    marginBottom: 14,
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
    paddingHorizontal: 10,
    marginLeft: 8,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    writingDirection: 'rtl',
    textAlign: 'center',
  },
  subTabsOuter: {
    flexDirection: 'row-reverse',
    borderRadius: 18,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
  },
  subTabButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  subTabText: {
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  cardsList: {
    width: '100%',
  },
  emptyCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 22,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
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
  bellShapeWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
  },
  bellTop: {
    width: 8,
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    marginBottom: 1,
  },
  bellBody: {
    width: 14,
    height: 11,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  bellClapper: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 1,
  },
});
export default AccessibilityIssuesScreen;