import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SCREEN_NAMES } from '../constants/labels';
import CompanyCard from '../components/CompanyCard';
import { mockCompanies } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';
import AppHeader from '../components/AppHeader';

const FILTER_TABS = [
  { key: 'jobs', label: 'وظائف' },
  { key: 'companies', label: 'الشركات' },
  { key: 'evaluation', label: 'التقييم' },
  { key: 'map', label: 'الخريطة' },
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

const CompaniesScreen = ({ navigation }) => {
  const { colors, darkMode } = useTheme();
  const [activeFilter, setActiveFilter] = useState('companies');
  const [search, setSearch] = useState('');

  useFocusEffect(
    useCallback(() => {
      setActiveFilter('companies');
    }, [])
  );

  const palette = {
    pageBg: colors.background,
    cardBg: colors.card,
    text: colors.text,
    subText: colors.subText,
    primary: '#4B3F72',
    placeholder: darkMode ? '#A9A5BC' : '#AAA6BE',
    searchIcon: darkMode ? '#B7B2C9' : '#8F8B9E',
    heroBorder: darkMode ? '#3A3650' : '#F0ECF8',
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return mockCompanies;

    return mockCompanies.filter((c) => {
      const name = String(c.name || '').toLowerCase();
      const location = String(c.location || '').toLowerCase();
      return name.includes(q) || location.includes(q);
    });
  }, [search]);

  const handleTabPress = (key) => {
    setActiveFilter(key);

    if (key === 'jobs') {
      navigation.navigate(SCREEN_NAMES.HOME);
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

  const renderHeader = () => (
    <>
      <AppHeader
        navigation={navigation}
        leftType="bell"
        rightType="profile"
        horizontalPadding={25}
      />

      <View style={[styles.searchBar, { backgroundColor: palette.cardBg }]}>
        <View style={styles.searchRightIcon}>
          <SearchIcon color={palette.searchIcon} />
        </View>

        <TextInput
          style={[styles.searchInput, { color: palette.text }]}
          placeholder="ابحث عن شركة"
          placeholderTextColor={palette.placeholder}
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
          {FILTER_TABS.map((tab, index) => {
            const isActive = activeFilter === tab.key;

            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tabButton,
                  {
                    backgroundColor: isActive ? palette.primary : palette.cardBg,
                    borderColor: isActive ? palette.primary : palette.heroBorder,
                    marginLeft: index === FILTER_TABS.length - 1 ? 0 : 8,
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

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>
          الشركات
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate(SCREEN_NAMES.MAP)}
          activeOpacity={0.85}
        >
          <Text style={styles.mapLink}>انظر للخريطة</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: palette.pageBg }]}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={palette.pageBg}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CompanyCard
            company={item}
            onPress={() =>
              navigation.navigate(SCREEN_NAMES.JOB_DETAILS, {
                job: { ...item, fromCompany: true },
              })
            }
            style={styles.card}
          />
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  searchBar: {
    height: 52,
    borderRadius: 16,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 18,
    marginHorizontal: 20,
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
    paddingHorizontal: 20,
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
    paddingHorizontal: 25,
    marginBottom: 12,
    marginTop: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    writingDirection: 'rtl',
    textAlign: 'right',
  },

  mapLink: {
    fontSize: 13,
    color: '#36B487',
    fontWeight: '700',
    writingDirection: 'rtl',
    textDecorationLine: 'underline',
    textDecorationColor: '#36B487',
    textAlign: 'left',
  },

  list: {
    paddingBottom: 30,
  },

  card: {
    marginBottom: 14,
    marginHorizontal: 20,
  },
});

export default CompaniesScreen;