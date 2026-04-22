import React, { useState } from 'react';
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

const OrgInterviewSchedulingScreen = ({ navigation, route }) => {
  const { colors, darkMode } = useTheme();

  const applicant = route?.params?.applicant;

  const [type, setType] = useState('عن بعد');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const options = ['حضورية', 'عن بعد', 'مترجم إشارة'];

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

  const handleDateChange = (_, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'اختر التاريخ';
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

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
          onPress={() => {
            navigation.goBack();
          }}
          style={[styles.submitButton, { backgroundColor: palette.primary }]}
          textStyle={styles.submitButtonText}
        />
      </ScrollView>
    </View>
  );
};

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