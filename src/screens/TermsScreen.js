import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const BackArrowIcon = ({ color = '#1F1655' }) => (
  <Text style={[styles.backArrowIcon, { color }]}>{'‹'}</Text>
);

const TermsScreen = ({ navigation }) => {
  const theme = useTheme();
  const darkMode = theme?.darkMode ?? false;
  const colors = theme?.colors ?? {
    background: '#F3F1FA',
    card: '#FFFFFF',
    text: '#111111',
    subText: '#6E6A8A',
    primary: '#4B3F72',
  };

  const palette = {
    pageBg: colors.background,
    cardBg: colors.card,
    text: colors.text,
    subText: colors.subText,
    primary: colors.primary,
    border: darkMode ? '#312D45' : '#F1EFF8',
    headerBtnBg: colors.card,
    bullet: '#36B487',
  };

  const terms = [
    'الاستخدام المشروع',
    'صحة المعلومات',
    'الخصوصية',
    'تقييم الجهات',
    'حقوق الملكية',
    'التعديلات',
  ];

  const termsDetails = {
    'الاستخدام المشروع':
      'يجب استخدام التطبيق لأغراض قانونية فقط، وعدم إساءة استخدام الخدمات أو إدخال بيانات مضللة.',
    'صحة المعلومات':
      'يتحمل المستخدم مسؤولية دقة المعلومات المدخلة، سواء كان فردًا أو جهة.',
    'الخصوصية':
      'نلتزم بحماية بيانات المستخدمين وعدم مشاركتها مع أي طرف ثالث دون إذن، إلا في الحالات النظامية.',
    'تقييم الجهات':
      'جميع التقييمات المقدمة تهدف للتحسين ولا تمثل حكمًا نهائيًا، ويجب استخدامها بمسؤولية.',
    'حقوق الملكية':
      'جميع محتويات التطبيق (تصميم، بيانات، نظام) هي ملك لتطبيق شمولية ولا يجوز نسخها أو إعادة استخدامها دون إذن.',
    'التعديلات':
      'يحق لإدارة التطبيق تعديل الشروط أو الخدمات في أي وقت، مع إشعار المستخدمين عند الحاجة.',
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.pageBg }]}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={palette.pageBg}
      />

      <View style={styles.headerRow}>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: palette.headerBtnBg }]}
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
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionHint, { color: palette.subText }]} />
          <Text style={[styles.sectionTitle, { color: palette.text }]}>
            الشروط والأحكام
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: palette.cardBg }]}>
          <Text style={[styles.paragraph, { color: palette.subText }]}>
            باستخدامك لتطبيق شمولية، فإنك توافق على الالتزام بالشروط التالية:
          </Text>

          {terms.map((item) => (
            <View key={item} style={styles.termBlock}>
              <View style={styles.bulletRow}>
                <Text style={[styles.bulletText, { color: palette.text }]}>
                  {item}
                </Text>
                <View
                  style={[styles.bulletDot, { backgroundColor: palette.bullet }]}
                />
              </View>

              <Text style={[styles.paragraph, { color: palette.subText }]}>
                {termsDetails[item]}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ height: 28 }} />
      </ScrollView>
    </View>
  );
};

export default TermsScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 52,
    marginBottom: 25,
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
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    paddingHorizontal: 10,
  },

  sectionHint: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  card: {
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 18,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  paragraph: {
    fontSize: 14,
    lineHeight: 24,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 14,
  },

  termBlock: {
    marginBottom: 8,
  },

  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },

  bulletText: {
    flex: 1,
    fontSize: 14,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 22,
  },

  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#36B487',
    marginLeft: 8,
    marginTop: 7,
  },

  backArrowIcon: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 26,
    includeFontPadding: false,
  },
});
