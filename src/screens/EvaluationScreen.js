import React, { useMemo, useState } from 'react';
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
import { mockCompanies } from '../data/mockData';
import { SCREEN_NAMES } from '../constants/labels';
import { useTheme } from '../context/ThemeContext';
import AppHeader from '../components/AppHeader';

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

  const currentCompanies =
    activeTab === 'current'
      ? mockCompanies.slice(0, 2)
      : mockCompanies.slice(2, 4);

  const filteredCompanies = useMemo(() => {
    return currentCompanies.filter((company) =>
      !search.trim() ? true : company.name.includes(search.trim())
    );
  }, [currentCompanies, search]);

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
              <View style={styles.cardTop}>
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

                  <Text style={[styles.moreDetails, { color: palette.mutedText }]}>
                    للمزيد من التفاصيل
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.addBtn, { backgroundColor: palette.primary }]}
                  onPress={() =>
                    navigation.navigate(SCREEN_NAMES.EVALUATION_FORM, { company })
                  }
                  activeOpacity={0.88}
                >
                  <Text style={styles.addBtnText}>
                    {activeTab === 'current' ? 'أضف تقييمك' : 'الوصول إلى تقييمك'}
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
    flex: 1,
    marginLeft: 14,
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
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 114,
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
});

export default EvaluationScreen;