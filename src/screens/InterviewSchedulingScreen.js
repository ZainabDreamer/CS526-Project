import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { SCREEN_NAMES } from '../constants/labels';
import { useTheme } from '../context/ThemeContext';

const BellIcon = ({ color = '#1F1655' }) => (
  <View style={styles.bellShapeWrap}>
    <View style={[styles.bellTop, { backgroundColor: color }]} />
    <View style={[styles.bellBody, { backgroundColor: color }]} />
    <View style={[styles.bellClapper, { backgroundColor: color }]} />
  </View>
);

const ProfileIcon = ({ color = '#1F1655' }) => (
  <View style={styles.profileMiniWrap}>
    <View style={[styles.profileHead, { backgroundColor: color }]} />
    <View style={[styles.profileBody, { backgroundColor: color }]} />
  </View>
);

const CalendarIcon = ({ color = '#1F1655' }) => (
  <View style={styles.calendarWrap}>
    <View style={[styles.calendarTopBar, { backgroundColor: color }]} />
    <View style={[styles.calendarBody, { borderColor: color }]} />
    <View style={[styles.calendarDot1, { backgroundColor: color }]} />
    <View style={[styles.calendarDot2, { backgroundColor: color }]} />
    <View style={[styles.calendarDot3, { backgroundColor: color }]} />
  </View>
);

const InterviewSchedulingScreen = ({ navigation }) => {
  const { colors, darkMode } = useTheme();

  const [preference, setPreference] = useState('مقابلة عن بعد');
  const [selectedDate, setSelectedDate] = useState('');

  const options = ['مقابلة حضورية', 'مقابلة عن بعد', 'مترجم لغة إشارة'];

  const palette = {
    pageBg: colors.background,
    cardBg: colors.card,
    text: colors.text,
    subText: colors.subText,
    primary: colors.primary,
    border: darkMode ? '#39344E' : '#ECE7F7',
    radioBorder: darkMode ? '#4A4560' : '#D9D3EA',
    radioSelected: '#36B487',
    iconColor: darkMode ? '#F5F3FB' : '#1F1655',
    iconBtnBg: colors.card,
    softBg: darkMode ? '#2A273A' : '#F5F3FB',
    heroGradient: darkMode
      ? ['#3E3561', '#352C59', '#2A224D']
      : ['#4B3F72', '#40357E', '#312767'],
    heroSubText: 'rgba(255,255,255,0.88)',
    inputPlaceholder: darkMode ? '#A9A5BC' : 'rgba(31,22,85,0.45)',
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.pageBg }]}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={palette.pageBg}
      />

      
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: palette.iconBtnBg }]}
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
          style={[styles.iconButton, { backgroundColor: palette.iconBtnBg }]}
          onPress={() => navigation.navigate(SCREEN_NAMES.PROFILE)}
          activeOpacity={0.85}
        >
          <ProfileIcon color={palette.iconColor} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        
        <LinearGradient
          colors={palette.heroGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <Text style={styles.congrats}>مبروك!</Text>
          <Text style={styles.subtitle}>
            من بين العديد من المتقدمين تم اختيارك للمقابلة الشخصية
          </Text>
        </LinearGradient>

       
        <View style={[styles.formCard, { backgroundColor: palette.cardBg }]}>
          <Text style={[styles.preferenceLabel, { color: palette.primary }]}>
            في المقابلة الوظيفية تفضل
          </Text>

          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={styles.radioRow}
              onPress={() => setPreference(opt)}
              activeOpacity={0.85}
            >
              <View
                style={[
                  styles.radio,
                  { borderColor: palette.radioBorder },
                  preference === opt && {
                    borderColor: palette.radioSelected,
                  },
                ]}
              >
                {preference === opt && <View style={styles.radioDot} />}
              </View>

              <Text style={[styles.radioText, { color: palette.text }]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        
        <View style={[styles.formCard, { backgroundColor: palette.cardBg }]}>
          <Text style={[styles.bookLabel, { color: palette.primary }]}>
            حجز المواعيد المتاحة
          </Text>

          <View style={styles.datePickerRow}>
            <TouchableOpacity
              style={[
                styles.calendarButton,
                {
                  backgroundColor: palette.softBg,
                  borderColor: palette.border,
                },
              ]}
              activeOpacity={0.85}
            >
              <CalendarIcon color={palette.iconColor} />
            </TouchableOpacity>

            <View style={styles.dateInputWrap}>
              <CustomInput
                value={selectedDate}
                onChangeText={setSelectedDate}
                placeholder="اختر التاريخ المناسب"
                style={styles.dateInput}
                inputStyle={[
                  styles.dateInputText,
                  { color: palette.text },
                ]}
                placeholderTextColor={palette.inputPlaceholder}
              />
            </View>
          </View>

          <CustomButton
            title="تأكيد"
            onPress={() => navigation.navigate(SCREEN_NAMES.APPLICATION_SUBMITTED)}
            style={[styles.confirmBtn, { backgroundColor: palette.primary }]}
            textStyle={styles.confirmBtnText}
          />
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
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 20,
  },

  heroCard: {
    borderRadius: 24,
    paddingVertical: 22,
    paddingHorizontal: 18,
    marginBottom: 16,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },

  congrats: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'right',
    marginBottom: 8,
    writingDirection: 'rtl',
  },

  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.88)',
    textAlign: 'right',
    lineHeight: 24,
    fontWeight: '600',
    writingDirection: 'rtl',
  },

  formCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  preferenceLabel: {
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'right',
    marginBottom: 14,
    writingDirection: 'rtl',
  },

  radioRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 12,
  },

  radioText: {
    fontSize: 14,
    marginRight: 10,
    writingDirection: 'rtl',
    textAlign: 'right',
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioSelected: {},

  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#36B487',
  },

  bookLabel: {
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'right',
    marginBottom: 12,
    writingDirection: 'rtl',
  },

  datePickerRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 22,
  },

  calendarButton: {
    width: 50,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  dateInputWrap: {
    flex: 1,
  },

  dateInput: {
    marginBottom: 0,
  },

  dateInputText: {
    fontSize: 15,
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  calendarWrap: {
    width: 18,
    height: 18,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  calendarTopBar: {
    position: 'absolute',
    top: 1,
    width: 16,
    height: 4,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },

  calendarBody: {
    position: 'absolute',
    top: 4,
    width: 16,
    height: 13,
    borderWidth: 1.7,
    borderRadius: 3,
  },

  calendarDot1: {
    position: 'absolute',
    top: 8,
    left: 5,
    width: 2,
    height: 2,
    borderRadius: 1,
  },

  calendarDot2: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 2,
    height: 2,
    borderRadius: 1,
  },

  calendarDot3: {
    position: 'absolute',
    top: 8,
    left: 11,
    width: 2,
    height: 2,
    borderRadius: 1,
  },

  confirmBtn: {
    marginTop: 2,
    borderRadius: 16,
    paddingVertical: 14,
  },

  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});

export default InterviewSchedulingScreen;