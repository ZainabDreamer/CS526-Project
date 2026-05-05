// ================== IMPORTS ==================
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../context/ThemeContext';
import AppHeader from '../components/AppHeader';
import CustomButton from '../components/CustomButton';
import { Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { db } from '../services/firebase';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
// ================== MAIN SCREEN ==================
const OrgInterviewSchedulingScreen = ({ navigation, route }) => {
  const { colors, darkMode } = useTheme();
  const { user } = useContext(AuthContext);
  const applicant = route?.params?.applicant;
  // ================== STATE ==================
  const [type, setType] = useState('عن بعد');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  // ================== OPTIONS ==================
  const options = ['حضورية', 'عن بعد', 'مترجم إشارة'];
  // ================== THEME PALETTE ==================
  const palette = {
    bg: colors.background,
    card: colors.card,
    text: colors.text,
    subText: colors.subText,
    primary: colors.primary,
    border: darkMode ? '#39344E' : '#ECE7F7',
    softBg: darkMode ? '#2A273A' : '#F5F3FB',
    inputBg: darkMode ? '#2A273A' : '#F8F6FC',
    inputBorder: darkMode ? '#39344E' : '#D9D3EA',
    radioBorder: darkMode ? '#524B6B' : '#CFC9E8',
    radioDot: '#36B487',
  };
  // ================== DATE HANDLER ==================
  const handleDateChange = (_, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };
  // ================== DATE FORMATTER ==================
  const formatDate = (date) => {
    if (!date) return 'اختر التاريخ';
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };
  // ================== SCREEN UI ==================
  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
      <AppHeader navigation={navigation} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: palette.text }]}>
          تحديد موعد المقابلة
        </Text>
        {applicant && (
          <Text style={[styles.name, { color: palette.subText }]}>
            {applicant.name}
          </Text>
        )}
        <View style={[styles.card, { backgroundColor: palette.card }]}>
          <Text style={[styles.sectionTitle, { color: palette.primary }]}>
            نوع المقابلة
          </Text>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={styles.optionRow}
              onPress={() => setType(opt)}
              activeOpacity={0.85}
            >
              <View
                style={[
                  styles.radio,
                  { borderColor: palette.radioBorder },
                  type === opt && { borderColor: palette.primary },
                ]}
              >
                {type === opt && (
                  <View
                    style={[styles.dot, { backgroundColor: palette.radioDot }]}
                  />
                )}
              </View>
              <Text style={[styles.optionText, { color: palette.text }]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={[styles.card, { backgroundColor: palette.card }]}>
          <Text style={[styles.sectionTitle, { color: palette.primary }]}>
            تاريخ المقابلة
          </Text>
          <TouchableOpacity
            style={[
              styles.datePickerButton,
              {
                backgroundColor: palette.inputBg,
                borderColor: palette.inputBorder,
              },
            ]}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.datePickerText,
                {
                  color: selectedDate ? palette.text : palette.subText,
                },
              ]}
            >
              {formatDate(selectedDate)}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>
        <CustomButton
  title="إرسال الدعوة"
  onPress={async () => {
    if (!selectedDate) {
      Alert.alert('تاريخ مطلوب', 'يرجى اختيار تاريخ المقابلة.');
      return;
    }
   const payload = {
  orgId: user?.uid || user?.id || null,
  orgName: user?.orgName || user?.name || '',
  applicantId: applicant?.rawApplication?.applicantId || applicant?.applicantId || null,
  applicationId: applicant?.applicationId || applicant?.id || null,
  applicantName: applicant?.name || 'متقدم',
  applicantPhone: applicant?.phone || '',
  applicantEmail: applicant?.email || '',
  jobTitle: applicant?.jobTitle || '',
  type,
  date: selectedDate.toISOString(),
  status: 'scheduled',
  createdAt: serverTimestamp(),
};
try {
  await addDoc(collection(db, 'interviews'), payload);
  if (payload.applicationId) {
    await updateDoc(doc(db, 'applications', payload.applicationId), {
      status: 'interview_scheduled',
      interviewType: type,
      interviewDate: selectedDate.toISOString(),
      updatedAt: serverTimestamp(),
    });
  }
  Alert.alert('تم', 'تم إرسال دعوة المقابلة وحفظ الموعد.', [
    { text: 'حسنًا', onPress: () => navigation.goBack() },
  ]);
} catch (error) {
  console.log('SAVE INTERVIEW ERROR:', error);
  Alert.alert('خطأ', 'تعذر حفظ موعد المقابلة.');
}
  }}
  style={[styles.submitButton, { backgroundColor: palette.primary }]}
  textStyle={styles.submitButtonText}
/>
      </ScrollView>
    </View>
  );
};
// ================== STYLES ==================
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 6,
  },
  name: {
    fontSize: 14,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 20,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 14,
  },
  optionText: {
    marginRight: 10,
    fontSize: 14,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  datePickerButton: {
    minHeight: 54,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  datePickerText: {
    fontSize: 15,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 18,
    paddingVertical: 14,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    writingDirection: 'rtl',
  },
});
export default OrgInterviewSchedulingScreen;
