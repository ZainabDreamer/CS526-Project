import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
 StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';

const LANGS = [
  { code: 'ar', label: 'العربية', desc: 'استخدام التطبيق باللغة العربية' },
  { code: 'en', label: 'English', desc: 'Use the app in English' },
];

const STORAGE_KEY = 'app_language';

const BackArrowIcon = ({ color = '#1F1655' }) => (
  <Text style={[styles.backArrowIcon, { color }]}>{'‹'}</Text>
);

const LanguageSelectScreen = ({ navigation }) => {
  const theme = useTheme();
  const darkMode = theme?.darkMode ?? false;
  const colors = theme?.colors ?? {
    background: '#F3F1FA',
    card: '#FFFFFF',
    text: '#111111',
    subText: '#6E6A8A',
    primary: '#4B3F72',
  };

  const [selected, setSelected] = useState('ar');

  const palette = {
    pageBg: colors.background,
    cardBg: colors.card,
    text: colors.text,
    subText: colors.subText,
    primary: colors.primary,
    border: darkMode ? '#312D45' : '#F1EFF8',
    headerBtnBg: colors.card,
    activeBg: darkMode ? '#2A273A' : '#F7F5FC',
    activeBorder: darkMode ? '#5A4FA3' : '#E4DEEF',
    check: '#3B2B93',
  };

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) setSelected(saved);
    })();
  }, []);

  const handleSelect = async (code) => {
    setSelected(code);
    await AsyncStorage.setItem(STORAGE_KEY, code);
    navigation.goBack();
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
            اختر اللغة
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: palette.cardBg }]}>
          {LANGS.map((lang, index) => {
            const isActive = selected === lang.code;

            return (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.langRow,
                  index !== LANGS.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: palette.border,
                  },
                  isActive && {
                    backgroundColor: palette.activeBg,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: palette.activeBorder,
                    paddingHorizontal: 14,
                  },
                ]}
                onPress={() => handleSelect(lang.code)}
                activeOpacity={0.85}
              >
                <View style={styles.langRowInner}>
                  <View style={styles.textBlock}>
                    <Text
                      style={[
                        styles.langText,
                        { color: isActive ? palette.primary : palette.text },
                      ]}
                    >
                      {lang.label}
                    </Text>

                    <Text
                      style={[
                        styles.langDesc,
                        { color: palette.subText },
                      ]}
                    >
                      {lang.desc}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.checkDot,
                      {
                        backgroundColor: isActive ? palette.check : 'transparent',
                        borderWidth: isActive ? 0 : 1.5,
                        borderColor: isActive ? palette.check : palette.border,
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 28 }} />
      </ScrollView>
    </View>
  );
};

export default LanguageSelectScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

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

  langRow: {
    paddingVertical: 14,
    marginBottom: 10,
  },

  langRowInner: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  textBlock: {
    flex: 1,
    alignItems: 'flex-end',
  },

  langText: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  langDesc: {
    fontSize: 13,
    textAlign: 'right',
    marginTop: 4,
    writingDirection: 'rtl',
    lineHeight: 20,
  },

  checkDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 10,
  },

  backArrowIcon: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 26,
    includeFontPadding: false,
  },
});