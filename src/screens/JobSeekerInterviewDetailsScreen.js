import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import AppHeader from '../components/AppHeader';

const JobSeekerInterviewDetailsScreen = ({ navigation, route }) => {
  const { colors, darkMode } = useTheme();
  const interview = route?.params?.interview || {};

  const palette = {
    bg: colors.background,
    card: colors.card,
    text: colors.text,
    subText: colors.subText,
    primary: colors.primary,
    border: darkMode ? '#39344E' : '#ECE7F7',
    softBg: darkMode ? '#2A273A' : '#F8F6FC',
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={palette.bg}
      />

      <AppHeader navigation={navigation} showBack />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { backgroundColor: palette.primary }]}>
          <Text style={styles.heroTitle}>مبروك!</Text>
          <Text style={styles.heroSubtitle}>
            تم اختيارك للمقابلة الشخصية
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: palette.card }]}>
          <Text style={[styles.sectionTitle, { color: palette.primary }]}>
            تفاصيل المقابلة
          </Text>

          <InfoRow
            label="المسمى الوظيفي"
            value={interview.title || 'مقابلة وظيفية'}
            palette={palette}
          />

          <InfoRow
            label="الجهة"
            value={interview.company || 'جهة توظيف'}
            palette={palette}
          />

          <InfoRow
            label="التاريخ"
            value={interview.date || 'تاريخ غير محدد'}
            palette={palette}
          />

          <InfoRow
            label="الوقت"
            value={interview.time || 'وقت غير محدد'}
            palette={palette}
          />

          <InfoRow
            label="نوع المقابلة"
            value={interview.mode || 'عن بعد'}
            palette={palette}
          />

          <InfoRow
            label="الموقع"
            value={interview.location || 'غير محدد'}
            palette={palette}
            last
          />
        </View>

        <View style={[styles.card, { backgroundColor: palette.card }]}>
          <Text style={[styles.sectionTitle, { color: palette.primary }]}>
            تعليمات مهمة
          </Text>

          <Text style={[styles.notesText, { color: palette.subText }]}>
            يرجى الالتزام بموعد المقابلة، وتجهيز السيرة الذاتية وأي مستندات مطلوبة قبل الموعد.
            إذا كانت المقابلة عن بعد، تأكدي من جاهزية الاتصال والكاميرا قبل وقت المقابلة.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: palette.primary }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.88}
        >
          <Text style={styles.primaryButtonText}>العودة للمقابلات</Text>
        </TouchableOpacity>

        <View style={{ height: 28 }} />
      </ScrollView>
    </View>
  );
};

const InfoRow = ({ label, value, palette, last }) => (
  <View
    style={[
      styles.infoRow,
      !last && { borderBottomColor: palette.border, borderBottomWidth: 1 },
    ]}
  >
    <Text style={[styles.infoLabel, { color: palette.subText }]}>
  {label} :
</Text>

<Text style={[styles.infoValue, { color: palette.text }]}>
  {value}
</Text>
  </View>
);

export default JobSeekerInterviewDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  heroCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },

  heroTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 6,
  },

  heroSubtitle: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 15,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 24,
  },

  card: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 12,
  },

  infoRow: {
  width: '100%',
  flexDirection: 'row-reverse',
  alignItems: 'center',
  paddingVertical: 16,
},

  infoLabel: {
  fontSize: 15,
  fontWeight: '800',
  textAlign: 'right',
  writingDirection: 'rtl',
  color: '#6E6A8A',
  marginLeft: 6, // مسافة بينه وبين القيمة
},

  infoValue: {
  color: '#111111',
  fontSize: 15,
  fontWeight: '600',
  textAlign: 'right',
  writingDirection: 'rtl',
},

  notesText: {
    fontSize: 14,
    lineHeight: 25,
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  primaryButton: {
    minHeight: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    writingDirection: 'rtl',
  },
});
