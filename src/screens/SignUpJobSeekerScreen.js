import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
  Platform,
  Modal,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SCREEN_NAMES } from '../constants/labels';

const CITY_OPTIONS = ['الدمام', 'الخبر', 'الظهران', 'الجبيل', 'القطيف', 'الأحساء', 'أخرى'];
const EDUCATION_OPTIONS = ['ثانوي', 'دبلوم', 'بكالوريوس', 'ماجستير', 'دكتوراه', 'أخرى'];

//BackArrowIcon
const BackArrowIcon = ({ color = '#4B3F72' }) => (
  <Text style={[styles.backArrowIcon, { color }]}>{'‹'}</Text>
);

const SelectArrowIcon = ({ color = '#8A86A3' }) => (
  <Text style={[styles.selectArrowIcon, { color }]}>{'‹'}</Text>
);
//SelectionModal
const SelectionModal = ({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{title}</Text>

          <ScrollView
  contentContainerStyle={styles.content}
  showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="handled"
>
            {options.map((item) => {
              const isSelected = selectedValue === item;
              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.modalOption, isSelected && styles.modalOptionSelected]}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      isSelected && styles.modalOptionTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity style={styles.modalCloseBtn} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.modalCloseText}>إغلاق</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
//SignUpJobSeekerScreen
const SignUpJobSeekerScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    birthDate: '',
    email: '',
    city: '',
    customCity: '',
    nationality: 'مواطن',
    workPermit: '',
    education: '',
    customEducation: '',
    experience: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [educationModalVisible, setEducationModalVisible] = useState(false);

  const sanitizeName = (value) => {
    return value
      .replace(/[^\u0600-\u06FFa-zA-Z\s]/g, '')
      .replace(/\s{2,}/g, ' ')
      .slice(0, 60);
  };

  const sanitizePhone = (value) => {
    return value.replace(/\D/g, '').slice(0, 10);
  };

  const sanitizeEmail = (value) => {
    return value.replace(/\s/g, '').slice(0, 100);
  };

  const sanitizeText = (value, max = 100) => {
    return value.replace(/\s{2,}/g, ' ').slice(0, max);
  };

  const sanitizeExperience = (value) => {
    return value.replace(/\s{2,}/g, ' ').slice(0, 120);
  };

  const update = (key, val) => {
    let cleaned = val;

    switch (key) {
      case 'name':
        cleaned = sanitizeName(val);
        break;
      case 'phone':
        cleaned = sanitizePhone(val);
        break;
      case 'email':
        cleaned = sanitizeEmail(val);
        break;
      case 'customCity':
        cleaned = sanitizeText(val, 40);
        break;
      case 'workPermit':
        cleaned = sanitizeText(val, 40);
        break;
      case 'customEducation':
        cleaned = sanitizeText(val, 50);
        break;
      case 'experience':
        cleaned = sanitizeExperience(val);
        break;
      default:
        cleaned = val;
        break;
    }

    setForm((prev) => ({ ...prev, [key]: cleaned }));
  };

  const validateStep1 = () => {
    const missing = [];

    const finalCity = form.city === 'أخرى' ? form.customCity.trim() : form.city.trim();
    const finalEducation =
      form.education === 'أخرى' ? form.customEducation.trim() : form.education.trim();

    if (!form.name.trim()) missing.push('الاسم');
    if (!form.phone.trim()) missing.push('رقم الجوال');
    if (!form.birthDate.trim()) missing.push('تاريخ الميلاد');
    if (!form.email.trim()) missing.push('البريد الإلكتروني');
    if (!form.city.trim()) missing.push('المدينة');
    if (form.city === 'أخرى' && !form.customCity.trim()) missing.push('اسم المدينة');
    if (!form.education.trim()) missing.push('المؤهل العلمي');
    if (form.education === 'أخرى' && !form.customEducation.trim()) missing.push('المؤهل العلمي الآخر');

    if (missing.length > 0) {
      Alert.alert('حقول مطلوبة', `يرجى تعبئة الحقول التالية:\n- ${missing.join('\n- ')}`);
      return false;
    }

    if (form.name.trim().length < 3) {
      Alert.alert('الاسم غير صحيح', 'يرجى إدخال اسم صحيح لا يقل عن 3 أحرف.');
      return false;
    }

    if (!/^05\d{8}$/.test(form.phone)) {
      Alert.alert('رقم الجوال غير صحيح', 'يجب أن يبدأ رقم الجوال بـ 05 ويتكون من 10 أرقام.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      Alert.alert('البريد الإلكتروني غير صحيح', 'يرجى إدخال بريد إلكتروني صحيح.');
      return false;
    }

    if (finalCity.length < 2) {
      Alert.alert('المدينة غير صحيحة', 'يرجى إدخال اسم مدينة صحيح.');
      return false;
    }

    if (finalEducation.length < 2) {
      Alert.alert('المؤهل العلمي غير صحيح', 'يرجى إدخال مؤهل علمي صحيح.');
      return false;
    }

    if (form.workPermit.trim().length > 0 && form.workPermit.trim().length < 2) {
      Alert.alert('تصريح العمل غير صحيح', 'يرجى إدخال قيمة أوضح لتصريح العمل.');
      return false;
    }

    return true;
  };

   const handleNext = () => {
  if (!validateStep1()) return;

  const finalCity =
    form.city === 'أخرى' ? form.customCity.trim() : form.city.trim();

  const finalEducation =
    form.education === 'أخرى'
      ? form.customEducation.trim()
      : form.education.trim();

  const payload = {
    role: 'jobSeeker',
    name: form.name.trim(),
    phone: form.phone.trim(),
    birthDate: form.birthDate.trim(),
    email: form.email.trim().toLowerCase(),
    city: finalCity,
    nationality: form.nationality,
    workPermit: form.workPermit.trim(),
    education: finalEducation,
    experience: form.experience.trim(),
    step1CompletedAt: new Date().toISOString(),

    ...(form.city === 'أخرى' && form.customCity.trim()
      ? { customCity: form.customCity.trim() }
      : {}),

    ...(form.education === 'أخرى' && form.customEducation.trim()
      ? { customEducation: form.customEducation.trim() }
      : {}),
  };

  navigation.replace(SCREEN_NAMES.SIGNUP_JOB_SEEKER_STEP2, {
    form: payload,
  });
};
   const onChangeDate = (_, selectedDate) => {
  setShowDatePicker(false);

  if (!selectedDate) return;

  const yyyy = selectedDate.getFullYear();
  const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
  const dd = String(selectedDate.getDate()).padStart(2, '0');

  update('birthDate',`${yyyy}-${mm}-${dd}`);
};

  const renderRequiredLabel = (text) => (
    <Text style={styles.fieldLabel}>
      {text} <Text style={styles.requiredMark}>*</Text>
    </Text>
  );

  const renderOptionalLabel = (text) => (
    <Text style={styles.fieldLabel}>
      {text} <Text style={styles.optionalText}>(اختياري)</Text>
    </Text>
  );

  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    keyboardVerticalOffset={10}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F1FA" />

      <SelectionModal
        visible={cityModalVisible}
        title="اختر المدينة"
        options={CITY_OPTIONS}
        selectedValue={form.city}
        onSelect={(value) => update('city', value)}
        onClose={() => setCityModalVisible(false)}
      />

      <SelectionModal
        visible={educationModalVisible}
        title="اختر المؤهل العلمي"
        options={EDUCATION_OPTIONS}
        selectedValue={form.education}
        onSelect={(value) => update('education', value)}
        onClose={() => setEducationModalVisible(false)}
      />

      
      <View style={styles.progressBarWrap}>
        <View style={styles.progressTrack} />
        <View style={styles.progressFill} />
      </View>

      
      <View style={styles.headerRow}>
<TouchableOpacity
  style={styles.iconButton}
  onPress={() => navigation.goBack()}
  activeOpacity={0.85}
>
          <BackArrowIcon color="#4B3F72" />
        </TouchableOpacity>

        <Image
          source={require('../../assets/logo2.png')}
          style={styles.topLogo}
          resizeMode="contain"
        />

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHint}> </Text>
          <Text style={styles.sectionTitle}>إنشاء حساب باحث عن عمل</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionCardTitle}>المعلومات الأساسية</Text>

          <View style={styles.labelRow}>{renderRequiredLabel('الاسم')}</View>
          <View style={styles.inputBox}>
            <TextInput
              value={form.name}
              onChangeText={(v) => update('name', v)}
              placeholder="أدخل الاسم الكامل"
              placeholderTextColor="#9A96B2"
              style={styles.input}
              textAlign="right"
              maxLength={60}
            />
          </View>

          <View style={styles.labelRow}>{renderRequiredLabel('رقم الجوال')}</View>
          <View style={styles.inputBox}>
            <TextInput
              value={form.phone}
              onChangeText={(v) => update('phone', v)}
              keyboardType="phone-pad"
              placeholder="05XXXXXXXX"
              placeholderTextColor="#9A96B2"
              style={styles.input}
              textAlign="right"
              maxLength={10}
            />
          </View>

          <View style={styles.labelRow}>{renderRequiredLabel('تاريخ الميلاد')}</View>
          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.8}
          >
            <SelectArrowIcon />
            <Text style={[styles.selectText, !form.birthDate && styles.placeholderText]}>
              {form.birthDate || 'اختر تاريخ الميلاد'}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={new Date(2000, 0, 1)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeDate}
              maximumDate={new Date()}
            />
          )}

          <View style={styles.labelRow}>{renderRequiredLabel('البريد الإلكتروني')}</View>
          <View style={styles.inputBox}>
            <TextInput
              value={form.email}
              onChangeText={(v) => update('email', v)}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="example@email.com"
              placeholderTextColor="#9A96B2"
              style={styles.input}
              textAlign="right"
              maxLength={100}
            />
          </View>

          <View style={styles.labelRow}>{renderRequiredLabel('المدينة')}</View>
          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => setCityModalVisible(true)}
            activeOpacity={0.8}
          >
            <SelectArrowIcon />
            <Text style={[styles.selectText, !form.city && styles.placeholderText]}>
              {form.city || 'اضغط لاختيار المدينة'}
            </Text>
          </TouchableOpacity>

          {form.city === 'أخرى' && (
            <>
              <View style={styles.labelRow}>{renderRequiredLabel('اكتب اسم المدينة')}</View>
              <View style={styles.inputBox}>
                <TextInput
                  value={form.customCity}
                  onChangeText={(v) => update('customCity', v)}
                  placeholder="اكتب المدينة"
                  placeholderTextColor="#9A96B2"
                  style={styles.input}
                  textAlign="right"
                  maxLength={40}
                />
              </View>
            </>
          )}

          <View style={styles.labelRow}>{renderRequiredLabel('هل أنت مواطن / مقيم؟')}</View>
          <View style={styles.radioGroup}>
            {['مواطن', 'مقيم'].map((opt) => (
              <TouchableOpacity
                key={opt}
                style={styles.radioRow}
                onPress={() => update('nationality', opt)}
                activeOpacity={0.8}
              >
                <Text style={styles.radioText}>{opt}</Text>
                <View style={[styles.radio, form.nationality === opt && styles.radioSelected]}>
                  {form.nationality === opt && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.labelRow}>{renderOptionalLabel('هل لديك تصريح عمل ساري؟')}</View>
          <View style={styles.inputBox}>
            <TextInput
              value={form.workPermit}
              onChangeText={(v) => update('workPermit', v)}
              placeholder="مثال: نعم / لا / رقم التصريح"
              placeholderTextColor="#9A96B2"
              style={styles.input}
              textAlign="right"
              maxLength={40}
            />
          </View>

          <View style={styles.labelRow}>{renderRequiredLabel('المؤهل العلمي')}</View>
          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => setEducationModalVisible(true)}
            activeOpacity={0.8}
          >
            <SelectArrowIcon />
            <Text style={[styles.selectText, !form.education && styles.placeholderText]}>
              {form.education || 'اضغط لاختيار المؤهل العلمي'}
            </Text>
          </TouchableOpacity>

          {form.education === 'أخرى' && (
            <>
              <View style={styles.labelRow}>{renderRequiredLabel('اكتب المؤهل العلمي')}</View>
              <View style={styles.inputBox}>
                <TextInput
                  value={form.customEducation}
                  onChangeText={(v) => update('customEducation', v)}
                  placeholder="اكتب المؤهل"
                  placeholderTextColor="#9A96B2"
                  style={styles.input}
                  textAlign="right"
                  maxLength={50}
                />
              </View>
            </>
          )}

          <View style={styles.labelRow}>{renderOptionalLabel('الخبرة العملية')}</View>
          <View style={styles.inputBox}>
            <TextInput
              value={form.experience}
              onChangeText={(v) => update('experience', v)}
              placeholder="مثال: سنتان في خدمة العملاء"
              placeholderTextColor="#9A96B2"
              style={styles.input}
              textAlign="right"
              maxLength={120}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleNext} activeOpacity={0.85}>
          <Text style={styles.primaryButtonText}>التالي</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

//styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F1FA',
  },

  progressBarWrap: {
    paddingTop: 50,
    paddingHorizontal: 20,
    marginBottom: 14,
  },

  progressTrack: {
    height: 6,
    backgroundColor: '#DDD8EE',
    borderRadius: 6,
  },

  progressFill: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: '48%',
    height: 6,
    backgroundColor: '#36B487',
    borderRadius: 6,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 3 },
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

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
    textAlign: 'right',
    writingDirection: 'rtl',
    paddingHorizontal: 10,
  },

  sectionHint: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6E6A8A',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  sectionCardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#4B3F72',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 14,
  },

  labelRow: {
    width: '100%',
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },

  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F1655',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  requiredMark: {
    color: '#D64545',
  },

  optionalText: {
    color: '#8A86A3',
    fontSize: 12,
    fontWeight: '600',
  },

  inputBox: {
    width: '100%',
    height: 54,
    backgroundColor: '#F2F2F2',
    borderRadius: 18,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 14,
  },

  selectBox: {
    width: '100%',
    height: 54,
    backgroundColor: '#F2F2F2',
    borderRadius: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 14,
  },

  input: {
    width: '100%',
    fontSize: 14,
    color: '#1F1655',
    paddingVertical: 0,
  },

  selectText: {
    flex: 1,
    fontSize: 14,
    color: '#1F1655',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  placeholderText: {
    color: '#9A96B2',
  },

  radioGroup: {
    marginBottom: 14,
  },

  radioRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 10,
  },

  radioText: {
    fontSize: 14,
    color: '#1F1655',
    marginLeft: 10,
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CFC9E8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  radioSelected: {
    borderColor: '#36B487',
  },

  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#36B487',
  },

  primaryButton: {
    backgroundColor: '#C7C4F0',
    borderRadius: 18,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },

  primaryButtonText: {
    color: '#1F1655',
    fontSize: 18,
    fontWeight: '800',
    writingDirection: 'rtl',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    maxHeight: '70%',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F1655',
    textAlign: 'center',
    marginBottom: 16,
    writingDirection: 'rtl',
  },

  modalOption: {
    backgroundColor: '#F3F1FA',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
  },

  modalOptionSelected: {
    backgroundColor: '#DCD7F5',
  },

  modalOptionText: {
    fontSize: 15,
    color: '#1F1655',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  modalOptionTextSelected: {
    fontWeight: '800',
  },

  modalCloseBtn: {
    marginTop: 8,
    backgroundColor: '#C7C4F0',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },

  modalCloseText: {
    color: '#1F1655',
    fontSize: 16,
    fontWeight: '800',
    writingDirection: 'rtl',
  },

  backArrowIcon: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 26,
    includeFontPadding: false,
  },

  selectArrowIcon: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 22,
    includeFontPadding: false,
    transform: [{ rotate: '-90deg' }],
  },
});

export default SignUpJobSeekerScreen;
