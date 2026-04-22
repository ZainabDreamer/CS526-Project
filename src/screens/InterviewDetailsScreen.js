import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import AppHeader from '../components/AppHeader';

const InterviewDetailsScreen = ({ navigation, route }) => {
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

  const title = interview.title || 'المقابلة الوظيفية';
  const company = interview.company || 'اسم الجهة غير متوفر';
  const time = interview.time || 'الوقت غير محدد';
  const date = interview.date || 'التاريخ غير محدد';
  const location = interview.location || 'الموقع غير محدد';
  const mode = interview.mode || 'عن بعد';
  const notes =
    interview.notes ||
    'يرجى الالتزام بموعد المقابلة والتأكد من جاهزية المستندات المطلوبة قبل الحضور أو قبل بدء المقابلة عن بعد.';

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
        <View style={styles.headingBlock}>
          <Text style={[styles.screenTitle, { color: palette.text }]}>
            تفاصيل المقابلة
          </Text>
          <Text style={[styles.screenSubTitle, { color: palette.subText }]}>
            عرض معلومات الموعد والجهة والتفاصيل المرتبطة بالمقابلة
          </Text>
        </View>

        <View style={[styles.heroCard, { backgroundColor: palette.card }]}>
          <Text style={[styles.heroTitle, { color: palette.primary }]}>
            {title}
          </Text>

          <Text style={[styles.heroCompany, { color: palette.text }]}>
            {company}
          </Text>

          <View style={styles.badgesRow}>
            <View style={[styles.badge, { backgroundColor: palette.softBg, borderColor: palette.border }]}>
              <Text style={[styles.badgeText, { color: palette.primary }]}>
                {mode}
              </Text>
            </View>

            <View style={[styles.badge, { backgroundColor: palette.softBg, borderColor: palette.border }]}>
              <Text style={[styles.badgeText, { color: palette.primary }]}>
                {time}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: palette.card }]}>
          <Text style={[styles.sectionTitle, { color: palette.primary }]}>
            معلومات الموعد
          </Text>

          <View style={[styles.infoRow, { borderBottomColor: palette.border }]}>
            <Text style={[styles.infoValue, { color: palette.text }]}>{date}</Text>
            <Text style={[styles.infoLabel, { color: palette.subText }]}>التاريخ</Text>
          </View>

          <View style={[styles.infoRow, { borderBottomColor: palette.border }]}>
            <Text style={[styles.infoValue, { color: palette.text }]}>{time}</Text>
            <Text style={[styles.infoLabel, { color: palette.subText }]}>الوقت</Text>
          </View>

          <View style={[styles.infoRow, { borderBottomColor: palette.border }]}>
            <Text style={[styles.infoValue, { color: palette.text }]}>{mode}</Text>
            <Text style={[styles.infoLabel, { color: palette.subText }]}>نوع المقابلة</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoValue, { color: palette.text }]}>{location}</Text>
            <Text style={[styles.infoLabel, { color: palette.subText }]}>الموقع</Text>
          </View>
        </View>

        <View style={[styles.notesCard, { backgroundColor: palette.card }]}>
          <Text style={[styles.sectionTitle, { color: palette.primary }]}>
            ملاحظات
          </Text>

          <Text style={[styles.notesText, { color: palette.subText }]}>
            {notes}
          </Text>
        </View>

        <View style={{ height: 28 }} />
      </ScrollView>
    </View>
  );
};

export default InterviewDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  headingBlock: {
    marginBottom: 16,
  },

  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 6,
  },

  screenSubTitle: {
    fontSize: 13,
    lineHeight: 22,
    textAlign: 'right',
    writingDirection: 'rtl',
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

  heroTitle: {
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 8,
  },

  heroCompany: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 14,
  },

  badgesRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
  },

  badge: {
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 8,
    marginBottom: 8,
  },

  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    writingDirection: 'rtl',
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

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 14,
  },

  infoRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },

  infoLabel: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginLeft: 14,
  },

  infoValue: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'left',
    writingDirection: 'rtl',
  },

  notesCard: {
    borderRadius: 24,
    padding: 18,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  notesText: {
    fontSize: 14,
    lineHeight: 24,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});