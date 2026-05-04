import React, { useEffect, useRef, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Speech from 'expo-speech';
import { useTheme } from '../context/ThemeContext';

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

const CameraFlipIcon = () => (
  <View style={styles.flipWrap}>
    <View style={styles.flipArrowTop} />
    <View style={styles.flipArrowBottom} />
  </View>
);

const SignLanguageCameraScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const saveTranslation = async (text) => {
  try {
    await addDoc(collection(db, 'signLanguageTranslations'), {
      userId: user?.uid || user?.id || null,
      text,
      type: 'camera',
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    console.log('SAVE TRANSLATION ERROR:', e);
  }
};
  const darkMode = theme?.darkMode ?? false;
  const colors = theme?.colors ?? {
    background: '#F3F1FA',
    card: '#FFFFFF',
    text: '#111111',
    subText: '#6E6A8A',
    primary: '#4B3F72',
  };

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  const [cameraFacing, setCameraFacing] = useState('front');
  const [isRecording, setIsRecording] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  const [translatedText, setTranslatedText] = useState(
    'سيظهر هنا النص الناتج بعد بدء الالتقاط وربط نموذج الترجمة.'
  );

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
    secondaryActionBg: darkMode ? '#2E2A40' : '#F0ECFA',
    secondaryActionText: darkMode ? '#E7E3F5' : '#3B2B93',
    permissionText: colors.subText,
    tipColor: '#36B487',
    stopBg: '#B8465A',
    loadingColor: colors.subText,
    cameraCardBg: colors.card,
    panelBg: colors.card,
    overlayButtonBg: 'rgba(255,255,255,0.16)',
    overlayText: '#FFFFFF',
    guideBorder: 'rgba(255,255,255,0.8)',
    guideTextBg: 'rgba(0,0,0,0.22)',
  };

  useEffect(() => {
    if (!permission) return;

    if (!permission.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleToggleFacing = () => {
    setCameraFacing((prev) => (prev === 'front' ? 'back' : 'front'));
  };

  // ✅ M4 DEVICE FEATURE: Camera capture + mock sign language analysis
  const handleCaptureSign = async () => {
    if (!permission?.granted) {
      const res = await requestPermission();

      if (!res.granted) {
        Alert.alert('صلاحية مطلوبة', 'يلزم السماح بالكاميرا لاستخدام هذه الميزة.');
        return;
      }
    }

    if (!cameraRef.current) {
      Alert.alert('الكاميرا غير جاهزة', 'يرجى المحاولة مرة أخرى.');
      return;
    }

    try {
      setIsBusy(true);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        skipProcessing: false,
      });

      setCapturedPhoto(photo);

      // ✅ M4 MOCK AI: Simulated AI sign language translation
      setTimeout(() => {
        setTranslatedText('مرحبًا، أحتاج إلى مساعدة في التقديم على وظيفة.');
        saveTranslation('مرحبًا، أحتاج إلى مساعدة في التقديم على وظيفة.');
        setIsBusy(false);
      }, 1200);
    } catch (error) {
      setIsBusy(false);
      Alert.alert('تعذر الالتقاط', 'حدث خطأ أثناء التقاط صورة الإشارة.');
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    setTranslatedText('سيظهر هنا النص الناتج بعد بدء الالتقاط وربط نموذج الترجمة.');
    saveTranslation('مرحبًا، كيف يمكنني مساعدتك اليوم؟');
    setIsRecording(false);
    setIsBusy(false);
  };

  const handleStartStop = async () => {
    if (!permission?.granted) {
      const res = await requestPermission();

      if (!res.granted) {
        Alert.alert('صلاحية مطلوبة', 'يلزم السماح بالكاميرا لاستخدام هذه الميزة.');
        return;
      }
    }

    if (isRecording) {
      setIsRecording(false);
      setIsBusy(false);
      return;
    }

    setCapturedPhoto(null);
    setIsRecording(true);
    setIsBusy(true);

    // ✅ M4 MOCK AI: مكان الربط لاحقًا مع API / model
    setTimeout(() => {
      setTranslatedText('مرحبًا، كيف يمكنني مساعدتك اليوم؟');
      setIsBusy(false);
    }, 1500);
  };

  const handleSpeak = () => {
    const text = translatedText.trim();
    if (!text) return;

    Speech.stop();
    Speech.speak(text, {
      language: 'ar-SA',
      pitch: 1,
      rate: 0.95,
    });
  };

  const renderPermissionFallback = () => (
    <View style={[styles.permissionCard, { backgroundColor: palette.cardBg }]}>
      <Text style={[styles.permissionTitle, { color: palette.primary }]}>
        السماح بالكاميرا
      </Text>

      <Text style={[styles.permissionText, { color: palette.permissionText }]}>
        نحتاج إلى الكاميرا لالتقاط الإشارات وتحويلها لاحقًا إلى نص أو صوت.
      </Text>

      <TouchableOpacity
        style={[styles.primaryAction, { backgroundColor: palette.primary }]}
        onPress={requestPermission}
        activeOpacity={0.88}
      >
        <Text style={styles.primaryActionText}>منح الإذن</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCameraSection = () => {
    if (!permission?.granted) {
      return renderPermissionFallback();
    }

    return (
      <View style={[styles.cameraCard, { backgroundColor: palette.cameraCardBg }]}>
        {capturedPhoto ? (
          <View style={styles.previewWrap}>
            <Image
              source={{ uri: capturedPhoto.uri }}
              style={styles.previewImage}
              resizeMode="cover"
            />

            <View style={styles.previewOverlay}>
              <Text style={styles.previewText}>تم التقاط الإشارة بنجاح</Text>
            </View>
          </View>
        ) : (
          <View style={styles.cameraClip}>
  <CameraView
    ref={cameraRef}
    style={StyleSheet.absoluteFillObject}
    facing={cameraFacing}
    mode="picture"
  >
    <View style={styles.cameraOverlay}>
              <View style={styles.cameraTopRow}>
                <TouchableOpacity
                  style={[
                    styles.smallGhostButton,
                    { backgroundColor: palette.overlayButtonBg },
                  ]}
                  onPress={handleToggleFacing}
                  activeOpacity={0.88}
                >
                  <CameraFlipIcon />
                  <Text
                    style={[
                      styles.smallGhostButtonText,
                      { color: palette.overlayText },
                    ]}
                  >
                    تبديل
                  </Text>
                </TouchableOpacity>

                <View
                  style={[
                    styles.liveBadge,
                    { backgroundColor: palette.overlayButtonBg },
                  ]}
                >
                  <View style={styles.liveDot} />
                  <Text style={[styles.liveText, { color: palette.overlayText }]}>
                    مباشر
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.guideFrame,
                  { borderColor: palette.guideBorder },
                ]}
              >
                <Text
                  style={[
                    styles.guideText,
                    {
                      backgroundColor: palette.guideTextBg,
                      color: palette.overlayText,
                    },
                  ]}
                >
                  ضع اليدين والجسم داخل الإطار لتسهيل الترجمة
                </Text>
              </View>
            </View>
          </CameraView>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.pageBg }]}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={palette.pageBg}
      />

      <View style={styles.headerRow}>
        <TouchableOpacity
  
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
        </View>

        <View style={[styles.heroCard, { backgroundColor: palette.cardBg }]}>
          <Text style={[styles.heroTitle, { color: palette.primary }]}>
            ترجمة لغة الإشارة بالكاميرا
          </Text>

          <Text style={[styles.heroSubTitle, { color: palette.subText }]}>
            استخدم الكاميرا لالتقاط الإشارات وعرض النص الناتج بشكل مباشر مع إمكانية
            تشغيله صوتيًا.
          </Text>
        </View>

        {renderCameraSection()}

        <View style={[styles.panelCard, { backgroundColor: palette.panelBg }]}>
          <View style={styles.panelHeader}>
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

            <Text style={[styles.panelTitle, { color: palette.primary }]}>
              الناتج المترجم
            </Text>
          </View>

          <View
            style={[
              styles.outputBox,
              {
                backgroundColor: palette.softBg,
                borderColor: palette.softBorder,
              },
            ]}
          >
            {isBusy ? (
              <View style={styles.loadingWrap}>
                <ActivityIndicator size="small" color={palette.primary} />
                <Text style={[styles.loadingText, { color: palette.loadingColor }]}>
                  جارٍ تحليل الإشارات...
                </Text>
              </View>
            ) : (
              <Text style={[styles.outputText, { color: palette.text }]}>
                {translatedText}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.primaryAction,
              {
                backgroundColor: isRecording ? palette.stopBg : palette.primary,
              },
            ]}
            onPress={handleStartStop}
            activeOpacity={0.88}
          >
            <Text style={styles.primaryActionText}>
              {isRecording ? 'إيقاف الالتقاط' : 'بدء الالتقاط'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.captureAction,
              {
                backgroundColor: palette.secondaryActionBg,
                borderColor: palette.softBorder,
              },
            ]}
            onPress={capturedPhoto ? handleRetake : handleCaptureSign}
            activeOpacity={0.88}
          >
            <Text
              style={[
                styles.captureActionText,
                { color: palette.secondaryActionText },
              ]}
            >
              {capturedPhoto ? 'إعادة الالتقاط' : 'التقاط الإشارة'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.panelCard, { backgroundColor: palette.panelBg }]}>
          <Text style={[styles.panelTitle, { color: palette.primary }]}>
            إرشادات الاستخدام
          </Text>

          <View style={styles.tipRow}>
            <View style={[styles.tipDot, { backgroundColor: palette.tipColor }]} />
            <Text style={[styles.tipText, { color: palette.text }]}>
              احرص على وجود إضاءة واضحة أثناء الاستخدام.
            </Text>
          </View>

          <View style={styles.tipRow}>
            <View style={[styles.tipDot, { backgroundColor: palette.tipColor }]} />
            <Text style={[styles.tipText, { color: palette.text }]}>
              اجعل اليدين واضحتين بالكامل داخل إطار الكاميرا.
            </Text>
          </View>

          <View style={styles.tipRow}>
            <View style={[styles.tipDot, { backgroundColor: palette.tipColor }]} />
            <Text style={[styles.tipText, { color: palette.text }]}>
              يمكن لاحقًا ربط الصفحة بموديل ترجمة مباشر أو خدمة خارجية.
            </Text>
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

  cameraCard: {
    borderRadius: 26,
    padding: 10,
    marginBottom: 16,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  cameraClip: {
  height: 360,
  borderRadius: 20,
  overflow: 'hidden',
  backgroundColor: '#000',
},

  previewWrap: {
    height: 360,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
  },

  previewImage: {
    width: '100%',
    height: '100%',
  },

  previewOverlay: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    left: 14,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },

  previewText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    writingDirection: 'rtl',
  },

  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: 'rgba(0,0,0,0.10)',
  },

  cameraTopRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  smallGhostButton: {
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },

  smallGhostButtonText: {
    fontSize: 12,
    fontWeight: '700',
    writingDirection: 'rtl',
    marginRight: 6,
  },

  liveBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#36B487',
    marginLeft: 6,
  },

  liveText: {
    fontSize: 12,
    fontWeight: '700',
    writingDirection: 'rtl',
  },

  guideFrame: {
    borderWidth: 2,
    borderRadius: 22,
    height: 220,
    justifyContent: 'flex-end',
    padding: 12,
  },

  guideText: {
    fontSize: 13,
    textAlign: 'center',
    writingDirection: 'rtl',
    lineHeight: 20,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },

  permissionCard: {
    borderRadius: 24,
    padding: 22,
    marginBottom: 16,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  permissionTitle: {
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 8,
  },

  permissionText: {
    fontSize: 14,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 22,
    marginBottom: 16,
  },

  panelCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  panelHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  panelTitle: {
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  outputBox: {
    minHeight: 110,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    justifyContent: 'center',
    marginBottom: 14,
  },

  outputText: {
    fontSize: 16,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 26,
  },

  loadingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 8,
    fontSize: 13,
    writingDirection: 'rtl',
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

  captureAction: {
    marginTop: 10,
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
  },

  captureActionText: {
    fontSize: 14,
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

  tipRow: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  tipDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginTop: 8,
  },

  tipText: {
    flex: 1,
    marginRight: 10,
    fontSize: 14,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 22,
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

  flipWrap: {
    width: 18,
    height: 18,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  flipArrowTop: {
    width: 12,
    height: 5,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    top: 2,
  },

  flipArrowBottom: {
    width: 12,
    height: 5,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    bottom: 2,
  },
});

export default SignLanguageCameraScreen;