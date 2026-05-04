import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import AppHeader from '../components/AppHeader';

const SuccessIcon = ({ bg = '#EAF8F1', color = '#36B487' }) => (
  <View style={styles.successIconWrap}>
    <View style={[styles.successCircle, { backgroundColor: bg }]}>
      <View style={[styles.checkStem, { backgroundColor: color }]} />
      <View style={[styles.checkArm, { backgroundColor: color }]} />
    </View>
  </View>
);

const ApplicationSubmittedScreen = ({ navigation }) => {
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
    headerBtnBg: colors.card,
    iconColor: darkMode ? '#F5F3FB' : '#1F1655',
    successBg: darkMode ? '#20392F' : '#EAF8F1',
    successColor: '#36B487',
    heroGradient: darkMode
      ? ['#3E3561', '#352C59', '#2A224D']
      : ['#4B3F72', '#40357E', '#312767'],
    heroSubText: 'rgba(255,255,255,0.88)',
    buttonText: '#FFFFFF',
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.pageBg }]}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={palette.pageBg}
      />

      
      <AppHeader
        navigation={navigation}
        leftType="bell"
        rightType="profile"
        horizontalPadding={25}
      />

      <View style={styles.content}>
        <LinearGradient
          colors={palette.heroGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <Text style={styles.heroTitle}>تم إرسال الطلب بنجاح</Text>
          <Text style={styles.heroSubTitle}>
            تم استلام طلبك وسنتواصل معك قريبًا بعد مراجعة البيانات
          </Text>
        </LinearGradient>

        <View style={[styles.card, { backgroundColor: palette.cardBg }]}>
          <SuccessIcon bg={palette.successBg} color={palette.successColor} />

          <Text style={[styles.message, { color: palette.text }]}>
            شكرًا لك، تم تسجيل طلب التقديم الخاص بك بنجاح.
          </Text>

          <Text style={[styles.subMessage, { color: palette.subText }]}>
            يمكنك الآن العودة إلى الصفحة الرئيسية ومتابعة الفرص الأخرى أو انتظار
            تحديثات الجهة.
          </Text>

          <TouchableOpacity
            style={[styles.homeBtn, { backgroundColor: palette.primary }]}
            activeOpacity={0.88}
            onPress={() => navigation.navigate('JobSeekerTabNavigator')}
          >
            <Text style={[styles.homeBtnText, { color: palette.buttonText }]}>
              العودة للرئيسية
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
    width: 118,
    height: 42,
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

  profileMiniWrap: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileHead: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginBottom: 2,
  },

  profileBody: {
    width: 13,
    height: 7,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
    justifyContent: 'center',
  },

  heroCard: {
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 18,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },

  heroTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '800',
    writingDirection: 'rtl',
  },

  heroSubTitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.88)',
    textAlign: 'center',
    writingDirection: 'rtl',
    marginTop: 8,
    lineHeight: 21,
  },

  card: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  successIconWrap: {
    marginBottom: 18,
  },

  successCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  checkStem: {
    position: 'absolute',
    width: 4,
    height: 18,
    transform: [{ rotate: '45deg' }],
    top: 34,
    left: 30,
    borderRadius: 3,
  },

  checkArm: {
    position: 'absolute',
    width: 4,
    height: 30,
    transform: [{ rotate: '-45deg' }],
    top: 22,
    left: 42,
    borderRadius: 3,
  },

  message: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '800',
    marginBottom: 10,
    lineHeight: 24,
    writingDirection: 'rtl',
  },

  subMessage: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 22,
    writingDirection: 'rtl',
    marginBottom: 22,
  },

  homeBtn: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 36,
    minWidth: 190,
    alignItems: 'center',
  },

  homeBtnText: {
    fontSize: 15,
    fontWeight: '800',
    writingDirection: 'rtl',
  },
});

export default ApplicationSubmittedScreen;