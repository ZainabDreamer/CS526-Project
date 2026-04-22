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
  Modal,
  Image,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { SCREEN_NAMES } from '../constants/labels';

const CITIES = ['الدمام', 'الخبر', 'الظهران', 'الجبيل', 'الأحساء', 'أخرى'];

const DISTRICTS = {
  الدمام: ['الشاطئ', 'الفيصلية', 'النخيل', 'أخرى'],
  الخبر: ['العقربية', 'الثقبة', 'الحزام الذهبي', 'أخرى'],
  الظهران: ['الدوحة', 'القصور', 'أخرى'],
  الجبيل: ['الفناتير', 'الحويلات', 'أخرى'],
  الأحساء: ['الهفوف', 'المبرز', 'أخرى'],
  أخرى: ['أخرى'],
};

const MOWAAMAH_OPTIONS = ['نعم', 'لا', 'قيد الإجراء'];


const BackArrowIcon = ({ color = '#4B3F72' }) => (
  <Text style={[styles.backArrowIcon, { color }]}>{'‹'}</Text>
);

const SelectArrowIcon = ({ color = '#8A86A3' }) => (
  <Text style={[styles.selectArrowIcon, { color }]}>{'‹'}</Text>
);

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

          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map((item) => {
              const isSelected = selectedValue === item;
              return (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.modalOption,
                    isSelected && styles.modalOptionSelected,
                  ]}
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

          <TouchableOpacity
            style={styles.modalCloseBtn}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Text style={styles.modalCloseText}>إغلاق</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const SignUpOrganizationStep2Screen = ({ navigation }) => {
  const [hasMowaamah, setHasMowaamah] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [city, setCity] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [district, setDistrict] = useState('');
  const [customDistrict, setCustomDistrict] = useState('');
  const [password, setPassword] = useState('');

  const [mowaamahModalVisible, setMowaamahModalVisible] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [districtModalVisible, setDistrictModalVisible] = useState(false);

  const currentDistricts = city ? (DISTRICTS[city] || ['أخرى']) : [];

  const sanitizeArabicEnglishText = (value) => {
    return value
      .replace(/[^\u0600-\u06FFa-zA-Z0-9\s]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trimStart();
  };

  const sanitizePassword = (value) => {
    return value.replace(/\s/g, '').slice(0, 30);
  };

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets?.[0];
      if (file) {
        setUploadedFile(file);
      }
    } catch (error) {
      Alert.alert('خطأ', 'تعذر اختيار الملف');
    }
  };

  const handleSelectCity = (value) => {
    setCity(value);
    setDistrict('');
    setCustomDistrict('');
  };

  const handleSubmit = () => {
    const missing = [];

    if (!hasMowaamah.trim()) missing.push('حالة شهادة المواءمة');
    if (!city.trim()) missing.push('المدينة');
    if (city === 'أخرى' && !customCity.trim()) missing.push('اسم المدينة');
    if (!password.trim()) missing.push('كلمة المرور');

    if (district === 'أخرى' && !customDistrict.trim()) {
      missing.push('اسم الحي');
    }

    const certificateRequired =
      hasMowaamah === 'نعم' || hasMowaamah === 'قيد الإجراء';

    if (certificateRequired && !uploadedFile) {
      missing.push('رفع شهادة المواءمة');
    }

    if (missing.length > 0) {
      Alert.alert(
        'حقول مطلوبة',
        `يرجى تعبئة الحقول التالية:\n- ${missing.join('\n- ')}`
      );
      return;
    }

    const finalCity = city === 'أخرى' ? customCity.trim() : city;
    const finalDistrict = district === 'أخرى' ? customDistrict.trim() : district;

    if (finalCity.length < 2) {
      Alert.alert('خطأ', 'يرجى إدخال اسم مدينة صحيح');
      return;
    }

    if (district === 'أخرى' && finalDistrict.length < 2) {
      Alert.alert('خطأ', 'يرجى إدخال اسم حي صحيح');
      return;
    }

    if (password.length < 8) {
      Alert.alert('خطأ', 'كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }

    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      Alert.alert('خطأ', 'كلمة المرور يجب أن تحتوي على أحرف إنجليزية وأرقام');
      return;
    }

    const payload = {
      hasMowaamah,
      uploadedFile,
      city: finalCity,
      district: finalDistrict || '',
      password,
    };

    console.log('SIGNUP_ORGANIZATION_STEP2_PAYLOAD', payload);

    navigation.replace('OrgTabNavigator');
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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F1FA" />

      <SelectionModal
        visible={mowaamahModalVisible}
        title="حالة شهادة المواءمة"
        options={MOWAAMAH_OPTIONS}
        selectedValue={hasMowaamah}
        onSelect={setHasMowaamah}
        onClose={() => setMowaamahModalVisible(false)}
      />

      <SelectionModal
        visible={cityModalVisible}
        title="اختر المدينة"
        options={CITIES}
        selectedValue={city}
        onSelect={handleSelectCity}
        onClose={() => setCityModalVisible(false)}
      />

      <SelectionModal
        visible={districtModalVisible}
        title="اختر الحي"
        options={currentDistricts}
        selectedValue={district}
        onSelect={setDistrict}
        onClose={() => setDistrictModalVisible(false)}
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

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHint}> </Text>
          <Text style={styles.sectionTitle}>إنشاء حساب جهة</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionCardTitle}>بيانات إضافية</Text>

          <View style={styles.labelRow}>
            {renderRequiredLabel('هل المنظمة حاصلة على شهادة المواءمة ؟')}
          </View>
          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => setMowaamahModalVisible(true)}
            activeOpacity={0.8}
          >
            <SelectArrowIcon />
            <Text style={[styles.selectText, !hasMowaamah && styles.placeholderText]}>
              {hasMowaamah || 'اضغط لاختيار الحالة'}
            </Text>
          </TouchableOpacity>

          <View style={styles.labelRow}>
            {hasMowaamah === 'نعم' || hasMowaamah === 'قيد الإجراء'
              ? renderRequiredLabel('رفع شهادة المواءمة')
              : renderOptionalLabel('رفع الملف')}
          </View>
          <TouchableOpacity
            style={[
              styles.uploadBtn,
              uploadedFile && styles.uploadedBox,
            ]}
            onPress={handlePickFile}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.uploadText,
                uploadedFile && styles.uploadedText,
              ]}
              numberOfLines={1}
            >
              {uploadedFile ? uploadedFile.name : 'اضغط لرفع الملف'}
            </Text>
          </TouchableOpacity>

          <View style={styles.labelRow}>
            {renderRequiredLabel('المدينة')}
          </View>
          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => setCityModalVisible(true)}
            activeOpacity={0.8}
          >
            <SelectArrowIcon />
            <Text style={[styles.selectText, !city && styles.placeholderText]}>
              {city || 'اضغط لاختيار المدينة'}
            </Text>
          </TouchableOpacity>

          {city === 'أخرى' && (
            <>
              <View style={styles.labelRow}>
                {renderRequiredLabel('اكتب اسم المدينة')}
              </View>
              <View style={styles.inputBox}>
                <TextInput
                  value={customCity}
                  onChangeText={(v) =>
                    setCustomCity(sanitizeArabicEnglishText(v).slice(0, 40))
                  }
                  placeholder="اكتب المدينة"
                  placeholderTextColor="#9A96B2"
                  style={styles.input}
                  textAlign="right"
                  maxLength={40}
                />
              </View>
            </>
          )}

          <View style={styles.labelRow}>
            {renderOptionalLabel('الحي')}
          </View>
          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => {
              if (!city) {
                Alert.alert('تنبيه', 'يرجى اختيار المدينة أولاً');
                return;
              }
              setDistrictModalVisible(true);
            }}
            activeOpacity={0.8}
          >
            <SelectArrowIcon />
            <Text style={[styles.selectText, !district && styles.placeholderText]}>
              {district || 'اضغط لاختيار الحي'}
            </Text>
          </TouchableOpacity>

          {district === 'أخرى' && (
            <>
              <View style={styles.labelRow}>
                {renderOptionalLabel('اكتب اسم الحي')}
              </View>
              <View style={styles.inputBox}>
                <TextInput
                  value={customDistrict}
                  onChangeText={(v) =>
                    setCustomDistrict(sanitizeArabicEnglishText(v).slice(0, 40))
                  }
                  placeholder="اكتب الحي"
                  placeholderTextColor="#9A96B2"
                  style={styles.input}
                  textAlign="right"
                  maxLength={40}
                />
              </View>
            </>
          )}

          <View style={styles.labelRow}>
            {renderRequiredLabel('كلمة المرور')}
          </View>
          <View style={styles.inputBox}>
            <TextInput
              value={password}
              onChangeText={(v) => setPassword(sanitizePassword(v))}
              secureTextEntry
              placeholder="أدخل كلمة المرور"
              placeholderTextColor="#9A96B2"
              style={styles.input}
              textAlign="right"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={30}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>إنشاء حساب للمنظمة</Text>
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
    marginBottom: 14,
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

  uploadBtn: {
    width: '100%',
    height: 54,
    backgroundColor: '#F2F2F2',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 14,
  },

  uploadedBox: {
    backgroundColor: '#E8F7F1',
    borderWidth: 1,
    borderColor: '#36B487',
  },

  uploadText: {
    fontSize: 14,
    color: '#6E6A8A',
    textAlign: 'right',
    writingDirection: 'rtl',
    width: '100%',
  },

  uploadedText: {
    color: '#36B487',
    fontWeight: '700',
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

export default SignUpOrganizationStep2Screen;