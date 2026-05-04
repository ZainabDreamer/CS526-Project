import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { db } from '../services/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const BackArrowIcon = ({ color = '#1F1655' }) => (
  <Text style={[styles.backArrowIcon, { color }]}>{'‹'}</Text>
);

const EditCompanyProfileScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { colors, darkMode } = useTheme();

  const [form, setForm] = useState({
    description: '',
    accessibilitySupport: '',
    workEnvironment: '',
    contactEmail: '',
    phone: '',
    inclusivityScore: '',
    hasMowaamah: '',
    city: '',
    district: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        description: user.description || '',
        accessibilitySupport: user.accessibilitySupport || '',
        workEnvironment: user.workEnvironment || '',
        contactEmail: user.contactEmail || user.email || '',
        phone: user.phone || '',
        inclusivityScore: String(user.inclusivityScore ?? ''),
        hasMowaamah: user.hasMowaamah || '',
        city: user.city || '',
        district: user.district || '',
      });
    }
  }, [user]);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const sanitizeScore = (value) => {
    const cleaned = value.replace(/[^0-9]/g, '').slice(0, 3);
    if (Number(cleaned) > 100) return '100';
    return cleaned;
  };

  const handleSave = async () => {
  const scoreNumber = Number(form.inclusivityScore || 0);

  if (Number.isNaN(scoreNumber) || scoreNumber < 0 || scoreNumber > 100) {
    Alert.alert('خطأ', 'نسبة الشمولية يجب أن تكون بين 0 و 100');
    return;
  }

  const uid = user?.uid || user?.id;

  if (!uid) {
    Alert.alert('خطأ', 'تعذر تحديد حساب المنظمة.');
    return;
  }

  try {
    await updateDoc(doc(db, 'users', uid), {
      description: form.description.trim(),
      accessibilitySupport: form.accessibilitySupport.trim(),
      workEnvironment: form.workEnvironment.trim(),
      contactEmail: form.contactEmail.trim().toLowerCase(),
      phone: form.phone.trim(),
      inclusivityScore: scoreNumber,
      hasMowaamah: form.hasMowaamah.trim(),
      city: form.city.trim(),
      district: form.district.trim(),
      updatedAt: serverTimestamp(),
    });

    Alert.alert('تم الحفظ', 'تم تحديث بيانات الشركة بنجاح.', [
      {
        text: 'حسنًا',
        onPress: () => navigation.goBack(),
      },
    ]);
  } catch (error) {
    console.log('UPDATE COMPANY PROFILE ERROR:', error);
    Alert.alert('خطأ', 'تعذر تحديث بيانات الشركة');
  }
};
  const palette = {
    pageBg: colors.background,
    cardBg: colors.card,
    text: colors.text,
    subText: colors.subText,
    primary: colors.primary,
    inputBg: darkMode ? '#2A273A' : '#F2F2F2',
    placeholder: darkMode ? '#A9A5BC' : '#9A96B2',
    headerBtnBg: colors.card,
  };

  const renderLabel = (label) => (
    <View style={styles.labelRow}>
      <Text style={[styles.fieldLabel, { color: palette.primary }]}>
        {label}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: palette.pageBg }]}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={palette.pageBg}
      />

      <View style={styles.headerRow}>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: palette.headerBtnBg }]}
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
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionHint, { color: palette.subText }]} />
          <Text style={[styles.sectionTitle, { color: palette.text }]}>
            تعديل بيانات الشركة
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: palette.cardBg }]}>
          <Text style={[styles.sectionCardTitle, { color: palette.primary }]}>
            معلومات الشركة
          </Text>

          {renderLabel('نبذة عن الشركة')}
          <View style={[styles.textAreaBox, { backgroundColor: palette.inputBg }]}>
            <TextInput
              value={form.description}
              onChangeText={(v) => update('description', v)}
              placeholder="اكتب نبذة مختصرة عن الشركة"
              placeholderTextColor={palette.placeholder}
              style={[styles.textArea, { color: palette.text }]}
              textAlign="right"
              multiline
            />
          </View>

          {renderLabel('دعم الإتاحة')}
          <View style={[styles.inputBox, { backgroundColor: palette.inputBg }]}>
            <TextInput
              value={form.accessibilitySupport}
              onChangeText={(v) => update('accessibilitySupport', v)}
              placeholder="مثال: منحدرات، مصاعد، قارئ شاشة"
              placeholderTextColor={palette.placeholder}
              style={[styles.input, { color: palette.text }]}
              textAlign="right"
            />
          </View>

          {renderLabel('بيئة العمل')}
          <View style={[styles.inputBox, { backgroundColor: palette.inputBg }]}>
            <TextInput
              value={form.workEnvironment}
              onChangeText={(v) => update('workEnvironment', v)}
              placeholder="مثال: مرنة، مهيأة، داعمة"
              placeholderTextColor={palette.placeholder}
              style={[styles.input, { color: palette.text }]}
              textAlign="right"
            />
          </View>

          {renderLabel('البريد الرسمي')}
          <View style={[styles.inputBox, { backgroundColor: palette.inputBg }]}>
            <TextInput
              value={form.contactEmail}
              onChangeText={(v) => update('contactEmail', v.replace(/\s/g, ''))}
              placeholder="example@company.com"
              placeholderTextColor={palette.placeholder}
              style={[styles.input, { color: palette.text }]}
              textAlign="right"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {renderLabel('رقم التواصل')}
          <View style={[styles.inputBox, { backgroundColor: palette.inputBg }]}>
            <TextInput
              value={form.phone}
              onChangeText={(v) => update('phone', v.replace(/[^0-9]/g, '').slice(0, 10))}
              placeholder="05XXXXXXXX"
              placeholderTextColor={palette.placeholder}
              style={[styles.input, { color: palette.text }]}
              textAlign="right"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: palette.cardBg }]}>
          <Text style={[styles.sectionCardTitle, { color: palette.primary }]}>
            الشمولية والموقع
          </Text>

          {renderLabel('نسبة الشمولية')}
          <View style={[styles.inputBox, { backgroundColor: palette.inputBg }]}>
            <TextInput
              value={form.inclusivityScore}
              onChangeText={(v) => update('inclusivityScore', sanitizeScore(v))}
              placeholder="مثال: 86"
              placeholderTextColor={palette.placeholder}
              style={[styles.input, { color: palette.text }]}
              textAlign="right"
              keyboardType="numeric"
              maxLength={3}
            />
          </View>

          {renderLabel('حالة شهادة المواءمة')}
          <View style={[styles.inputBox, { backgroundColor: palette.inputBg }]}>
            <TextInput
              value={form.hasMowaamah}
              onChangeText={(v) => update('hasMowaamah', v)}
              placeholder="نعم / لا / قيد الإجراء"
              placeholderTextColor={palette.placeholder}
              style={[styles.input, { color: palette.text }]}
              textAlign="right"
            />
          </View>

          {renderLabel('المدينة')}
          <View style={[styles.inputBox, { backgroundColor: palette.inputBg }]}>
            <TextInput
              value={form.city}
              onChangeText={(v) => update('city', v)}
              placeholder="مثال: الدمام"
              placeholderTextColor={palette.placeholder}
              style={[styles.input, { color: palette.text }]}
              textAlign="right"
            />
          </View>

          {renderLabel('الحي')}
          <View style={[styles.inputBox, { backgroundColor: palette.inputBg }]}>
            <TextInput
              value={form.district}
              onChangeText={(v) => update('district', v)}
              placeholder="مثال: الشاطئ"
              placeholderTextColor={palette.placeholder}
              style={[styles.input, { color: palette.text }]}
              textAlign="right"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>حفظ التحديثات</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

export default EditCompanyProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 52,
    marginBottom: 14,
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
    paddingBottom: 40,
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
    textAlign: 'right',
    writingDirection: 'rtl',
    paddingHorizontal: 10,
  },

  sectionHint: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  card: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  sectionCardTitle: {
    fontSize: 17,
    fontWeight: '800',
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
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  inputBox: {
    width: '100%',
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 14,
  },

  textAreaBox: {
    width: '100%',
    minHeight: 110,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 14,
  },

  input: {
    width: '100%',
    fontSize: 14,
    paddingVertical: 0,
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  textArea: {
    width: '100%',
    fontSize: 14,
    lineHeight: 23,
    textAlign: 'right',
    writingDirection: 'rtl',
    minHeight: 80,
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

  backArrowIcon: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 26,
    includeFontPadding: false,
  },
});