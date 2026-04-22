import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  TextInput,
  Image,
} from 'react-native';

const supportOptions = ['دعم حركي', 'دعم بصري', 'دعم سمعي', 'أدوات تقنية مساعدة'];
const accessibilityOptions = [
  'بيئة مهيأة حركياً (منحدرات / مصاعد)',
  'دعم بصري (تكبير خط / قارئ شاشة)',
  'ترجمة نصية أو لغة إشارة',
  'ساعات عمل مرنة',
  'أخرى',
];
const interviewOptions = ['مقابلة حضورية', 'مقابلة عن بعد', 'مترجم لغة إشارة'];
const challengeOptions = [
  'عدم وضوح جاهزية الشركة',
  'بيئة غير مهيأة',
  'إجراءات توظيف غير مرنة',
  'نقص فرص العمل',
];


const BackArrowIcon = ({ color = '#4B3F72' }) => (
  <Text style={[styles.backArrowIcon, { color }]}>{'‹'}</Text>
);

const SignUpJobSeekerStep2Screen = ({ navigation }) => {
  const [supports, setSupports] = useState([]);
  const [accessibility, setAccessibility] = useState([]);
  const [otherAccessibility, setOtherAccessibility] = useState('');
  const [interview, setInterview] = useState('مقابلة عن بعد');
  const [challenge, setChallenge] = useState('');

  const sanitizeText = (value) => {
    return value
      .replace(/[^\u0600-\u06FFa-zA-Z0-9\s]/g, '')
      .replace(/\s{2,}/g, ' ')
      .slice(0, 80);
  };

  const toggle = (setArr, val) => {
    setArr((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  const handleSubmit = () => {
    if (supports.length === 0) {
      Alert.alert('حقل مطلوب', 'يرجى اختيار نوع الدعم الذي تحتاجه');
      return;
    }

    if (accessibility.includes('أخرى')) {
      if (!otherAccessibility.trim()) {
        Alert.alert('حقل مطلوب', 'يرجى كتابة وسيلة الإتاحة الأخرى');
        return;
      }

      if (otherAccessibility.trim().length < 3) {
        Alert.alert('خطأ', 'يرجى إدخال وصف واضح لا يقل عن 3 أحرف');
        return;
      }
    }

    if (!interview) {
      Alert.alert('حقل مطلوب', 'يرجى اختيار تفضيل المقابلة');
      return;
    }

    if (!challenge) {
      Alert.alert('حقل مطلوب', 'يرجى اختيار أكبر تحدٍ تواجهه');
      return;
    }

    const payload = {
      supports,
      accessibility: accessibility.includes('أخرى')
        ? [
            ...accessibility.filter((item) => item !== 'أخرى'),
            otherAccessibility.trim(),
          ]
        : accessibility,
      interview,
      challenge,
    };

    console.log('SIGNUP_JOB_SEEKER_STEP2_PAYLOAD', payload);

    navigation.replace('JobSeekerTabNavigator');
  };

  const renderCheckboxGroup = (
    label,
    options,
    selected,
    setSelected,
    {
      required = false,
      showOtherInput = false,
      otherValue = '',
      setOtherValue = () => {},
    } = {}
  ) => (
    <View style={styles.card}>
      <Text style={styles.groupLabel}>
        {label} {required && <Text style={styles.requiredMark}>*</Text>}
      </Text>

      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={styles.optionRow}
          onPress={() => toggle(setSelected, opt)}
          activeOpacity={0.8}
        >
          <Text style={styles.optionText}>{opt}</Text>
          <View
            style={[
              styles.checkbox,
              selected.includes(opt) && styles.checkboxSelected,
            ]}
          >
            {selected.includes(opt) && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>
      ))}

      {showOtherInput && selected.includes('أخرى') && (
        <>
          <View style={styles.labelRow}>
            <Text style={styles.fieldLabel}>
              اكتب التفاصيل <Text style={styles.requiredMark}>*</Text>
            </Text>
          </View>
          <View style={styles.inputBox}>
            <TextInput
              value={otherValue}
              onChangeText={(v) => setOtherValue(sanitizeText(v))}
              placeholder="اكتب التفاصيل هنا"
              placeholderTextColor="#9A96B2"
              style={styles.input}
              textAlign="right"
              maxLength={80}
            />
          </View>
        </>
      )}
    </View>
  );

  const renderRadioGroup = (label, options, selected, onSelect, required = false) => (
    <View style={styles.card}>
      <Text style={styles.groupLabel}>
        {label} {required && <Text style={styles.requiredMark}>*</Text>}
      </Text>

      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={styles.optionRow}
          onPress={() => onSelect(opt)}
          activeOpacity={0.8}
        >
          <Text style={styles.optionText}>{opt}</Text>
          <View style={[styles.radio, selected === opt && styles.radioSelected]}>
            {selected === opt && <View style={styles.radioDot} />}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F1FA" />

      
      <View style={styles.progressBarWrap}>
        <View style={styles.progressTrack} />
        <View style={styles.progressFill} />
      </View>

      
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {}}
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

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHint}> </Text>
          <Text style={styles.sectionTitle}>إنشاء حساب باحث عن عمل</Text>
        </View>

        {renderCheckboxGroup(
          'ما نوع الدعم الذي تحتاجه؟ (اختيار متعدد)',
          supportOptions,
          supports,
          setSupports,
          { required: true }
        )}

        {renderCheckboxGroup(
          'هل تحتاج إلى أي من وسائل الإتاحة التالية في بيئة العمل؟',
          accessibilityOptions,
          accessibility,
          setAccessibility,
          {
            required: false,
            showOtherInput: true,
            otherValue: otherAccessibility,
            setOtherValue: setOtherAccessibility,
          }
        )}

        {renderRadioGroup(
          'في المقابلات الوظيفية، تفضل',
          interviewOptions,
          interview,
          setInterview,
          true
        )}

        {renderRadioGroup(
          'ما هو أكبر تحدي تواجهه عند التقديم على وظيفة؟',
          challengeOptions,
          challenge,
          setChallenge,
          true
        )}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>إنشاء الحساب</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

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
    width: '96%',
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
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  sectionHint: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6E6A8A',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  content: {
    paddingBottom: 40,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  groupLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4B3F72',
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 24,
    marginBottom: 14,
  },

  requiredMark: {
    color: '#D64545',
  },

  optionRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 12,
  },

  optionText: {
    flex: 1,
    fontSize: 14,
    color: '#1F1655',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginLeft: 12,
    lineHeight: 22,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CFC9E8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  checkboxSelected: {
    backgroundColor: '#36B487',
    borderColor: '#36B487',
  },

  checkmark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
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

  labelRow: {
    width: '100%',
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    marginTop: 4,
    marginBottom: 8,
  },

  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F1655',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  inputBox: {
    width: '100%',
    height: 54,
    backgroundColor: '#F2F2F2',
    borderRadius: 18,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 2,
  },

  input: {
    width: '100%',
    fontSize: 14,
    color: '#1F1655',
    paddingVertical: 0,
  },

  primaryButton: {
    backgroundColor: '#C7C4F0',
    borderRadius: 18,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    marginHorizontal: 20,
  },

  primaryButtonText: {
    color: '#1F1655',
    fontSize: 18,
    fontWeight: '800',
    writingDirection: 'rtl',
  },

  backArrowIcon: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 26,
    includeFontPadding: false,
  },
});

export default SignUpJobSeekerStep2Screen;