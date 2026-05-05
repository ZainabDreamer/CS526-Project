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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SCREEN_NAMES } from '../constants/labels';
//SECTOR_SIZE_OPTIONS
const SECTOR_SIZE_OPTIONS = [
  'صغيرة',
  'متوسطة',
  'كبيرة',
  'أخرى',
];
//ORG_SECTOR_OPTIONS
const ORG_SECTOR_OPTIONS = [
  'حكومي',
  'خاص',
  'غير ربحي',
  'تعليمي',
  'صحي',
  'تقني',
  'أخرى',
];

//BackArrowIcon
const BackArrowIcon = ({ color = '#4B3F72' }) => (
  <Text style={[styles.backArrowIcon, { color }]}>{'‹'}</Text>
);
//SelectArrowIcon
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
//SignUpOrganizationScreen
const SignUpOrganizationScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    representativeName: '',
    username: '',
    phone: '',
    orgName: '',
    sectorSize: '',
    customSectorSize: '',
    orgSector: '',
    customOrgSector: '',
  });
//sectorSizeModalVisible
  const [sectorSizeModalVisible, setSectorSizeModalVisible] = useState(false);
  const [orgSectorModalVisible, setOrgSectorModalVisible] = useState(false);

  const sanitizeArabicEnglishText = (value) => {
    return value
      .replace(/[^\u0600-\u06FFa-zA-Z0-9\s]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trimStart();
  };
//sanitizeName
  const sanitizeName = (value) => {
    return value
      .replace(/[^\u0600-\u06FFa-zA-Z\s]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trimStart()
      .slice(0, 60);
  };
//sanitizeUsername
  const sanitizeUsername = (value) => {
    return value
      .replace(/[^a-zA-Z0-9_.]/g, '')
      .slice(0, 25);
  };
//sanitizePhone
  const sanitizePhone = (value) => {
    return value.replace(/[^0-9]/g, '').slice(0, 10);
  };
//sanitizeOrgName
  const sanitizeOrgName = (value) => {
    return value
      .replace(/[^\u0600-\u06FFa-zA-Z0-9\s]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trimStart()
      .slice(0, 80);
  };
//update
  const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));
//validateStep1
  const validateStep1 = () => {
    const missing = [];

    if (!form.representativeName.trim()) {
      missing.push('الاسم الثلاثي لممثل المنظمة / المؤسس');
    }
    if (!form.username.trim()) {
      missing.push('اسم المستخدم');
    }
    if (!form.phone.trim()) {
      missing.push('رقم الجوال');
    }
    if (!form.orgName.trim()) {
      missing.push('اسم المنظمة');
    }
    if (!form.orgSector.trim()) {
      missing.push('قطاع المنظمة');
    }
    if (form.orgSector === 'أخرى' && !form.customOrgSector.trim()) {
      missing.push('قطاع المنظمة الآخر');
    }

    if (missing.length > 0) {
      Alert.alert(
        'حقول مطلوبة',
        `يرجى تعبئة الحقول التالية:\n- ${missing.join('\n- ')}`
      );
      return false;
    }

    if (form.representativeName.trim().length < 6) {
      Alert.alert('خطأ', 'يرجى إدخال اسم صحيح لممثل المنظمة لا يقل عن 6 أحرف');
      return false;
    }

    if (form.username.length < 4) {
      Alert.alert('خطأ', 'اسم المستخدم يجب أن يكون 4 أحرف على الأقل');
      return false;
    }

    if (!/^[a-zA-Z0-9_.]+$/.test(form.username)) {
      Alert.alert('خطأ', 'اسم المستخدم يقبل الإنجليزية والأرقام و _ . فقط');
      return false;
    }

    if (!/^05\d{8}$/.test(form.phone)) {
      Alert.alert('خطأ', 'رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام');
      return false;
    }

    if (form.orgName.trim().length < 3) {
      Alert.alert('خطأ', 'اسم المنظمة غير صالح');
      return false;
    }

    if (form.orgSector === 'أخرى' && form.customOrgSector.trim().length < 2) {
      Alert.alert('خطأ', 'يرجى كتابة قطاع منظمة صحيح');
      return false;
    }

    return true;
  };
//handleNext
  const handleNext = () => {
  if (!validateStep1()) return;

  const finalSectorSize =
    form.sectorSize === 'أخرى'
      ? form.customSectorSize.trim()
      : form.sectorSize.trim();

  const finalOrgSector =
    form.orgSector === 'أخرى'
      ? form.customOrgSector.trim()
      : form.orgSector.trim();

  const payload = {
    role: 'organization',
    representativeName: form.representativeName.trim(),
    username: form.username.trim().toLowerCase(),
    phone: form.phone.trim(),
    orgName: form.orgName.trim(),
    name: form.orgName.trim(),
    orgSector: finalOrgSector,
    step1CompletedAt: new Date().toISOString(),

    ...(finalSectorSize ? { sectorSize: finalSectorSize } : {}),

    ...(form.sectorSize === 'أخرى' && form.customSectorSize.trim()
      ? { customSectorSize: form.customSectorSize.trim() }
      : {}),

    ...(form.orgSector === 'أخرى' && form.customOrgSector.trim()
      ? { customOrgSector: form.customOrgSector.trim() }
      : {}),
  };

  navigation.navigate(SCREEN_NAMES.SIGNUP_ORGANIZATION_STEP2, {
    form: payload,
  });
};
      

  const renderRequiredLabel = (text) => (
    <Text style={styles.fieldLabel}>
      {text} <Text style={styles.requiredMark}>*</Text>
    </Text>
  );
//renderOptionalLabel
  const renderOptionalLabel = (text) => (
    <Text style={styles.fieldLabel}>
      {text} <Text style={styles.optionalText}>(اختياري)</Text>
    </Text>
  );

  return (
  <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    keyboardVerticalOffset={10}
  > 
      <StatusBar barStyle="dark-content" backgroundColor="#F3F1FA" />

      <SelectionModal
        visible={sectorSizeModalVisible}
        title="اختر حجم القطاع"
        options={SECTOR_SIZE_OPTIONS}
        selectedValue={form.sectorSize}
        onSelect={(value) => update('sectorSize', value)}
        onClose={() => setSectorSizeModalVisible(false)}
      />

      <SelectionModal
        visible={orgSectorModalVisible}
        title="اختر قطاع المنظمة"
        options={ORG_SECTOR_OPTIONS}
        selectedValue={form.orgSector}
        onSelect={(value) => update('orgSector', value)}
        onClose={() => setOrgSectorModalVisible(false)}
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
  keyboardShouldPersistTaps="handled"
>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHint}> </Text>
          <Text style={styles.sectionTitle}>إنشاء حساب جهة</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionCardTitle}>معلومات شخصية</Text>

          <View style={styles.labelRow}>
            {renderRequiredLabel('الاسم الثلاثي لممثل المنظمة / المؤسس')}
          </View>
          <View style={styles.inputBox}>
            <TextInput
              value={form.representativeName}
              onChangeText={(v) => update('representativeName', sanitizeName(v))}
              placeholder="أدخل الاسم الكامل"
              placeholderTextColor="#9A96B2"
              style={styles.input}
              textAlign="right"
              maxLength={60}
            />
          </View>

          <View style={styles.labelRow}>
            {renderRequiredLabel('اسم المستخدم')}
          </View>
          <View style={styles.inputBox}>
            <TextInput
              value={form.username}
              onChangeText={(v) => update('username', sanitizeUsername(v))}
              placeholder="أدخل اسم المستخدم"
              placeholderTextColor="#9A96B2"
              style={styles.input}
              textAlign="right"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={25}
            />
          </View>

          <View style={styles.labelRow}>
            {renderRequiredLabel('رقم الجوال')}
          </View>
          <View style={styles.inputBox}>
            <TextInput
              value={form.phone}
              onChangeText={(v) => update('phone', sanitizePhone(v))}
              keyboardType="phone-pad"
              placeholder="05XXXXXXXX"
              placeholderTextColor="#9A96B2"
              style={styles.input}
              textAlign="right"
              maxLength={10}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionCardTitle}>معلومات المنظمة</Text>

          <View style={styles.labelRow}>
            {renderRequiredLabel('اسم المنظمة')}
          </View>
          <View style={styles.inputBox}>
            <TextInput
              value={form.orgName}
              onChangeText={(v) => update('orgName', sanitizeOrgName(v))}
              placeholder="أدخل اسم المنظمة"
              placeholderTextColor="#9A96B2"
              style={styles.input}
              textAlign="right"
              maxLength={80}
            />
          </View>

          <View style={styles.labelRow}>
            {renderOptionalLabel('حجم القطاع')}
          </View>
          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => setSectorSizeModalVisible(true)}
            activeOpacity={0.8}
          >
            <SelectArrowIcon />
            <Text
              style={[
                styles.selectText,
                !form.sectorSize && styles.placeholderText,
              ]}
            >
              {form.sectorSize || 'اضغط لاختيار حجم القطاع'}
            </Text>
          </TouchableOpacity>

          {form.sectorSize === 'أخرى' && (
            <>
              <View style={styles.labelRow}>
                {renderOptionalLabel('اكتب حجم القطاع')}
              </View>
              <View style={styles.inputBox}>
                <TextInput
                  value={form.customSectorSize}
                  onChangeText={(v) =>
                    update('customSectorSize', sanitizeArabicEnglishText(v).slice(0, 40))
                  }
                  placeholder="اكتب حجم القطاع"
                  placeholderTextColor="#9A96B2"
                  style={styles.input}
                  textAlign="right"
                  maxLength={40}
                />
              </View>
            </>
          )}

          <View style={styles.labelRow}>
            {renderRequiredLabel('قطاع المنظمة')}
          </View>
          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => setOrgSectorModalVisible(true)}
            activeOpacity={0.8}
          >
            <SelectArrowIcon />
            <Text
              style={[
                styles.selectText,
                !form.orgSector && styles.placeholderText,
              ]}
            >
              {form.orgSector || 'اضغط لاختيار قطاع المنظمة'}
            </Text>
          </TouchableOpacity>

          {form.orgSector === 'أخرى' && (
            <>
              <View style={styles.labelRow}>
                {renderRequiredLabel('اكتب قطاع المنظمة')}
              </View>
              <View style={styles.inputBox}>
                <TextInput
                  value={form.customOrgSector}
                  onChangeText={(v) =>
                    update('customOrgSector', sanitizeArabicEnglishText(v).slice(0, 40))
                  }
                  placeholder="اكتب قطاع المنظمة"
                  placeholderTextColor="#9A96B2"
                  style={styles.input}
                  textAlign="right"
                  maxLength={40}
                />
              </View>
            </>
          )}
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleNext}
          activeOpacity={0.85}
        >
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
    marginBottom: 16,
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

export default SignUpOrganizationScreen;
