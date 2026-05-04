import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { SCREEN_NAMES } from '../constants/labels';

const CompanyDetailsScreen = ({ route, navigation }) => {
  const { colors, darkMode } = useTheme();
  const company = route?.params?.company || {};
  const jobs = company.jobs || [];

  const inclusivity = Number(
    company.inclusivity ||
    company.inclusionRate ||
    company.inclusionScore ||
    0
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />

      {/* HEADER مثل باقي الصفحات */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.card }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrowIcon}>‹</Text>
        </TouchableOpacity>

        <Text style={[styles.pageTitle, { color: colors.text }]}>
          تفاصيل الشركة
        </Text>

        <View style={styles.iconButton} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* الكارد الرئيسي */}
        <View style={[styles.heroCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.heroTitle, { color: colors.text }]}>
            {company.name || 'شركة غير محددة'}
          </Text>

          <Text style={styles.heroSubTitle}>
            {company.sector || 'قطاع غير محدد'}
          </Text>

          <Text style={styles.heroSubTitle}>
            {company.hasCertificate ? 'حاصلة على شهادة' : 'لا توجد شهادة'}
          </Text>

          {/* الدائرة */}
          <View style={styles.rateWrap}>
            <View
              style={[
                styles.rateCircle,
                {
                  borderColor: inclusivity === 0 ? '#E6E2EE' : '#58B894',
                  borderStyle: inclusivity === 0 ? 'dashed' : 'solid',
                },
              ]}
            >
              <Text
                style={[
                  styles.rateText,
                  { color: inclusivity === 0 ? '#E05252' : '#111' },
                ]}
              >
                {inclusivity}%
              </Text>
            </View>

            <Text style={styles.rateLabel}>نسبة الشمولية</Text>
          </View>
        </View>

        {/* الإحصائيات */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={styles.statNumber}>{jobs.length}</Text>
            <Text style={styles.statLabel}>فرص منشورة</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={styles.statNumber}>
              {company.city || 'غير محدد'}
            </Text>
            <Text style={styles.statLabel}>الموقع</Text>
          </View>
        </View>

        {/* نبذة */}
        <View style={[styles.optionCard, { backgroundColor: colors.card }]}>
          <View style={styles.optionTextWrap}>
            <Text style={styles.optionTitle}>نبذة عن الشركة</Text>
            <Text style={styles.optionDescription}>
              {company.description || 'لا توجد نبذة حالياً'}
            </Text>
          </View>
        </View>

        {/* معلومات الإتاحة */}
        <View style={[styles.optionCard, { backgroundColor: colors.card }]}>
          <View style={styles.optionTextWrap}>
            <Text style={styles.optionTitle}>معلومات الإتاحة</Text>

            <Text style={styles.optionDescription}>
              دعم الإتاحة: {company.accessibilitySupport || 'غير مضاف'}
            </Text>

            <Text style={styles.optionDescription}>
              بيئة العمل: {company.workEnvironment || 'غير مضاف'}
            </Text>

            <Text style={styles.optionDescription}>
              البريد الرسمي: {company.contactEmail || 'غير مضاف'}
            </Text>
          </View>
        </View>

        {/* الفرص */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            الفرص الوظيفية
          </Text>
        </View>

        {jobs.map((job) => (
          <TouchableOpacity
            key={job.id}
            style={[styles.optionCard, { backgroundColor: colors.card }]}
            onPress={() =>
              navigation.navigate(SCREEN_NAMES.JOB_DETAILS, { job })
            }
          >
            <View style={styles.optionTextWrap}>
              <Text style={styles.optionTitle}>
                {job.title || 'فرصة وظيفية'}
              </Text>

              <Text style={styles.optionDescription}>
               نسبة الشمولية: {job.inclusivityScore || job.inclusionRate || job.inclusivity || 0}%
              </Text>
            </View>

            {/* سهم موحد */}
            <Text style={styles.arrow}>‹</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  headerRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    paddingHorizontal: 20,
    paddingTop: 52,
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backArrowIcon: {
    fontSize: 26,
    fontWeight: '700',
  },

  pageTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'right',
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 18,
  },

  heroCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
  },

  heroTitle: {
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'right',
  },

  heroSubTitle: {
    fontSize: 13,
    textAlign: 'right',
    marginBottom: 4,
  },

  rateWrap: {
    alignItems: 'center',
    marginTop: 12,
  },

  rateCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rateText: {
    fontSize: 18,
    fontWeight: '900',
  },

  rateLabel: {
    fontSize: 12,
    marginTop: 6,
  },

  statsRow: {
    flexDirection: 'row-reverse',
    gap: 12,
    marginBottom: 16,
  },

  statCard: {
    flex: 1,
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 16,
    fontWeight: '800',
  },

  statLabel: {
    fontSize: 11,
  },

  sectionHeader: {
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'right',
  },

  optionCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  optionTextWrap: {
    flex: 1,
    alignItems: 'flex-end',
  },

  optionTitle: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'right',
    marginBottom: 4,
  },

  optionDescription: {
    fontSize: 13,
    textAlign: 'right',
  },

  arrow: {
    fontSize: 22,
    color: '#AAA6BE',
  },
});

export default CompanyDetailsScreen;