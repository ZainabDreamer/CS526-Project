import { useFocusEffect } from '@react-navigation/native';
import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Polyline, Circle, Line, Text as SvgText } from 'react-native-svg';
import ScoreIndicator from '../components/ScoreIndicator';
import { SCREEN_NAMES, MOCK_ORG_USER } from '../constants/labels';
import { useTheme } from '../context/ThemeContext';

const ORG_TABS = [
  { key: 'inclusivity', label: 'الشمولية' },
  { key: 'evaluations', label: 'التقييمات' },
  { key: 'interviews', label: 'المقابلات' },
  { key: 'addJob', label: 'إضافة فرصة' },
];

const BellIcon = ({ color = '#1F1655' }) => (
  <View style={styles.bellShapeWrap}>
    <View style={[styles.bellTop, { backgroundColor: color }]} />
    <View style={[styles.bellBody, { backgroundColor: color }]} />
    <View style={[styles.bellClapper, { backgroundColor: color }]} />
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

const MiniStatIcon = ({ color = '#FFFFFF' }) => (
  <View style={styles.miniStatWrap}>
    <View style={[styles.miniBar1, { backgroundColor: color }]} />
    <View style={[styles.miniBar2, { backgroundColor: color }]} />
    <View style={[styles.miniBar3, { backgroundColor: color }]} />
  </View>
);

const UserAvatarIcon = ({ color = '#1F1655' }) => (
  <View style={styles.avatarMiniWrap}>
    <View style={[styles.avatarMiniHead, { backgroundColor: color }]} />
    <View style={[styles.avatarMiniBody, { backgroundColor: color }]} />
  </View>
);

const InclusivityLineChart = ({
  data = [],
  lineColor = '#3B2B93',
  dotColor = '#3B2B93',
  gridColor = '#E8E2F2',
  labelColor = '#8A85A0',
}) => {
  const width = 300;
  const height = 150;
  const paddingHorizontal = 22;
  const paddingTop = 16;
  const paddingBottom = 34;
  const chartHeight = height - paddingTop - paddingBottom;
  const chartWidth = width - paddingHorizontal * 2;

  const maxValue = 100;
  const minValue = 0;

  const points = data.map((item, index) => {
    const x =
      paddingHorizontal +
      (index * chartWidth) / Math.max(data.length - 1, 1);

    const y =
      paddingTop +
      chartHeight -
      ((item.value - minValue) / (maxValue - minValue)) * chartHeight;

    return { ...item, x, y };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  const horizontalGuides = [25, 50, 75, 100];

  return (
    <View style={styles.chartContainer}>
      <Svg width={width} height={height}>
        {horizontalGuides.map((guide, index) => {
          const y =
            paddingTop +
            chartHeight -
            ((guide - minValue) / (maxValue - minValue)) * chartHeight;

          return (
            <Line
              key={`guide-${index}`}
              x1={paddingHorizontal}
              y1={y}
              x2={width - paddingHorizontal}
              y2={y}
              stroke={gridColor}
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          );
        })}

        <Line
          x1={paddingHorizontal}
          y1={paddingTop + chartHeight}
          x2={width - paddingHorizontal}
          y2={paddingTop + chartHeight}
          stroke={gridColor}
          strokeWidth="1.2"
        />

        {points.length > 1 && (
          <Polyline
            points={polylinePoints}
            fill="none"
            stroke={lineColor}
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {points.map((point, index) => (
          <React.Fragment key={`point-${index}`}>
            <Circle cx={point.x} cy={point.y} r="4.5" fill={dotColor} />
            <Circle cx={point.x} cy={point.y} r="8" fill="transparent" />
            <SvgText
              x={point.x}
              y={point.y - 10}
              fontSize="10"
              fontWeight="700"
              fill={lineColor}
              textAnchor="middle"
            >
              {point.value}%
            </SvgText>
            <SvgText
              x={point.x}
              y={height - 10}
              fontSize="10"
              fill={labelColor}
              textAnchor="middle"
            >
              {point.label}
            </SvgText>
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
};

const OrgDashboardScreen = ({ navigation }) => {
  const { colors, darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('inclusivity');
  const [period, setPeriod] = useState('month');
  const [search, setSearch] = useState('');

  useFocusEffect(
  useCallback(() => {
    setActiveTab('inclusivity');
  }, [])
  );

  const chartData = useMemo(() => {
    return period === 'month'
      ? [
          { label: 'الأسبوع 1', value: 68 },
          { label: 'الأسبوع 2', value: 72 },
          { label: 'الأسبوع 3', value: 77 },
          { label: 'الأسبوع 4', value: 86 },
        ]
      : [
          { label: 'يناير', value: 52 },
          { label: 'مارس', value: 60 },
          { label: 'يونيو', value: 69 },
          { label: 'سبتمبر', value: 78 },
          { label: 'ديسمبر', value: 86 },
        ];
  }, [period]);

  const currentScore = chartData[chartData.length - 1]?.value || 86;
  const previousScore = chartData[chartData.length - 2]?.value || 81;
  const improvement = currentScore - previousScore;

  const palette = {
  pageBg: colors.background,
  cardBg: colors.card,
  text: colors.text,
  subText: colors.subText,
  primary: colors.primary,
  iconColor: darkMode ? '#F5F3FB' : '#1F1655',
  searchIcon: darkMode ? '#B7B2C9' : '#8F8B9E',
  inputPlaceholder: darkMode ? '#A9A5BC' : '#AAA6BE',
  tabBg: colors.card,
  tabText: colors.text,
  activeTabBg: colors.primary,
  activeTabText: '#FFFFFF',
  divider: darkMode ? '#312D45' : '#ECE7F7',
  softBg: darkMode ? '#2A273A' : '#F5F3FB',
  softText: darkMode ? '#B7B2C9' : '#777777',
  chartTrack: darkMode ? '#312D45' : '#E8E2F2',
  statsBg: darkMode ? '#262334' : '#F8F6FC',
  periodBg: darkMode ? '#2A273A' : '#F2F0F8',
  periodActiveBg: colors.primary,
  borderSoft: darkMode ? '#3A3650' : '#EEEAF8',
  avatarBg: darkMode ? '#2A273A' : '#F0EEF7',
  success: colors.secondary || '#36B487',
};

  const handleTab = (key) => {
    setActiveTab(key);

    if (key === 'interviews') {
      navigation.navigate(SCREEN_NAMES.APPLICANTS_LIST);
      return;
    }

    if (key === 'evaluations') {
      navigation.navigate(SCREEN_NAMES.ACCESSIBILITY_ISSUES);
      return;
    }

    if (key === 'addJob') {
      navigation.navigate(SCREEN_NAMES.ADD_JOB);
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
            <View style={[styles.avatarMiniCircle, { backgroundColor: palette.avatarBg }]}>
              <UserAvatarIcon color={palette.iconColor} />
            </View>
          </TouchableOpacity>

          <Image
            source={require('../../assets/logo2.png')}
            style={styles.topLogo}
            resizeMode="contain"
          />

          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: palette.cardBg }]}
            activeOpacity={0.85}
          >
            <BellIcon color={palette.iconColor} />
          </TouchableOpacity>
        </View>

        <View style={styles.welcomeBlock}>
          <Text style={[styles.welcome, { color: palette.text }]}>
            مرحبًا، {MOCK_ORG_USER.name}
          </Text>
        </View>

        <View style={[styles.searchBar, { backgroundColor: palette.cardBg }]}>
          <View style={styles.searchRightIcon}>
            <SearchIcon color={palette.searchIcon} />
          </View>

          <TextInput
            style={[styles.searchInput, { color: palette.text }]}
            placeholder="ابحث..."
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
            {ORG_TABS.map((tab) => {
              const isActive = activeTab === tab.key;

              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[
                    styles.tabButton,
                    { backgroundColor: palette.tabBg },
                    isActive && { backgroundColor: palette.activeTabBg },
                  ]}
                  onPress={() => handleTab(tab.key)}
                  activeOpacity={0.88}
                >
                  <Text
                    style={[
                      styles.tabText,
                      { color: isActive ? palette.activeTabText : palette.tabText },
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

        <LinearGradient
          colors={['#4B3F72', '#40357E', '#312767']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.announcementCard}
        >
          <View style={styles.announcementContent}>
            <View style={styles.announcementIconBox}>
              <MiniStatIcon />
            </View>

            <View style={styles.announcementTextBlock}>
              <Text style={styles.announcementTitle}>
                ارتفاع {improvement > 0 ? `+${improvement}%` : `${improvement}%`} في آخر فترة
              </Text>
              <Text style={styles.announcementSubtitle}>
                متابعة مباشرة لأداء الشمولية داخل المنظمة
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={[styles.scoreCard, { backgroundColor: palette.cardBg }]}>
          <View style={styles.scoreTopRow}>
            <View style={styles.scoreTextBlock}>
              <Text style={[styles.scoreMainTitle, { color: palette.primary }]}>
                شمولية الشركة
              </Text>
              <Text style={[styles.scoreSubTitle, { color: palette.subText }]}>
                النسبة الحالية للشمولية مع مقارنة التطور خلال {period === 'month' ? 'الشهر' : 'السنة'}
              </Text>
            </View>

            <ScoreIndicator percentage={currentScore} size={90} showLabel={false} />
          </View>

          <View style={styles.periodOuter}>
            <View style={[styles.periodRow, { backgroundColor: palette.periodBg }]}>
              <TouchableOpacity
                style={[
                  styles.periodBtn,
                  period === 'month' && {
                    backgroundColor: palette.periodActiveBg,
                  },
                ]}
                onPress={() => setPeriod('month')}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.periodText,
                    {
                      color: period === 'month' ? '#FFFFFF' : palette.subText,
                    },
                  ]}
                >
                  الشهر
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.periodBtn,
                  period === 'year' && {
                    backgroundColor: palette.periodActiveBg,
                  },
                ]}
                onPress={() => setPeriod('year')}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.periodText,
                    {
                      color: period === 'year' ? '#FFFFFF' : palette.subText,
                    },
                  ]}
                >
                  السنة
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.chartCard, { backgroundColor: palette.softBg }]}>
            <View style={styles.chartHeaderRow}>
              <Text style={[styles.chartExplain, { color: palette.subText }]}>
                يوضح الرسم تغير نسبة الشمولية عبر الزمن بشكل تدريجي
              </Text>
              <Text style={[styles.chartTitle, { color: palette.text }]}>
                تطور شمولية الشركة
              </Text>
            </View>

            <InclusivityLineChart
              data={chartData}
              lineColor={palette.primary}
              dotColor={palette.primary}
              gridColor={palette.chartTrack}
              labelColor={palette.subText}
            />
          </View>

          <View style={styles.statsRow}>
            <TouchableOpacity
              activeOpacity={0.88}
              style={[styles.statBox, { backgroundColor: palette.statsBg }]}
              onPress={() => navigation.navigate(SCREEN_NAMES.ACCESSIBILITY_ISSUES)}
            >
              <Text style={[styles.statValue, { color: palette.text }]}>4.7</Text>
              <Text style={[styles.statLabel, { color: palette.softText }]}>
                رضا الموظفين
              </Text>
              <Text style={[styles.statHint, { color: palette.success }]}>
                اضغط لعرض التفاصيل
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.88}
              style={[styles.statBox, { backgroundColor: palette.statsBg }]}
              onPress={() => navigation.navigate(SCREEN_NAMES.ACCESSIBILITY_ISSUES)}
            >
              <Text style={[styles.statValue, { color: palette.text }]}>18</Text>
              <Text style={[styles.statLabel, { color: palette.softText }]}>
                التقييمات الجديدة
              </Text>
              <Text style={[styles.statHint, { color: palette.success }]}>
                اضغط لعرض التقييمات
              </Text>
            </TouchableOpacity>
          </View>
        </View>

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
  },

  welcome: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
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
    marginBottom: 18,
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

  announcementCard: {
    borderRadius: 26,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 16,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },

  announcementContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  announcementIconBox: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },

  miniStatWrap: {
    width: 34,
    height: 34,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },

  miniBar1: {
    width: 6,
    height: 16,
    borderRadius: 3,
  },

  miniBar2: {
    width: 6,
    height: 26,
    borderRadius: 3,
  },

  miniBar3: {
    width: 6,
    height: 20,
    borderRadius: 3,
  },

  announcementTextBlock: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: 12,
  },

  announcementTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  announcementSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginTop: 6,
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  scoreCard: {
    borderRadius: 24,
    padding: 18,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  scoreTopRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  scoreTextBlock: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: 14,
  },

  scoreMainTitle: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  scoreSubTitle: {
    fontSize: 13,
    marginTop: 4,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 20,
  },

  periodOuter: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },

  periodRow: {
    flexDirection: 'row-reverse',
    borderRadius: 14,
    padding: 4,
  },

  periodBtn: {
    minWidth: 72,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },

  periodText: {
    fontSize: 12,
    fontWeight: '700',
    writingDirection: 'rtl',
  },

  chartCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },

  chartHeaderRow: {
    marginBottom: 8,
    alignItems: 'flex-end',
  },

  chartTitle: {
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 4,
  },

  chartExplain: {
    fontSize: 12,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 18,
  },

  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  statsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    gap: 10,
  },

  statBox: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statValue: {
    fontSize: 20,
    fontWeight: '800',
  },

  statLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
    writingDirection: 'rtl',
    textAlign: 'center',
  },

  statHint: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '700',
    writingDirection: 'rtl',
    textAlign: 'center',
  },
});

export default OrgDashboardScreen;