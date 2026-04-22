import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import ScoreIndicator from '../components/ScoreIndicator';
import CustomButton from '../components/CustomButton';
import { SCREEN_NAMES } from '../constants/labels';
import { mockJobs } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

const BackArrowIcon = ({ color = '#1F1655' }) => (
  <Text style={[styles.backArrowIcon, { color }]}>{'‹'}</Text>
);

const BuildingIcon = ({ color = '#4B3F72', secondary = '#6A5AA1' }) => (
  <View style={styles.buildingWrap}>
    <View style={[styles.buildingMain, { backgroundColor: color }]} />
    <View style={[styles.buildingSmall, { backgroundColor: secondary }]} />
  </View>
);

const CheckIcon = ({ color = '#36B487', bg = '#E8F7F1' }) => (
  <View style={[styles.checkWrap, { backgroundColor: bg }]}>
    <View style={[styles.checkStem, { backgroundColor: color }]} />
    <View style={[styles.checkArm, { backgroundColor: color }]} />
  </View>
);

const BookmarkIcon = ({ color = '#4B3F72' }) => (
  <View style={styles.bookmarkWrap}>
    <View style={[styles.bookmarkBody, { borderColor: color }]} />
    <View style={[styles.bookmarkCut, { backgroundColor: color }]} />
  </View>
);

const InfoMiniIcon = ({ color = '#4B3F72' }) => (
  <View style={styles.infoMiniWrap}>
    <View style={[styles.infoMiniDot, { backgroundColor: color }]} />
    <View style={[styles.infoMiniLine, { backgroundColor: color }]} />
  </View>
);

const JobDetailsScreen = ({ navigation, route }) => {
  const { colors, darkMode } = useTheme();
  const { job } = route.params || {};
  const displayJob = job || mockJobs[0];

  const [isSaved, setIsSaved] = useState(false);

  const palette = {
    pageBg: colors.background,
    cardBg: colors.card,
    text: colors.text,
    subText: colors.subText,
    primary: colors.primary,
    border: darkMode ? '#312D45' : '#ECE7F7',
    softBorder: darkMode ? '#39344E' : '#F0ECF8',
    iconBg: darkMode ? '#2A273A' : '#F5F3FB',
    iconBorder: darkMode ? '#3A3650' : '#ECE7F7',
    noteBg: darkMode ? '#262334' : '#F8F6FC',
    noteBorder: darkMode ? '#39344E' : '#ECE7F7',
    empty: darkMode ? '#A8A3BC' : '#8A85A0',
    saveBg: darkMode ? '#262334' : '#FFFFFF',
    saveBorder: darkMode ? '#4A4560' : '#D9D3EA',
    saveText: darkMode ? '#E7E3F5' : '#4B3F72',
    checkBg: darkMode ? '#20392F' : '#E8F7F1',
    checkColor: '#36B487',
    companySecondary: darkMode ? '#8B7FC4' : '#6A5AA1',
    heroSubText: darkMode ? '#B7B2C9' : '#8A85A0',
  };

  const requirements = useMemo(
    () => displayJob.requirements || [],
    [displayJob.requirements]
  );

  const accessibilityFeatures = useMemo(
    () => displayJob.accessibilityFeatures || [],
    [displayJob.accessibilityFeatures]
  );

  const handleSaveJob = useCallback(() => {
    setIsSaved((prev) => {
      const next = !prev;

      Alert.alert(
        next ? 'تم حفظ الوظيفة' : 'تمت إزالة الحفظ',
        next
          ? 'تمت إضافة الوظيفة إلى الوظائف المحفوظة.'
          : 'تمت إزالة الوظيفة من الوظائف المحفوظة.'
      );

      return next;
    });
  }, []);

  const handleApplyNow = useCallback(() => {
    navigation.navigate(SCREEN_NAMES.JOB_APPLICATION, {
      job: displayJob,
    });
  }, [navigation, displayJob]);

  return (
    <View style={[styles.container, { backgroundColor: palette.pageBg }]}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={palette.pageBg}
      />

      <View style={styles.headerRow}>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: palette.cardBg }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <BackArrowIcon color={palette.primary} />
        </TouchableOpacity>

        <Image
          source={require('../../assets/logo2.png')}
          style={styles.topLogo}
          resizeMode="contain"
        />

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={[styles.heroCard, { backgroundColor: palette.cardBg }]}>
          <View style={styles.logoRow}>
            <View
              style={[
                styles.companyLogoBox,
                {
                  backgroundColor: palette.iconBg,
                  borderColor: palette.iconBorder,
                },
              ]}
            >
              {displayJob.company === 'البنك السعودي' ? (
                <Text style={[styles.companyLogoText, { color: palette.primary }]}>
                  sic
                </Text>
              ) : (
                <BuildingIcon
                  color={palette.primary}
                  secondary={palette.companySecondary}
                />
              )}
            </View>
          </View>

          <Text style={[styles.companyName, { color: palette.heroSubText }]}>
            {displayJob.company || 'جهة معتمدة'}
          </Text>

          <Text style={[styles.jobTitle, { color: palette.text }]}>
            {displayJob.title}
          </Text>

          <View style={styles.scoreRow}>
            <ScoreIndicator percentage={displayJob.score || 91} size={74} />

            <View style={styles.scoreTextWrap}>
              <Text style={[styles.scoreTitle, { color: palette.primary }]}>
                نسبة الشمولية
              </Text>
              <Text style={[styles.scoreSubText, { color: palette.heroSubText }]}>
                تقييم بيئة العمل ومدى ملاءمتها
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: palette.cardBg }]}>
          <View style={styles.sectionTitleRow}>
            <InfoMiniIcon color={palette.primary} />
            <Text style={[styles.sectionLabel, { color: palette.primary }]}>
              الوصف الوظيفي
            </Text>
          </View>

          <Text style={[styles.description, { color: palette.subText }]}>
            {displayJob.description || 'لا يوجد وصف متاح حالياً لهذه الوظيفة.'}
          </Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: palette.cardBg }]}>
          <View style={styles.sectionTitleRow}>
            <InfoMiniIcon color={palette.primary} />
            <Text style={[styles.sectionLabel, { color: palette.primary }]}>
              المؤهلات المطلوبة
            </Text>
          </View>

          {requirements.length > 0 ? (
            requirements.map((req, i) => (
              <View key={i} style={styles.reqRow}>
                <View
                  style={[
                    styles.bulletDot,
                    { backgroundColor: palette.checkColor },
                  ]}
                />
                <Text style={[styles.reqText, { color: palette.text }]}>{req}</Text>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: palette.empty }]}>
              لا توجد مؤهلات مضافة حالياً
            </Text>
          )}
        </View>

        <View style={[styles.infoCard, { backgroundColor: palette.cardBg }]}>
          <View style={styles.sectionTitleRow}>
            <InfoMiniIcon color={palette.primary} />
            <Text style={[styles.sectionLabel, { color: palette.primary }]}>
              تفاصيل العمل
            </Text>
          </View>

          <View style={[styles.infoLine, { borderBottomColor: palette.softBorder }]}>
            <Text style={[styles.infoValue, { color: palette.text }]}>
              {displayJob.workEnv || 'حضوري'}
            </Text>
            <Text style={[styles.infoTitle, { color: palette.primary }]}>
              بيئة العمل
            </Text>
          </View>

          <View style={[styles.infoLine, { borderBottomColor: palette.softBorder }]}>
            <Text style={[styles.infoValue, { color: palette.text }]}>
              {displayJob.dailyHours || 8}
            </Text>
            <Text style={[styles.infoTitle, { color: palette.primary }]}>
              ساعات العمل اليومية
            </Text>
          </View>

          <View style={styles.infoLineLast}>
            <Text style={[styles.infoValue, { color: palette.text }]}>
              {displayJob.vacancies || 2}
            </Text>
            <Text style={[styles.infoTitle, { color: palette.primary }]}>
              عدد الشواغر
            </Text>
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: palette.cardBg }]}>
          <View style={styles.sectionTitleRow}>
            <InfoMiniIcon color={palette.primary} />
            <Text style={[styles.sectionLabel, { color: palette.primary }]}>
              مزايا الإتاحة
            </Text>
          </View>

          {accessibilityFeatures.length > 0 ? (
            accessibilityFeatures.map((feature, i) => (
              <View key={i} style={styles.featureRow}>
                <CheckIcon color={palette.checkColor} bg={palette.checkBg} />
                <Text style={[styles.featureText, { color: palette.text }]}>
                  {feature}
                </Text>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: palette.empty }]}>
              لا توجد مزايا إتاحة مضافة حالياً
            </Text>
          )}
        </View>

        <View
          style={[
            styles.noteCard,
            {
              backgroundColor: palette.noteBg,
              borderColor: palette.noteBorder,
            },
          ]}
        >
          <Text style={[styles.noteText, { color: palette.subText }]}>
            الشركة تلتزم بتوفير تعديلات مناسبة حسب احتياجات الموظف، ويتم تحديثها
            بعد المقابلة بالتنسيق مع إدارة الموارد البشرية.
          </Text>
        </View>

        <View style={styles.btnRow}>
          <CustomButton
            title="قدّم الآن"
            onPress={handleApplyNow}
            style={[styles.applyBtn, { backgroundColor: palette.primary }]}
            textStyle={styles.applyBtnText}
          />

          <TouchableOpacity
            style={[
              styles.saveBtnLocal,
              {
                backgroundColor: palette.saveBg,
                borderColor: isSaved ? palette.primary : palette.saveBorder,
              },
            ]}
            onPress={handleSaveJob}
            activeOpacity={0.85}
          >
            <BookmarkIcon color={isSaved ? palette.primary : palette.saveText} />
            <Text
              style={[
                styles.saveBtnLocalText,
                { color: isSaved ? palette.primary : palette.saveText },
              ]}
            >
              {isSaved ? 'تم الحفظ' : 'حفظ الوظيفة'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    minHeight: 44,
    paddingHorizontal: 20,
    paddingTop: 52,
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

  headerSpacer: {
    width: 42,
    height: 42,
  },

  topLogo: {
    width: 120,
    height: 60,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 20,
  },

  heroCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  logoRow: {
    alignItems: 'center',
    marginBottom: 14,
  },

  companyLogoBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },

  companyLogoText: {
    fontSize: 24,
    fontWeight: '900',
  },

  buildingWrap: {
    width: 30,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buildingMain: {
    width: 18,
    height: 20,
    borderRadius: 3,
  },

  buildingSmall: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 10,
    height: 12,
    borderRadius: 2,
  },

  companyName: {
    fontSize: 14,
    textAlign: 'center',
    writingDirection: 'rtl',
    marginBottom: 6,
    fontWeight: '600',
  },

  jobTitle: {
    width: '100%',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    writingDirection: 'rtl',
    marginBottom: 18,
  },

  scoreRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  scoreTextWrap: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: 14,
  },

  scoreTitle: {
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'left',
    writingDirection: 'rtl',
  },

  scoreSubText: {
    fontSize: 12,
    textAlign: 'left',
    writingDirection: 'rtl',
    marginTop: 4,
    lineHeight: 18,
  },

  infoCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  sectionTitleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },

  sectionLabel: {
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'right',
    marginLeft: 8,
    writingDirection: 'rtl',
  },

  description: {
    fontSize: 14,
    textAlign: 'right',
    lineHeight: 23,
    writingDirection: 'rtl',
  },

  reqRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },

  reqText: {
    fontSize: 14,
    textAlign: 'right',
    writingDirection: 'rtl',
    flex: 1,
    lineHeight: 22,
    marginLeft: 8,
  },

  bulletDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginTop: 8,
  },

  emptyText: {
    fontSize: 13,
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  infoLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },

  infoLineLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'left',
    writingDirection: 'rtl',
  },

  infoValue: {
    fontSize: 14,
    textAlign: 'left',
    fontWeight: '700',
    writingDirection: 'rtl',
  },

  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  featureText: {
    fontSize: 13,
    textAlign: 'left',
    writingDirection: 'rtl',
    marginLeft: 10,
    flex: 1,
  },

  checkWrap: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkStem: {
    position: 'absolute',
    width: 2,
    height: 7,
    transform: [{ rotate: '45deg' }],
    top: 7,
    left: 8,
    borderRadius: 2,
  },

  checkArm: {
    position: 'absolute',
    width: 2,
    height: 10,
    transform: [{ rotate: '-45deg' }],
    top: 4,
    left: 11,
    borderRadius: 2,
  },

  noteCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
  },

  noteText: {
    fontSize: 12,
    textAlign: 'right',
    lineHeight: 21,
    writingDirection: 'rtl',
    fontStyle: 'italic',
  },

  btnRow: {
    flexDirection: 'row-reverse',
    gap: 10,
    marginTop: 2,
  },

  applyBtn: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
  },

  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  saveBtnLocal: {
    flex: 1,
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveBtnLocalText: {
    fontSize: 15,
    fontWeight: '800',
    marginLeft: 8,
  },

  bookmarkWrap: {
    width: 16,
    height: 18,
    position: 'relative',
  },

  bookmarkBody: {
    width: 14,
    height: 18,
    borderWidth: 1.8,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    borderBottomWidth: 0,
  },

  bookmarkCut: {
    position: 'absolute',
    bottom: 0,
    left: 3,
    width: 8,
    height: 8,
    transform: [{ rotate: '45deg' }],
  },

  infoMiniWrap: {
    width: 12,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoMiniDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginBottom: 2,
  },

  infoMiniLine: {
    width: 2,
    height: 7,
    borderRadius: 2,
  },

  backArrowIcon: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 26,
    includeFontPadding: false,
  },
});

export default JobDetailsScreen;