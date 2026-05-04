import React, { useState, useCallback, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { SCREEN_NAMES } from '../constants/labels';
import { useTheme } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const BackArrowIcon = ({ color = '#1F1655' }) => (
  <Text style={[styles.backArrowIcon, { color }]}>{'‹'}</Text>
);

const ChevronDownIcon = ({ color = '#8A85A0' }) => (
  <View style={styles.chevronWrap}>
    <View style={[styles.chevronLeft, { backgroundColor: color }]} />
    <View style={[styles.chevronRight, { backgroundColor: color }]} />
  </View>
);

const UploadIcon = ({ color = '#8F8B9E' }) => (
  <View style={styles.uploadIconWrap}>
    <View style={[styles.uploadArrowStem, { backgroundColor: color }]} />
    <View style={[styles.uploadArrowHeadLeft, { backgroundColor: color }]} />
    <View style={[styles.uploadArrowHeadRight, { backgroundColor: color }]} />
    <View style={[styles.uploadBase, { backgroundColor: color }]} />
  </View>
);

const DotCheckIcon = ({ color = '#36B487', bg = '#E8F7F1' }) => (
  <View style={[styles.dotCheckWrap, { backgroundColor: bg }]}>
    <View style={[styles.dotCheckStem, { backgroundColor: color }]} />
    <View style={[styles.dotCheckArm, { backgroundColor: color }]} />
  </View>
);

const DISABILITY_OPTIONS = [
  'إعاقة حركية',
  'إعاقة سمعية',
  'إعاقة بصرية',
  'إعاقة ذهنية بسيطة',
  'اضطراب طيف التوحد',
  'صعوبات تعلم',
  'أخرى',
];

const LocalInput = ({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
  palette,
}) => {
  return (
    <View style={styles.fieldBlock}>
      <Text style={[styles.fieldLabel, { color: palette.label }]}>{label}</Text>

      <View
        style={[
          styles.inputShell,
          {
            backgroundColor: palette.inputBg,
            borderColor: palette.inputBorder,
          },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          placeholder=""
          placeholderTextColor={palette.placeholder}
          style={[styles.inputText, { color: palette.text }]}
          textAlign="right"
        />
      </View>
    </View>
  );
};

const JobApplicationScreen = ({ navigation, route }) => {
  const { colors, darkMode } = useTheme();
  const { user } = useContext(AuthContext);
  const { job } = route.params || {};

  const [form, setForm] = useState({
  name: user?.name || '',
  phone: user?.phone || '',
  birthDate: user?.birthDate || '',
  email: user?.email || '',
  city: user?.city || '',
  nationality: user?.nationality || 'مواطن',
  workPermit: user?.workPermit || '',
  education: user?.education || '',
  experience: user?.experience || '',
  disabilityType: user?.disabilityType || '',
});

  const [resumeFile, setResumeFile] = useState(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDisabilityModal, setShowDisabilityModal] = useState(false);

  const palette = {
    pageBg: colors.background,
    cardBg: colors.card,
    text: colors.text,
    subText: colors.subText,
    primary: colors.primary,
    inputBg: darkMode ? '#2A273A' : '#FFFFFF',
    inputBorder: darkMode ? '#3A3650' : '#E4DEEF',
    label: darkMode ? '#DDD8EE' : '#111111',
    placeholder: darkMode ? '#A8A3BC' : '#8A85A0',
    radioBorder: darkMode ? '#4A4560' : '#D9D3EA',
    radioSelected: '#36B487',
    softBg: darkMode ? '#262334' : '#F8F6FC',
    softBorder: darkMode ? '#39344E' : '#ECE7F7',
    modalCard: colors.card,
    modalOverlay: 'rgba(0,0,0,0.35)',
    optionSelectedBg: darkMode ? '#2E2A40' : '#F3F1FA',
    uploadIcon: darkMode ? '#B7B2C9' : '#8F8B9E',
    submitText: '#FFFFFF',
  };

  const update = useCallback((key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  }, []);

  const handlePickResume = useCallback(async () => {
    try {
      setIsUploadingResume(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) {
        setIsUploadingResume(false);
        return;
      }

      const file = result.assets?.[0];
      if (!file) {
        setIsUploadingResume(false);
        return;
      }

      setResumeFile({
        name: file.name,
        uri: file.uri,
        mimeType: file.mimeType,
        size: file.size,
      });

      setIsUploadingResume(false);
      Alert.alert('تم اختيار الملف', file.name || 'تم اختيار السيرة الذاتية.');
    } catch (error) {
      setIsUploadingResume(false);
      Alert.alert(
        'تعذر اختيار الملف',
        'تأكدي من تثبيت expo-document-picker وأنكِ سمحتِ بالوصول للملفات.'
      );
    }
  }, []);

   const handleSubmit = useCallback(async () => {
    if (!form.name || !form.phone || !form.email || !form.city) {
      Alert.alert('بيانات ناقصة', 'يرجى تعبئة الحقول الأساسية.');
      return;
    }

    if (!form.disabilityType) {
      Alert.alert('نوع الإعاقة', 'يرجى اختيار نوع الإعاقة.');
      return;
    }

    if (!resumeFile) {
      Alert.alert('السيرة الذاتية', 'يرجى رفع السيرة الذاتية.');
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
  applicantId: user?.uid || user?.id || null,
  applicantName: form.name,
  applicantEmail: form.email,
  applicantPhone: form.phone,

  userRole: user?.role || 'jobSeeker',

  applicant: {
    name: form.name,
    phone: form.phone,
    birthDate: form.birthDate,
    email: form.email,
    city: form.city,
    nationality: form.nationality,
    workPermit: form.workPermit,
    education: form.education,
    experience: form.experience,
    disabilityType: form.disabilityType,
  },

  resume: resumeFile,

  jobId: job?.id || null,
  jobTitle: job?.title || '',
  orgId: job?.orgId || job?.organizationId || null,
  orgName: job?.orgName || job?.company || 'منظمة',

  job: {
    id: job?.id || null,
    title: job?.title || '',
    company: job?.orgName || job?.company || '',
    orgId: job?.orgId || job?.organizationId || null,
  },

  status: 'pending',
  submittedAt: serverTimestamp(),
  createdAt: serverTimestamp(),
};

      // ✅ M4 DATA/API CONNECTION: حفظ طلب التقديم في firestore
      await addDoc(collection(db, 'applications'), payload);

      setIsSubmitting(false);
      navigation.navigate(SCREEN_NAMES.APPLICATION_SUBMITTED);
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert('تعذر حفظ الطلب', 'حدث خطأ أثناء حفظ طلب التقديم.');
    }
  }, [form, resumeFile, job, navigation, user]);
        

  return (
    <View style={[styles.container, { backgroundColor: palette.pageBg }]}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={palette.pageBg}
      />

      <View style={styles.headerRow}>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: palette.cardBg }]}
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
        <View style={[styles.heroCard, { backgroundColor: palette.cardBg }]}>
          <Text style={[styles.heroTitle, { color: palette.primary }]}>
            التقديم على الوظيفة
          </Text>

          <Text style={[styles.heroSubTitle, { color: palette.subText }]}>
            {job?.title || 'استكمال بيانات التقديم'}
          </Text>
        </View>

        <View style={[styles.formCard, { backgroundColor: palette.cardBg }]}>
          <LocalInput
            label="الاسم"
            value={form.name}
            onChangeText={(v) => update('name', v)}
            palette={palette}
          />

          <LocalInput
            label="رقم الجوال"
            value={form.phone}
            onChangeText={(v) => update('phone', v)}
            keyboardType="phone-pad"
            palette={palette}
          />

          <LocalInput
            label="تاريخ الميلاد"
            value={form.birthDate}
            onChangeText={(v) => update('birthDate', v)}
            palette={palette}
          />

          <LocalInput
            label="البريد الإلكتروني"
            value={form.email}
            onChangeText={(v) => update('email', v)}
            keyboardType="email-address"
            palette={palette}
          />

          <LocalInput
            label="المدينة"
            value={form.city}
            onChangeText={(v) => update('city', v)}
            palette={palette}
          />

          <Text style={[styles.radioLabel, { color: palette.label }]}>
            هل أنت مواطن / مقيم؟
          </Text>

          {['مواطن', 'مقيم'].map((opt) => (
            <TouchableOpacity
              key={opt}
              style={styles.radioRow}
              onPress={() => update('nationality', opt)}
              activeOpacity={0.85}
            >
              <View
                style={[
                  styles.radio,
                  { borderColor: palette.radioBorder },
                  form.nationality === opt && {
                    borderColor: palette.radioSelected,
                  },
                ]}
              >
                {form.nationality === opt && <View style={styles.radioDot} />}
              </View>

              <Text style={[styles.radioText, { color: palette.text }]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}

          <LocalInput
            label="هل لديك تصريح عمل ساري؟ (إن لزم)"
            value={form.workPermit}
            onChangeText={(v) => update('workPermit', v)}
            palette={palette}
          />

          <LocalInput
            label="المؤهل العلمي"
            value={form.education}
            onChangeText={(v) => update('education', v)}
            palette={palette}
          />

          <LocalInput
            label="الخبرة العلمية"
            value={form.experience}
            onChangeText={(v) => update('experience', v)}
            palette={palette}
          />

          <Text style={[styles.fieldLabel, { color: palette.label }]}>
            نوع الإعاقة
          </Text>

          <TouchableOpacity
            style={[
              styles.dropdownBtn,
              {
                backgroundColor: palette.inputBg,
                borderColor: palette.inputBorder,
              },
            ]}
            activeOpacity={0.85}
            onPress={() => setShowDisabilityModal(true)}
          >
            <Text
              style={[
                styles.dropdownValue,
                {
                  color: form.disabilityType ? palette.text : palette.placeholder,
                },
              ]}
            >
              {form.disabilityType || 'اختر نوع الإعاقة'}
            </Text>

            <ChevronDownIcon color={palette.placeholder} />
          </TouchableOpacity>

          <Text style={[styles.fieldLabel, { color: palette.label }]}>
            السيرة الذاتية
          </Text>

          <TouchableOpacity
            style={[
              styles.uploadRow,
              {
                backgroundColor: palette.inputBg,
                borderColor: palette.inputBorder,
              },
            ]}
            activeOpacity={0.85}
            onPress={handlePickResume}
          >
            <Text
              style={[
                styles.uploadFileName,
                { color: resumeFile ? palette.text : palette.placeholder },
              ]}
              numberOfLines={1}
            >
              {resumeFile?.name || 'اختر ملف السيرة الذاتية'}
            </Text>

            <View style={styles.uploadLeft}>
              {isUploadingResume ? (
                <ActivityIndicator size="small" color={palette.primary} />
              ) : (
                <UploadIcon color={palette.uploadIcon} />
              )}
            </View>
          </TouchableOpacity>

          {resumeFile && (
            <View
              style={[
                styles.resumeInfoBox,
                {
                  backgroundColor: palette.softBg,
                  borderColor: palette.softBorder,
                },
              ]}
            >
              <Text style={[styles.resumeInfoText, { color: palette.text }]}>
                تم اختيار الملف بنجاح
              </Text>
              <DotCheckIcon />
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.submitBtn,
              {
                backgroundColor: palette.primary,
                opacity: isSubmitting ? 0.7 : 1,
              },
            ]}
            activeOpacity={0.85}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={[styles.submitBtnText, { color: palette.submitText }]}>
                التقديم
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      <Modal
        visible={showDisabilityModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDisabilityModal(false)}
      >
        <View
          style={[
            styles.modalOverlay,
            { backgroundColor: palette.modalOverlay },
          ]}
        >
          <View
            style={[
              styles.modalCard,
              { backgroundColor: palette.modalCard },
            ]}
          >
            <Text style={[styles.modalTitle, { color: palette.primary }]}>
              اختر نوع الإعاقة
            </Text>

            {DISABILITY_OPTIONS.map((option) => {
              const selected = form.disabilityType === option;

              return (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionRow,
                    {
                      backgroundColor: selected
                        ? palette.optionSelectedBg
                        : 'transparent',
                      borderColor: palette.softBorder,
                    },
                  ]}
                  activeOpacity={0.85}
                  onPress={() => {
                    update('disabilityType', option);
                    setShowDisabilityModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: selected ? palette.primary : palette.text },
                    ]}
                  >
                    {option}
                  </Text>

                  {selected && <DotCheckIcon />}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={[
                styles.closeBtn,
                {
                  borderColor: palette.inputBorder,
                  backgroundColor: palette.inputBg,
                },
              ]}
              onPress={() => setShowDisabilityModal(false)}
              activeOpacity={0.85}
            >
              <Text style={[styles.closeBtnText, { color: palette.subText }]}>
                إغلاق
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingTop: 4,
    paddingBottom: 20,
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
  },

  heroSubTitle: {
    fontSize: 14,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: 8,
    lineHeight: 22,
  },

  formCard: {
    borderRadius: 24,
    padding: 18,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  fieldBlock: {
    marginBottom: 14,
  },

  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
    marginBottom: 10,
    marginTop: 4,
    writingDirection: 'rtl',
  },

  inputShell: {
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },

  inputText: {
    fontSize: 14,
    writingDirection: 'rtl',
    textAlign: 'left',
  },

  radioLabel: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
    marginBottom: 10,
    marginTop: 4,
    writingDirection: 'rtl',
  },

  radioRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 10,
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

  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#36B487',
  },

  dropdownBtn: {
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 16,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dropdownValue: {
    fontSize: 14,
    writingDirection: 'rtl',
    textAlign: 'right',
    flex: 1,
    marginRight: 12,
  },

  uploadRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  uploadLeft: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  uploadFileName: {
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginRight: 10,
  },

  uploadIconWrap: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  uploadArrowStem: {
    width: 2,
    height: 9,
    borderRadius: 2,
    position: 'absolute',
    top: 1,
  },

  uploadArrowHeadLeft: {
    width: 2,
    height: 7,
    position: 'absolute',
    top: 6,
    left: 6,
    transform: [{ rotate: '45deg' }],
    borderRadius: 2,
  },

  uploadArrowHeadRight: {
    width: 2,
    height: 7,
    position: 'absolute',
    top: 6,
    right: 6,
    transform: [{ rotate: '-45deg' }],
    borderRadius: 2,
  },

  uploadBase: {
    width: 12,
    height: 2,
    borderRadius: 2,
    position: 'absolute',
    bottom: 1,
  },

  submitBtn: {
    marginTop: 8,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  submitBtnText: {
    fontSize: 15,
    fontWeight: '800',
  },

  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  modalCard: {
    width: '100%',
    borderRadius: 24,
    padding: 18,
  },

  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 14,
    writingDirection: 'rtl',
  },

  optionRow: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    marginBottom: 10,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  optionText: {
    fontSize: 14,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginRight: 10,
    flex: 1,
  },

  closeBtn: {
    marginTop: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 13,
    alignItems: 'center',
  },

  closeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    writingDirection: 'rtl',
  },

  chevronWrap: {
    width: 16,
    height: 16,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  chevronLeft: {
    position: 'absolute',
    width: 2,
    height: 8,
    left: 5,
    transform: [{ rotate: '45deg' }],
    borderRadius: 2,
  },

  chevronRight: {
    position: 'absolute',
    width: 2,
    height: 8,
    right: 5,
    transform: [{ rotate: '-45deg' }],
    borderRadius: 2,
  },

  dotCheckWrap: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dotCheckStem: {
    position: 'absolute',
    width: 2,
    height: 7,
    transform: [{ rotate: '45deg' }],
    top: 7,
    left: 8,
    borderRadius: 2,
  },

  dotCheckArm: {
    position: 'absolute',
    width: 2,
    height: 10,
    transform: [{ rotate: '-45deg' }],
    top: 4,
    left: 11,
    borderRadius: 2,
  },

  resumeInfoBox: {
    minHeight: 44,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    marginBottom: 10,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  resumeInfoText: {
    fontSize: 13,
    marginRight: 10,
    textAlign: 'right',
    writingDirection: 'rtl',
    flex: 1,
  },

  backArrowIcon: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 26,
    includeFontPadding: false,
  },
});

export default JobApplicationScreen;