import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import AppHeader from '../components/AppHeader';
import HomeTopBar from '../components/HomeTopBar';
import { mockInterviews } from '../data/mockData';
import { SCREEN_NAMES } from '../constants/labels';

const TABS = [
  { key: 'jobs', label: 'الفرص الوظيفية' },
  { key: 'companies', label: 'الشركات' },
  { key: 'evaluation', label: 'التقييم' },
  { key: 'map', label: 'الخريطة' },
  { key: 'interviews', label: 'المقابلات' },
];

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

const InterviewReminderScreen = ({ navigation }) => {
  const { colors, darkMode } = useTheme();

  const [activeTab, setActiveTab] = useState('interviews');
  const [search, setSearch] = useState('');

  const palette = {
    bg: colors.background,
    card: colors.card,
    text: colors.text,
    subText: colors.subText,
    primary: colors.primary,
    border: darkMode ? '#39344E' : '#ECE7F7',
    inputBg: darkMode ? '#2A273A' : '#F5F3FB',
    searchIcon: darkMode ? '#B7B2C9' : '#8F8B9E',
    inputPlaceholder: darkMode ? '#A9A5BC' : '#AAA6BE',
    softBg: darkMode ? '#262334' : '#F8F6FC',
  };

  const handleTab = (key) => {
    if (key === 'jobs') navigation.navigate(SCREEN_NAMES.HOME);
    if (key === 'companies') navigation.navigate(SCREEN_NAMES.COMPANIES);
    if (key === 'evaluation') navigation.navigate(SCREEN_NAMES.EVALUATION);
    if (key === 'map') navigation.navigate(SCREEN_NAMES.MAP);
  };

  const filteredInterviews = useMemo(() => {
    const q = search.trim();
    if (!q) return mockInterviews;

    return mockInterviews.filter((item) => {
      const title = item.title || '';
      const company = item.company || '';
      const time = item.time || '';
      const date = item.date || '';
      const location = item.location || '';
      const mode = item.mode || '';

      return (
        title.includes(q) ||
        company.includes(q) ||
        time.includes(q) ||
        date.includes(q) ||
        location.includes(q) ||
        mode.includes(q)
      );
    });
  }, [search]);

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={palette.bg}
      />

      <AppHeader navigation={navigation} />

      <View style={[styles.searchBar, { backgroundColor: palette.inputBg }]}>
        <View style={styles.searchRightIcon}>
          <SearchIcon color={palette.searchIcon} />
        </View>

        <TextInput
          style={[styles.searchInput, { color: palette.text }]}
          placeholder="ابحث عن مقابلة أو تذكير"
          placeholderTextColor={palette.inputPlaceholder}
          value={search}
          onChangeText={setSearch}
          textAlign="right"
        />

        <View style={styles.searchLeftIcon}>
          <FilterIcon color={palette.searchIcon} />
        </View>
      </View>

      <View style={styles.tabsWrap}>
        <HomeTopBar
          tabs={TABS}
          activeTab={activeTab}
          onTabPress={(k) => {
            setActiveTab(k);
            handleTab(k);
          }}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>
          المقابلات
        </Text>
        <Text style={[styles.sectionSubTitle, { color: palette.subText }]}>
          استعرض المواعيد والتفاصيل المرتبطة بالمقابلات
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {filteredInterviews.length === 0 ? (
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
              جرّب تعديل البحث أو انتظر إضافة مواعيد جديدة.
            </Text>
          </View>
        ) : (
          filteredInterviews.map((item) => (
            <View
              key={item.id}
              style={[styles.card, { backgroundColor: palette.card }]}
            >
              <View style={styles.cardTop}>
                <View style={styles.badgeWrap}>
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor: palette.softBg,
                        borderColor: palette.border,
                      },
                    ]}
                  >
                    <Text style={[styles.badgeText, { color: palette.primary }]}>
                      {item.mode || 'عن بعد'}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardTextBlock}>
                  <Text style={[styles.cardTitle, { color: palette.text }]}>
                    {item.title || 'مقابلة وظيفية'}
                  </Text>

                  <Text style={[styles.cardCompany, { color: palette.subText }]}>
                    {item.company || 'جهة غير محددة'}
                  </Text>

                  <Text style={[styles.cardMeta, { color: palette.primary }]}>
                    {(item.date || 'تاريخ غير محدد') + ' • ' + (item.time || 'وقت غير محدد')}
                  </Text>

                  <Text style={[styles.cardLocation, { color: palette.subText }]}>
                    {item.location || 'الموقع غير محدد'}
                  </Text>
                </View>
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[
                    styles.secondaryButton,
                    { borderColor: palette.primary },
                  ]}
                  onPress={() =>
                    navigation.navigate(SCREEN_NAMES.INTERVIEW_DETAILS, {
                      interview: item,
                    })
                  }
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.secondaryButtonText,
                      { color: palette.primary },
                    ]}
                  >
                    تفاصيل
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    { backgroundColor: palette.primary },
                  ]}
                  onPress={() => navigation.navigate(SCREEN_NAMES.MAP)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryButtonText}>الموقع</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

export default InterviewReminderScreen;

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
    marginTop: 10,
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

  tabsWrap: {
    marginBottom: 10,
  },

  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
    alignItems: 'flex-end',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    writingDirection: 'rtl',
    textAlign: 'right',
    marginBottom: 4,
  },

  sectionSubTitle: {
    fontSize: 13,
    writingDirection: 'rtl',
    textAlign: 'right',
    lineHeight: 21,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  card: {
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  cardTop: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  badgeWrap: {
    marginLeft: 12,
  },

  badge: {
    minWidth: 78,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
  },

  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    writingDirection: 'rtl',
  },

  cardTextBlock: {
    flex: 1,
    alignItems: 'flex-end',
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 4,
  },

  cardCompany: {
    fontSize: 13,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 6,
  },

  cardMeta: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 4,
  },

  cardLocation: {
    fontSize: 12,
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  actionsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    gap: 10,
  },

  primaryButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    writingDirection: 'rtl',
  },

  secondaryButton: {
    flex: 1,
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

  emptyCard: {
    borderRadius: 22,
    borderWidth: 1,
    paddingVertical: 34,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
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
});

