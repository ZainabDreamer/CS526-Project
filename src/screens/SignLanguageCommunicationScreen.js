import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import * as Speech from 'expo-speech';
import { useTheme } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const QUICK_PHRASES = [
  'مرحبًا',
  'كيف أساعدك؟',
  'شكرًا لك',
  'من فضلك انتظر قليلًا',
  'أحتاج مترجم لغة إشارة',
  'تم الفهم',
  'هل تريد التوضيح؟',
  'سأكتب لك الآن',
];

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

const VolumeIcon = ({ color = '#3B2B93' }) => (
  <View style={styles.volumeWrap}>
    <View style={[styles.volumeBase, { backgroundColor: color }]} />
    <View style={[styles.volumeCone, { backgroundColor: color }]} />
    <View style={[styles.volumeWave1, { backgroundColor: color }]} />
    <View style={[styles.volumeWave2, { backgroundColor: color }]} />
  </View>
);

const TextCardIcon = ({ color = '#4B3F72' }) => (
  <View style={styles.textCardIconWrap}>
    <View style={[styles.textCardLine1, { backgroundColor: color }]} />
    <View style={[styles.textCardLine2, { backgroundColor: color }]} />
    <View style={[styles.textCardLine3, { backgroundColor: color }]} />
  </View>
);

const SignLanguageCommunicationScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const darkMode = theme?.darkMode ?? false;
  const colors = theme?.colors ?? {
    background: '#F3F1FA',
    card: '#FFFFFF',
    text: '#111111',
    subText: '#6E6A8A',
    primary: '#4B3F72',
  };

  const [inputText, setInputText] = useState('');
  const [displayText, setDisplayText] = useState(
    'اكتب الرسالة هنا ثم اعرضها أو شغّلها صوتيًا.'
  );

  // ✅ M4 DATA: حفظ الرسائل
  const saveMessage = async (text) => {
  try {
    await addDoc(collection(db, 'signLanguageMessages'), {
      userId: user?.uid || user?.id || null,
      userName: user?.name || '',
      text,
      type: 'text_to_speech',
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    console.log('SAVE SIGN LANGUAGE MESSAGE ERROR:', e);
  }
};
  const palette = {
    pageBg: colors.background,
    cardBg: colors.card,
    text: colors.text,
    subText: colors.subText,
    primary: colors.primary,
    iconButtonBg: colors.card,
    iconColor: colors.primary,
    softBg: darkMode ? '#2A273A' : '#F7F5FC',
    softBorder: darkMode ? '#3A3650' : '#ECE7F7',
    miniIconBg: darkMode ? '#2E2A40' : '#F5F3FB',
    secondaryActionBg: darkMode ? '#2E2A40' : '#F0ECFA',
    secondaryActionText: darkMode ? '#E7E3F5' : '#3B2B93',
    chipBg: darkMode ? '#2E2A40' : '#F0ECFA',
    chipText: darkMode ? '#E7E3F5' : '#3B2B93',
  };

  const handleApplyText = () => {
  if (!inputText.trim()) return;

  const text = inputText.trim();

  setDisplayText(text);

  // ✅ حفظ الرسالة
  saveMessage(text);
};

  const handleSpeak = () => {
    const text = (displayText || '').trim();
    if (!text) return;

    Speech.stop();
    Speech.speak(text, {
      language: 'ar-SA',
      pitch: 1,
      rate: 0.95,
    });
  };

  const handleQuickPhrase = (phrase) => {
  setInputText(phrase);
  setDisplayText(phrase);

  // ✅ حفظ العبارة
  saveMessage(phrase);
};

  return (
    <View style={[styles.container, { backgroundColor: palette.pageBg }]}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={palette.pageBg}
      />

      
      <View style={styles.headerRow}>
       <TouchableOpacity
  style={[styles.iconButton, { backgroundColor: palette.cardBg }]}
  onPress={() => navigation.navigate(SCREEN_NAMES.NOTIFICATIONS)}
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
        </View>

        
        <View style={[styles.heroCard, { backgroundColor: palette.cardBg }]}>
          <Text style={[styles.heroTitle, { color: palette.primary }]}>
            التواصل النصي والصوتي
          </Text>
          <Text style={[styles.heroSubTitle, { color: palette.subText }]}>
            اكتب الرسالة التي تريد إيصالها، ثم اعرضها بشكل واضح أو قم بتشغيلها صوتيًا.
          </Text>
        </View>

        
        <View style={[styles.previewCard, { backgroundColor: palette.cardBg }]}>
          <View style={styles.previewHeader}>
            <TouchableOpacity
              style={[
                styles.secondaryAction,
                { backgroundColor: palette.secondaryActionBg },
              ]}
              onPress={handleSpeak}
              activeOpacity={0.88}
            >
              <VolumeIcon color={palette.secondaryActionText} />
              <Text
                style={[
                  styles.secondaryActionText,
                  { color: palette.secondaryActionText },
                ]}
              >
                تشغيل الصوت
              </Text>
            </TouchableOpacity>

            <Text style={[styles.previewTitle, { color: palette.primary }]}>
              المعاينة
            </Text>
          </View>

          <View
            style={[
              styles.previewBox,
              {
                backgroundColor: palette.softBg,
                borderColor: palette.softBorder,
              },
            ]}
          >
            <Text style={[styles.previewText, { color: palette.text }]}>
              {displayText}
            </Text>
          </View>
        </View>

        
        <View style={[styles.inputCard, { backgroundColor: palette.cardBg }]}>
          <View style={styles.inputHeader}>
            <View
              style={[
                styles.inputHeaderIcon,
                {
                  backgroundColor: palette.miniIconBg,
                  borderColor: palette.softBorder,
                },
              ]}
            >
              <TextCardIcon color={palette.primary} />
            </View>
            <Text style={[styles.inputTitle, { color: palette.primary }]}>
              اكتب الرسالة
            </Text>
          </View>

          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="اكتب هنا الرسالة التي تريد عرضها"
            placeholderTextColor={palette.subText}
            multiline
            textAlign="right"
            style={[
              styles.textComposer,
              {
                backgroundColor: palette.softBg,
                borderColor: palette.softBorder,
                color: palette.text,
              },
            ]}
          />

          <TouchableOpacity
            style={[styles.primaryAction, { backgroundColor: palette.primary }]}
            onPress={handleApplyText}
            activeOpacity={0.88}
          >
            <Text style={styles.primaryActionText}>عرض النص</Text>
          </TouchableOpacity>
        </View>

        
        <View style={[styles.quickCard, { backgroundColor: palette.cardBg }]}>
          <Text style={[styles.quickTitle, { color: palette.primary }]}>
            عبارات سريعة
          </Text>

          <View style={styles.chipsWrap}>
            {QUICK_PHRASES.map((phrase) => (
              <TouchableOpacity
                key={phrase}
                style={[styles.quickChip, { backgroundColor: palette.chipBg }]}
                onPress={() => handleQuickPhrase(phrase)}
                activeOpacity={0.88}
              >
                <Text
                  style={[styles.quickChipText, { color: palette.chipText }]}
                >
                  {phrase}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
    color: '#1F1655',
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
    fontSize: 18,
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

  previewCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  previewHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  previewTitle: {
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  previewBox: {
    minHeight: 140,
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    justifyContent: 'center',
  },

  previewText: {
    fontSize: 24,
    textAlign: 'center',
    writingDirection: 'rtl',
    lineHeight: 38,
    fontWeight: '700',
  },

  inputCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  inputHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 12,
  },

  inputHeaderIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    borderWidth: 1,
  },

  inputTitle: {
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  textComposer: {
    minHeight: 130,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    fontSize: 15,
    textAlign: 'right',
    textAlignVertical: 'top',
    writingDirection: 'rtl',
    marginBottom: 14,
  },

  primaryAction: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },

  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    writingDirection: 'rtl',
  },

  secondaryAction: {
    borderRadius: 14,
    paddingVertical: 9,
    paddingHorizontal: 12,
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },

  secondaryActionText: {
    fontSize: 12,
    fontWeight: '800',
    writingDirection: 'rtl',
    marginRight: 6,
  },

  quickCard: {
    borderRadius: 24,
    padding: 18,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  quickTitle: {
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 12,
  },

  chipsWrap: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
  },

  quickChip: {
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginLeft: 8,
    marginBottom: 8,
  },

  quickChipText: {
    fontSize: 13,
    fontWeight: '700',
    writingDirection: 'rtl',
  },

  volumeWrap: {
    width: 18,
    height: 18,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  volumeBase: {
    position: 'absolute',
    left: 1,
    width: 5,
    height: 8,
    borderRadius: 2,
  },

  volumeCone: {
    position: 'absolute',
    left: 5,
    width: 7,
    height: 10,
    transform: [{ skewX: '-20deg' }],
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },

  volumeWave1: {
    position: 'absolute',
    right: 1,
    width: 2,
    height: 8,
    borderRadius: 2,
  },

  volumeWave2: {
    position: 'absolute',
    right: -2,
    width: 2,
    height: 12,
    borderRadius: 2,
  },

  textCardIconWrap: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textCardLine1: {
    width: 14,
    height: 2,
    borderRadius: 2,
    marginBottom: 3,
  },

  textCardLine2: {
    width: 12,
    height: 2,
    borderRadius: 2,
    marginBottom: 3,
  },

  textCardLine3: {
    width: 10,
    height: 2,
    borderRadius: 2,
  },
});

export default SignLanguageCommunicationScreen;