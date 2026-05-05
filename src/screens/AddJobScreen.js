import React, { useContext, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { SCREEN_NAMES } from '../constants/labels';
import { AuthContext } from '../context/AuthContext';
import { db } from '../services/firebase';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

const ORG_TABS = [
  { key: 'dashboard', label: 'الشمولية' },
  { key: 'evaluations', label: 'التقييمات' },
  { key: 'interviews', label: 'المقابلات' },
  { key: 'orgJobs', label: 'فُرصي' },
];

const BellIcon = ({ color = '#1F1655' }) => (
  <View style={styles.bellShapeWrap}>
    <View style={[styles.bellTop, { backgroundColor: color }]} />
    <View style={[styles.bellBody, { backgroundColor: color }]} />
    <View style={[styles.bellClapper, { backgroundColor: color }]} />
  </View>
);

const UserAvatarIcon = ({ color = '#1F1655' }) => (
  <View style={styles.avatarMiniWrap}>
    <View style={[styles.avatarMiniHead, { backgroundColor: color }]} />
    <View style={[styles.avatarMiniBody, { backgroundColor: color }]} />
  </View>
);

const SearchIcon = ({ color = '#8F8B9E' }) => (
  <View style={styles.searchIconWrap}>
    <View style={[styles.searchCircle, { borderColor: color }]} />
    <View style={[styles.searchHandle, { backgroundColor: color }]} />
  </View>
);

const FilterIcon = ({ color = '#8F8B9E' }) => (
  <View style={styles.filterWrap}>
    <View style={[styles.filterTop, { backgroundColor: color }]} />
    <View style={[styles.filterStem, { backgroundColor: color }]} />
  </View>
);

const BriefcaseIcon = ({ color = '#FFFFFF' }) => (
  <View style={styles.briefcaseWrap}>
    <View style={[styles.briefcaseHandle, { borderColor: color }]} />
    <View style={[styles.briefcaseBody, { borderColor: color }]} />
    <View style={[styles.briefcaseLine, { backgroundColor: color }]} />
  </View>
);

const Field = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  maxLength,
  palette,
}) => (
  <View style={styles.fieldBlock}>
    <Text style={[styles.fieldLabel, { color: palette.text }]}>{label}</Text>

    <View
      style={[
        styles.inputShell,
        {
          backgroundColor: palette.cardBg,
          borderColor: palette.border,
          minHeight: multiline ? 110 : 54,
        },
      ]}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={palette.inputPlaceholder}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlign="right"
        style={[
          styles.input,
          {
            color: palette.text,
            height: multiline ? 90 : 22,
            textAlignVertical: multiline ? 'top' : 'center',
          },
        ]}
        maxLength={maxLength}
      />
    </View>
  </View>
);

const AddJobScreen = ({ navigation, route }) => {
  const { colors, darkMode } = useTheme();
  const { user } = useContext(AuthContext);

  const editMode = route?.params?.mode === 'edit';
  const editingJob = route?.params?.job || null;

  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    title: editingJob?.title || '',
    description: editingJob?.description || '',
    qualifications:
      editingJob?.qualifications ||
      editingJob?.qualificationsList?.join('\n') ||
      '',
    workEnv: editingJob?.workEnv || '',
    dailyHours: editingJob?.dailyHours ? String(editingJob.dailyHours) : '',
    vacancies: editingJob?.vacancies ? String(editingJob.vacancies) : '',
    benefits:
      editingJob?.benefits ||
      editingJob?.benefitsList?.join('\n') ||
      '',
    notes: editingJob?.notes || '',
    location: editingJob?.location || null,
  });

  const palette = useMemo(
    () => ({
      pageBg: colors.background,
      cardBg: colors.card,
      text: colors.text,
      subText: colors.subText,
      primary: '#4B3F72',
      iconColor: darkMode ? '#F5F3FB' : '#1F1655',
      searchIcon: darkMode ? '#B7B2C9' : '#8F8B9E',
      inputPlaceholder: darkMode ? '#A9A5BC' : '#AAA6BE',
      border: darkMode ? '#39344E' : '#ECE7F7',
      softBg: darkMode ? '#262334' : '#F8F6FC',
      tabBg: colors.card,
      activeTabBg: '#4B3F72',
      activeTabText: '#FFFFFF',
      avatarBg: darkMode ? '#2A273A' : '#F0EEF7',
      heroStart: '#4B3F72',
      heroEnd: '#40357E',
      helperBg: darkMode ? '#2A273A' : '#F5F3FB',
      helperBorder: darkMode ? '#3A3650' : '#EEEAF8',
    }),
    [colors, darkMode]
  );

  const update = (key, val) => {
    if (key === 'dailyHours' || key === 'vacancies') {
      const cleaned = val.replace(/[^0-9]/g, '');
      setForm((prev) => ({ ...prev, [key]: cleaned }));
      return;
    }

    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const handleTab = (key) => {
    if (key === 'dashboard') {
      navigation.navigate(SCREEN_NAMES.ORG_DASHBOARD);
      return;
    }

    if (key === 'evaluations') {
      navigation.navigate(SCREEN_NAMES.ACCESSIBILITY_ISSUES);
      return;
    }

    if (key === 'interviews') {
      navigation.navigate(SCREEN_NAMES.APPLICANTS_LIST);
      return;
    }

    if (key === 'orgJobs') {
      navigation.navigate(SCREEN_NAMES.ORG_JOBS);
    }
  };

  const validateAndSubmit = async () => {
    const missing = [];

    if (!form.title.trim()) missing.push('المسمى الوظيفي');
    if (!form.description.trim()) missing.push('الوصف الوظيفي');
    if (!form.qualifications.trim()) missing.push('المؤهلات المطلوبة');
    if (!form.workEnv.trim()) missing.push('بيئة العمل');
    if (!form.dailyHours.trim()) missing.push('ساعات العمل اليومية');
    if (!form.vacancies.trim()) missing.push('عدد الشواغر');

    if (missing.length > 0) {
      Alert.alert(
        'حقول مطلوبة',
        `يرجى تعبئة الحقول التالية:\n- ${missing.join('\n- ')}`
      );
      return;
    }

    const payload = {
      orgId: user?.uid || user?.id || null,
      orgName: user?.orgName || user?.name || 'منظمة',
      company: user?.orgName || user?.name || 'منظمة',

      title: form.title.trim(),
      description: form.description.trim(),

      qualifications: form.qualifications.trim(),
      qualificationsList: form.qualifications
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),

      workEnv: form.workEnv.trim(),
      dailyHours: Number(form.dailyHours),
      vacancies: Number(form.vacancies),

      benefits: form.benefits.trim(),
      benefitsList: form.benefits
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),

      notes: form.notes.trim(),

      location: form.location || null,
      latitude: form.location?.latitude || null,
      longitude: form.location?.longitude || null,

      inclusivityScore: Number(user?.inclusivityScore || 0),

      status: 'active',
    };

    try {
      if (editMode && editingJob?.id) {
        await updateDoc(doc(db, 'jobs', editingJob.id), {
          ...payload,
          updatedAt: serverTimestamp(),
        });

        Alert.alert('تم', 'تم تعديل الفرصة الوظيفية بنجاح');
        navigation.navigate(SCREEN_NAMES.ORG_JOBS);
      } else {
        await addDoc(collection(db, 'jobs'), {
          ...payload,
          createdAt: serverTimestamp(),
        });

        Alert.alert('تم', 'تمت إضافة الفرصة الوظيفية بنجاح');
        navigation.navigate(SCREEN_NAMES.ORG_JOBS);
      }
    } catch (error) {
      console.log('SAVE JOB ERROR:', error);
      Alert.alert('خطأ', 'تعذر حفظ الفرصة الوظيفية. يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.pageBg }]}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={palette.pageBg}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: palette.cardBg }]}
            onPress={() => navigation.navigate(SCREEN_NAMES.PROFILE)}
            activeOpacity={0.85}
          >
            <UserAvatarIcon color={palette.iconColor} />
          </TouchableOpacity>

          <Image
            source={require('../../assets/logo2.png')}
            style={styles.topLogo}
            resizeMode="contain"
          />

          <TouchableOpacity
            onPress={() => navigation.navigate(SCREEN_NAMES.NOTIFICATIONS)}
            activeOpacity={0.85}
          >
            <BellIcon color={palette.iconColor} />
          </TouchableOpacity>
        </View>

        <View style={styles.welcomeBlock}>
          <Text style={[styles.welcomeHint, { color: palette.subText }]}>
            إدارة الفرص الوظيفية
          </Text>
        </View>

        <View style={[styles.searchBar, { backgroundColor: palette.cardBg }]}>
          <View style={styles.searchRightIcon}>
            <SearchIcon color={palette.searchIcon} />
          </View>

          <TextInput
            style={[styles.searchInput, { color: palette.text }]}
            placeholder="ابحث..."
            placeholderTextColor={palette.inputPlaceholder}
            value={search}
            onChangeText={setSearch}
            textAlign="right"
          />

          <View style={styles.searchLeftIcon}>
            <FilterIcon color={palette.searchIcon} />
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <View style={styles.tabsRow}>
            {ORG_TABS.map((tab) => {
              const isActive = tab.key === 'orgJobs';

              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[
                    styles.tabButton,
                    { backgroundColor: palette.tabBg },
                    isActive && { backgroundColor: palette.activeTabBg },
                  ]}
                  onPress={() => handleTab(tab.key)}
                  activeOpacity={0.88}
                >
                  <Text
                    style={[
                      styles.tabText,
                      { color: isActive ? palette.activeTabText : palette.text },
                    ]}
                    numberOfLines={1}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={[styles.heroCard, { backgroundColor: palette.primary }]}>
          <View style={styles.heroContent}>
            <View style={styles.heroIconBox}>
              <BriefcaseIcon />
            </View>

            <View style={styles.heroTextBlock}>
              <Text style={styles.heroTitle}>
                {editMode ? 'تعديل الفرصة الوظيفية' : 'إضافة فرصة وظيفية جديدة'}
              </Text>

              <Text style={styles.heroSubTitle}>
                {editMode
                  ? 'عدّلي بيانات الفرصة الوظيفية ثم احفظي التغييرات.'
                  : 'اكتب تفاصيل الوظيفة بشكل واضح ومنظم لرفع جودة التقديم وتحسين الوصول للمرشحين المناسبين.'}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.helperCard,
            {
              backgroundColor: palette.helperBg,
              borderColor: palette.helperBorder,
            },
          ]}
        >
          <Text style={[styles.helperTitle, { color: palette.primary }]}>
            تلميح
          </Text>

          <Text style={[styles.helperText, { color: palette.subText }]}>
            يفضّل كتابة وصف واضح، مؤهلات دقيقة، وعدد الشواغر الفعلي حتى تكون الفرصة أكثر احترافية وأسهل للفهم.
          </Text>
        </View>

        <View style={[styles.formCard, { backgroundColor: palette.cardBg }]}>
          <Field
            label="المسمى الوظيفي"
            value={form.title}
            onChangeText={(v) => update('title', v)}
            placeholder="مثال: مسؤول خدمة عملاء"
            maxLength={80}
            palette={palette}
          />

          <Field
            label="الوصف الوظيفي"
            value={form.description}
            onChangeText={(v) => update('description', v)}
            placeholder="اكتب وصفًا واضحًا للمهام والمسؤوليات"
            multiline
            numberOfLines={4}
            maxLength={500}
            palette={palette}
          />

          <Field
            label="المؤهلات المطلوبة"
            value={form.qualifications}
            onChangeText={(v) => update('qualifications', v)}
            placeholder="اكتب المؤهلات والخبرات المطلوبة"
            multiline
            numberOfLines={4}
            maxLength={400}
            palette={palette}
          />

          <Field
            label="بيئة العمل"
            value={form.workEnv}
            onChangeText={(v) => update('workEnv', v)}
            placeholder="مثال: مكتبية / ميدانية / هجينة"
            maxLength={100}
            palette={palette}
          />

          <View style={styles.rowFields}>
            <View style={styles.halfField}>
              <Field
                label="ساعات العمل اليومية"
                value={form.dailyHours}
                onChangeText={(v) => update('dailyHours', v)}
                placeholder="8"
                keyboardType="numeric"
                maxLength={2}
                palette={palette}
              />
            </View>

            <View style={styles.halfField}>
              <Field
                label="عدد الشواغر"
                value={form.vacancies}
                onChangeText={(v) => update('vacancies', v)}
                placeholder="3"
                keyboardType="numeric"
                maxLength={3}
                palette={palette}
              />
            </View>
          </View>

          <Field
            label="المميزات"
            value={form.benefits}
            onChangeText={(v) => update('benefits', v)}
            placeholder="مثال: تأمين طبي، تدريب، مرونة"
            multiline
            numberOfLines={3}
            maxLength={300}
            palette={palette}
          />

          <Field
            label="ملاحظات"
            value={form.notes}
            onChangeText={(v) => update('notes', v)}
            placeholder="أي تفاصيل إضافية مهمة"
            multiline
            numberOfLines={3}
            maxLength={250}
            palette={palette}
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={[styles.fieldLabel, { color: palette.text }]}>
            موقع الوظيفة
          </Text>

          <TouchableOpacity
            style={{
              height: 54,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: palette.border,
              justifyContent: 'center',
              paddingHorizontal: 16,
              backgroundColor: palette.cardBg,
            }}
            onPress={() =>
              navigation.navigate('PickLocation', {
                onSelect: (loc) => {
                  setForm((prev) => ({
                    ...prev,
                    location: loc,
                  }));
                },
              })
            }
          >
            <Text style={{ textAlign: 'right', color: palette.text }}>
              {form.location
                ? `📍 ${Number(form.location.latitude).toFixed(3)}, ${Number(
                    form.location.longitude
                  ).toFixed(3)}`
                : 'اضغط لاختيار الموقع من الخريطة'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: palette.primary }]}
          onPress={validateAndSubmit}
          activeOpacity={0.88}
        >
          <Text style={styles.submitBtnText}>
            {editMode ? 'حفظ التعديلات' : 'نشر الوظيفة'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

export default AddJobScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 24,
    alignItems: 'stretch',
  },

  headerRow: {
    width: '100%',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 44,
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

  avatarMiniWrap: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarMiniHead: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 2,
  },

  avatarMiniBody: {
    width: 11,
    height: 6,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },

  topLogo: {
    width: 118,
    height: 60,
  },

  welcomeBlock: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 16,
  },

  welcomeHint: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 4,
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
  },

  searchBar: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 18,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  searchRightIcon: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchLeftIcon: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingHorizontal: 8,
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  searchIconWrap: {
    width: 16,
    height: 16,
    position: 'relative',
  },

  searchCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.8,
    position: 'absolute',
    top: 0,
    left: 0,
  },

  searchHandle: {
    width: 7,
    height: 1.8,
    position: 'absolute',
    right: 0,
    bottom: 2,
    transform: [{ rotate: '45deg' }],
    borderRadius: 2,
  },

  filterWrap: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterTop: {
    width: 12,
    height: 2,
    borderRadius: 2,
  },

  filterStem: {
    width: 4,
    height: 7,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    marginTop: 1,
  },

  tabsContainer: {
    marginBottom: 18,
  },

  tabsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  tabButton: {
    flex: 1,
    height: 42,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginLeft: 8,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },

  tabText: {
    fontSize: 12,
    fontWeight: '700',
    writingDirection: 'rtl',
    textAlign: 'center',
  },

  heroCard: {
    borderRadius: 26,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 16,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },

  heroContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  heroIconBox: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroTextBlock: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: 12,
  },

  heroTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  heroSubTitle: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 13,
    marginTop: 6,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 21,
  },

  helperCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },

  helperTitle: {
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 8,
  },

  helperText: {
    fontSize: 13,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 21,
  },

  formCard: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
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
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 8,
  },

  inputShell: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: 'center',
  },

  input: {
    width: '100%',
    fontSize: 14,
    writingDirection: 'rtl',
  },

  rowFields: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    gap: 10,
  },

  halfField: {
    flex: 1,
  },

  submitBtn: {
    minHeight: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    writingDirection: 'rtl',
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

  briefcaseWrap: {
    width: 34,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  briefcaseHandle: {
    position: 'absolute',
    top: 1,
    width: 12,
    height: 6,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },

  briefcaseBody: {
    position: 'absolute',
    bottom: 0,
    width: 28,
    height: 20,
    borderWidth: 2.2,
    borderRadius: 6,
  },

  briefcaseLine: {
    position: 'absolute',
    width: 10,
    height: 2.2,
    borderRadius: 2,
    top: 13,
  },
});
