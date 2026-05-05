import React, { useMemo, useState, useCallback, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import { db } from '../services/firebase';
import {
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AppHeader from '../components/AppHeader';
import { SCREEN_NAMES } from '../constants/labels';
const MAIN_TABS = [
  { key: 'dashboard', label: 'الشمولية' },
  { key: 'evaluations', label: 'التقييمات' },
  { key: 'interviews', label: 'المقابلات' },
  { key: 'orgJobs', label: 'فرصي' },
];

const SearchIcon = ({ color = '#1F1655' }) => (
  <View style={styles.searchIconWrap}>
    <View style={[styles.searchCircle, { borderColor: color }]} />
    <View style={[styles.searchHandle, { backgroundColor: color }]} />
  </View>
);

const FilterIcon = ({ color = '#1F1655' }) => (
  <View style={styles.filterWrap}>
    <View style={[styles.filterTop, { backgroundColor: color }]} />
    <View style={[styles.filterStem, { backgroundColor: color }]} />
  </View>
);

const ProfilePreview = ({ name = '', color = '#1F1655' }) => {
  const firstLetter = name?.trim()?.charAt(0) || 'م';

  return (
    <View style={[styles.avatarCircle, { backgroundColor: color }]}>
      <Text style={styles.avatarText}>{firstLetter}</Text>
    </View>
  );
};

const ApplicantsListScreen = ({ navigation }) => {
  const { colors, darkMode } = useTheme();
  const { user } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('incoming');
  const [search, setSearch] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [applicants, setApplicants] = useState([]);

  const palette = {
    pageBg: colors.background,
    cardBg: colors.card,
    text: colors.text,
    subText: colors.subText,
    primary: colors.primary,
    searchIcon: darkMode ? '#B7B2C9' : '#8F8B9E',
    inputPlaceholder: darkMode ? '#A9A5BC' : '#AAA6BE',
    softBorder: darkMode ? '#312D45' : '#ECE7F7',
    softBg: darkMode ? '#262334' : '#F8F6FC',
    outline: darkMode ? '#4B4562' : '#CFC4E6',
    modalOverlay: 'rgba(0,0,0,0.24)',
  };

  useFocusEffect(
  useCallback(() => {
    const loadApplications = async () => {
  try {
    const orgId = user?.uid || user?.id;
    const orgName = user?.orgName || user?.name;

    if (!orgId && !orgName) {
      setApplicants([]);
      return;
    }

    const snapshot = await getDocs(collection(db, 'applications'));

    const filteredApps = snapshot.docs
      .map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }))
      .filter((app) =>
        app.orgId === orgId ||
        app.orgName === orgName ||
        app.job?.orgId === orgId ||
        app.job?.company === orgName
      );

    const mappedApplications = filteredApps.map((app) => ({
      id: app.id,
      applicationId: app.id,
      name: app.applicant?.name || app.applicantName || 'متقدم جديد',
      disabilityType: app.applicant?.disabilityType || 'غير محدد',
      status:
        app.status === 'interview_scheduled' || app.status === 'accepted'
          ? 'مجدولة'
          : 'قادمة',
      email: app.applicant?.email || app.applicantEmail || '',
      phone: app.applicant?.phone || app.applicantPhone || '',
      city: app.applicant?.city || '',
      jobTitle: app.jobTitle || app.job?.title || '',
      rawApplication: app,
    }));

    setApplicants(mappedApplications);
  } catch (error) {
    console.log('LOAD APPLICATIONS ERROR:', error);
    setApplicants([]);
  }
};
    loadApplications();
  }, [user])
);
  const displayed = useMemo(() => {
    const source =
      activeTab === 'incoming'
       ? applicants.filter((a) => a.status === 'قادمة')
       : applicants.filter((a) => a.status === 'مجدولة');

    const q = search.trim();
    if (!q) return source;

    return source.filter((item) => {
      const name = item.name || '';
      const type = item.disabilityType || '';
      const status = item.status || '';
      return name.includes(q) || type.includes(q) || status.includes(q);
    });
  }, [activeTab, search, applicants]);

  const handleMainTab = (key) => {
    if (key === 'dashboard') {
      navigation.navigate(SCREEN_NAMES.ORG_DASHBOARD);
      return;
    }

    if (key === 'evaluations') {
      navigation.navigate(SCREEN_NAMES.ACCESSIBILITY_ISSUES);
      return;
    }

    if (key === 'orgJobs') {
  navigation.navigate(SCREEN_NAMES.ORG_JOBS);
  return;
}
  };

  const getApplicantColor = (name) => {
  const colorsList = [
    '#E8E4F6', 
    '#E3F2EC', 
    '#F3F0FA', 
    '#EAF4F2', 
    '#F0ECF8', 
  ];

  const index = (name?.length || 0) % colorsList.length;
  return colorsList[index];
};

  const renderHeader = () => (
    <>
      <AppHeader navigation={navigation} />

      <View style={styles.topBlock}>
        <Text style={[styles.pageHint, { color: palette.subText }]}>
          إدارة المقابلات
        </Text>
      </View>

      <View style={[styles.searchBar, { backgroundColor: palette.cardBg }]}>
        <View style={styles.searchRightIcon}>
          <SearchIcon color={palette.searchIcon} />
        </View>

        <TextInput
          style={[styles.searchInput, { color: palette.text }]}
          placeholder="ابحث عن متقدم..."
          placeholderTextColor={palette.inputPlaceholder}
          value={search}
          onChangeText={setSearch}
          textAlign="right"
        />

        <View style={styles.searchLeftIcon}>
          <FilterIcon color={palette.searchIcon} />
        </View>
      </View>

      <View style={styles.mainTabsRow}>
        {MAIN_TABS.map((item) => {
          const isActive = item.key === 'interviews';

          return (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.mainTabButton,
                { backgroundColor: palette.cardBg },
                isActive && { backgroundColor: palette.primary },
              ]}
              onPress={() => handleMainTab(item.key)}
              activeOpacity={0.88}
            >
              <Text
                style={[
                  styles.mainTabText,
                  { color: isActive ? '#FFFFFF' : palette.text },
                ]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View
        style={[
          styles.subTabRow,
          {
            backgroundColor: palette.cardBg,
            borderColor: palette.softBorder,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.subTab,
            activeTab === 'incoming' && { backgroundColor: palette.primary },
          ]}
          onPress={() => setActiveTab('incoming')}
          activeOpacity={0.85}
        >
          <Text
            style={[
              styles.subTabText,
              { color: activeTab === 'incoming' ? '#FFFFFF' : palette.subText },
            ]}
          >
            القادمة
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.subTab,
            activeTab === 'scheduled' && { backgroundColor: palette.primary },
          ]}
          onPress={() => setActiveTab('scheduled')}
          activeOpacity={0.85}
        >
          <Text
            style={[
              styles.subTabText,
              { color: activeTab === 'scheduled' ? '#FFFFFF' : palette.subText },
            ]}
          >
            المجدولة
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>
          {activeTab === 'incoming' ? 'المقابلات القادمة' : 'المقابلات المجدولة'}
        </Text>
      </View>
    </>
  );

  const renderEmpty = () => (
    <View
      style={[
        styles.emptyCard,
        {
          backgroundColor: palette.cardBg,
          borderColor: palette.softBorder,
        },
      ]}
    >
      <Text style={[styles.emptyTitle, { color: palette.text }]}>
        لا توجد مقابلات {activeTab === 'incoming' ? 'قادمة' : 'مجدولة'}
      </Text>
      <Text style={[styles.emptyText, { color: palette.subText }]}>
        سيتم عرض الطلبات هنا عند توفر بيانات جديدة.
      </Text>
    </View>
  );

  const renderApplicantCard = ({ item }) => {
    const avatarColor = getApplicantColor(item.name);

    return (
      <View style={[styles.card, { backgroundColor: palette.cardBg }]}>
        <View style={styles.cardTopRow}>
          <View style={styles.leftActions}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: palette.primary }]}
              onPress={() =>
                navigation.navigate(SCREEN_NAMES.ORG_INTERVIEW_SCHEDULING, {
                  applicant: item,
                })
              }
              activeOpacity={0.88}
            >
              <Text style={styles.primaryButtonText}>قبول الطلب</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: palette.outline }]}
              onPress={() => setSelectedApplicant(item)}
              activeOpacity={0.88}
            >
              <Text style={[styles.secondaryButtonText, { color: palette.text }]}>
                تفاصيل
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rightInfo}>
            <View style={styles.topIdentityRow}>
              <ProfilePreview name={item.name} color={avatarColor} />

              <View style={styles.identityTextWrap}>
                <Text
                  style={[styles.applicantName, { color: palette.text }]}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>

                <Text style={[styles.applicantMeta, { color: palette.subText }]}>
                  {item.disabilityType || 'غير محدد'}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: palette.softBg,
                  borderColor: palette.softBorder,
                },
              ]}
            >
              <Text style={[styles.statusText, { color: palette.primary }]}>
                {item.status}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.pageBg }]}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={palette.pageBg}
      />

      <FlatList
        data={displayed}
        keyExtractor={(item) => item.id}
        renderItem={renderApplicantCard}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={!!selectedApplicant}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedApplicant(null)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: palette.modalOverlay }]}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setSelectedApplicant(null)}
          />

          <View style={[styles.modalCard, { backgroundColor: palette.cardBg }]}>
            <Text style={[styles.modalTitle, { color: palette.text }]}>
              تفاصيل المتقدم
            </Text>

            {selectedApplicant && (
              <>
                <View style={styles.modalInfoBlock}>
                  <View style={styles.modalInfoRow}>
                    <Text style={[styles.modalLabel, { color: palette.subText }]}>
                      الاسم :
                    </Text>
                    <Text style={[styles.modalValue, { color: palette.text }]}>
                      {selectedApplicant.name}
                    </Text>
                  </View>

                  <View style={styles.modalInfoRow}>
                    <Text style={[styles.modalLabel, { color: palette.subText }]}>
                      نوع الإعاقة :
                    </Text>
                    <Text style={[styles.modalValue, { color: palette.text }]}>
                      {selectedApplicant.disabilityType || 'غير محدد'}
                    </Text>
                  </View>

                  <View style={styles.modalInfoRow}>
                    <Text style={[styles.modalLabel, { color: palette.subText }]}>
                      الحالة :
                    </Text>
                    <Text style={[styles.modalValue, { color: palette.text }]}>
                      {selectedApplicant.status || 'غير محدد'}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.closeButton, { backgroundColor: palette.primary }]}
                  onPress={() => setSelectedApplicant(null)}
                  activeOpacity={0.88}
                >
                  <Text style={styles.closeButtonText}>إغلاق</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ApplicantsListScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  listContent: {
    paddingBottom: 30,
  },

  topBlock: {
    paddingHorizontal: 20,
    marginBottom: 14,
    alignItems: 'flex-end',
  },

  pageHint: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
    writingDirection: 'rtl',
    paddingHorizontal: 10,
  
  },

  searchBar: {
    height: 50,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 14,
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

  mainTabsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 14,
    gap: 8,
  },

  mainTabButton: {
    flex: 1,
    height: 42,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },

  mainTabText: {
    fontSize: 11,
    fontWeight: '700',
    writingDirection: 'rtl',
    textAlign: 'center',
  },

  subTabRow: {
    flexDirection: 'row-reverse',
    marginHorizontal: 20,
    marginBottom: 14,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    padding: 4,
  },

  subTab: {
    flex: 1,
    minHeight: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },

  subTabText: {
    fontSize: 13,
    fontWeight: '700',
    writingDirection: 'rtl',
  },

  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 10,
    alignItems: 'flex-end',
    
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    writingDirection: 'rtl',
    textAlign: 'right',
    paddingHorizontal: 10,
  },

  emptyCard: {
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 22,
    borderWidth: 1,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    writingDirection: 'rtl',
    textAlign: 'center',
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 13,
    lineHeight: 22,
    writingDirection: 'rtl',
    textAlign: 'center',
  },

  card: {
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  leftActions: {
    width: 118,
    alignItems: 'stretch',
    justifyContent: 'center',
  },

  primaryButton: {
    minHeight: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    writingDirection: 'rtl',
  },

  secondaryButton: {
    minHeight: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '800',
    writingDirection: 'rtl',
  },

  rightInfo: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: 16,
  },
  topIdentityRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 12,
  },

  identityTextWrap: {
    alignItems: 'flex-end',
    marginLeft: 12,
    maxWidth: 160,
  },

  applicantName: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 4,
  },

  applicantMeta: {
    fontSize: 13,
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  statusBadge: {
    minWidth: 102,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },

  statusText: {
    fontSize: 13,
    fontWeight: '700',
    writingDirection: 'rtl',
  },

  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },

  avatarText: {
    color: '#4B3F72',
    fontSize: 22,
    fontWeight: '800',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  modalCard: {
    borderRadius: 24,
    padding: 18,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 18,
  },

  modalInfoBlock: {
    alignItems: 'flex-end',
    marginBottom: 14,
  },

  modalInfoRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginBottom: 14,
  },

  modalLabel: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
    writingDirection: 'rtl',
    minWidth: 110,
  },

  modalValue: {
    fontSize: 14,
    textAlign: 'right',
    writingDirection: 'rtl',
    flexShrink: 1,
  },

  closeButton: {
    marginTop: 8,
    minHeight: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    writingDirection: 'rtl',
  },
});
