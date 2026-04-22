import React from 'react';
import { SCREEN_NAMES } from '../constants/labels';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import AppHeader from '../components/AppHeader';

const BackArrowIcon = ({ color = '#4B3F72' }) => (
  <Text style={[styles.backArrowIcon, { color }]}>{'‹'}</Text>
);

const BellIcon = ({ color = '#1F1655' }) => (
  <View style={styles.bellShapeWrap}>
    <View style={[styles.bellTop, { backgroundColor: color }]} />
    <View style={[styles.bellBody, { backgroundColor: color }]} />
    <View style={[styles.bellClapper, { backgroundColor: color }]} />
  </View>
);

const CameraCardIcon = ({ primary = '#4B3F72', secondary = '#6A5AA1' }) => (
  <View style={styles.cameraIconWrap}>
    <View style={[styles.cameraBody, { backgroundColor: primary }]} />
    <View style={styles.cameraLens} />
    <View style={[styles.cameraTop, { backgroundColor: secondary }]} />
  </View>
);

const ChatCardIcon = ({ primary = '#4B3F72' }) => (
  <View style={styles.chatIconWrap}>
    <View style={[styles.chatBubble, { backgroundColor: primary }]} />
    <View style={styles.chatLine1} />
    <View style={styles.chatLine2} />
    <View style={[styles.chatTail, { backgroundColor: primary }]} />
  </View>
);

const SignLanguageHomeScreen = ({ navigation }) => {
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
    iconButtonBg: colors.card,
    iconColor: colors.primary,
    heroTitle: colors.primary,
    optionTitle: colors.text,
    noteBg: darkMode ? '#262334' : '#F8F6FC',
    noteBorder: darkMode ? '#39344E' : '#ECE7F7',
    softBg: darkMode ? '#2A273A' : '#F5F3FB',
    softBorder: darkMode ? '#3A3650' : '#ECE7F7',
    iconSecondary: darkMode ? '#8A7CC8' : '#6A5AA1',
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.pageBg }]}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={palette.pageBg}
      />

      <View style={styles.headerRow}>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: palette.iconButtonBg }]}
          activeOpacity={0.85}
        >
          <BellIcon color={palette.iconColor} />
        </TouchableOpacity>

        <Image
          source={require('../../assets/logo2.png')}
          style={styles.topLogo}
          resizeMode="contain"
        />

        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: palette.iconButtonBg }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <BackArrowIcon color={palette.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionHint, { color: palette.subText }]}> </Text>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>لغة الإشارة</Text>
        </View>

        <View style={[styles.heroCard, { backgroundColor: palette.cardBg }]}>
          <Text style={[styles.heroTitle, { color: palette.heroTitle }]}>لغة الإشارة</Text>
          <Text style={[styles.heroSubTitle, { color: palette.subText }]}>
            اختر طريقة التواصل المناسبة لتسهيل التفاعل بشكل سريع وواضح داخل التطبيق.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.optionCard, { backgroundColor: palette.cardBg }]}
          activeOpacity={0.9}
          onPress={() => navigation.navigate(SCREEN_NAMES.SIGN_LANGUAGE_CAMERA)}
        >
          <View
            style={[
              styles.optionIconBox,
              {
                backgroundColor: palette.softBg,
                borderColor: palette.softBorder,
              },
            ]}
          >
            <CameraCardIcon
              primary={palette.primary}
              secondary={palette.iconSecondary}
            />
          </View>

          <View style={styles.optionTextWrap}>
            <Text style={[styles.optionTitle, { color: palette.optionTitle }]}>
              ترجمة لغة الإشارة بالكاميرا
            </Text>
            <Text style={[styles.optionDescription, { color: palette.subText }]}>
              استخدم الكاميرا لالتقاط الإشارات وعرض النص الناتج بشكل مباشر، مع إمكانية
              تشغيله صوتيًا.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionCard, { backgroundColor: palette.cardBg }]}
          activeOpacity={0.9}
          onPress={() =>
            navigation.navigate(SCREEN_NAMES.SIGN_LANGUAGE_COMMUNICATION)
          }
        >
          <View
            style={[
              styles.optionIconBox,
              {
                backgroundColor: palette.softBg,
                borderColor: palette.softBorder,
              },
            ]}
          >
            <ChatCardIcon primary={palette.primary} />
          </View>

          <View style={styles.optionTextWrap}>
            <Text style={[styles.optionTitle, { color: palette.optionTitle }]}>
              التواصل النصي والصوتي
            </Text>
            <Text style={[styles.optionDescription, { color: palette.subText }]}>
              اكتب رسالتك أو استخدم العبارات السريعة لعرضها أو نطقها لمستخدم لغة الإشارة.
            </Text>
          </View>
        </TouchableOpacity>

        <View
          style={[
            styles.noteCard,
            {
              backgroundColor: palette.noteBg,
              borderColor: palette.noteBorder,
            },
          ]}
        >
          <Text style={[styles.noteTitle, { color: palette.primary }]}>ملاحظة</Text>
          <Text style={[styles.noteText, { color: palette.subText }]}>
            يمكن لاحقًا ربط الترجمة الفعلية بموديل ذكاء اصطناعي أو خدمة خارجية حسب متطلبات
            المشروع.
          </Text>
        </View>

        <View style={{ height: 28 }} />
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

  topLogo: {
    width: 120,
    height: 60,
  },

  backArrowIcon: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 26,
    includeFontPadding: false,
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

  content: {
    paddingHorizontal: 20,
    paddingBottom: 18,
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
  },

  sectionHint: {
    fontSize: 13,
    fontWeight: '700',
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

  heroSubTitle: {
    fontSize: 14,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 22,
  },

  optionCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  optionIconBox: {
    width: 58,
    height: 58,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },

  optionTextWrap: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 16,
  },

  optionTitle: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 6,
  },

  optionDescription: {
    fontSize: 13,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 21,
  },

  noteCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
  },

  noteTitle: {
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 8,
  },

  noteText: {
    fontSize: 13,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 21,
  },

  cameraIconWrap: {
    width: 28,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  cameraBody: {
    width: 28,
    height: 18,
    borderRadius: 6,
  },

  cameraLens: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },

  cameraTop: {
    position: 'absolute',
    top: 2,
    right: 5,
    width: 8,
    height: 4,
    borderRadius: 2,
  },

  chatIconWrap: {
    width: 35,
    height: 24,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  chatBubble: {
    width: 30,
    height: 22,
    borderRadius: 8,
  },

  chatLine1: {
    position: 'absolute',
    top: 8,
    width: 14,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },

  chatLine2: {
    position: 'absolute',
    top: 13,
    width: 10,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },

  chatTail: {
    position: 'absolute',
    bottom: 2,
    left: 8,
    width: 8,
    height: 8,
    transform: [{ rotate: '45deg' }],
  },
});

export default SignLanguageHomeScreen;