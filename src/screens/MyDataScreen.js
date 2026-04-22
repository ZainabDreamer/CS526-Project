import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const BackArrowIcon = ({ color = '#1F1655' }) => (
  <Text style={[styles.backArrowIcon, { color }]}>{'‹'}</Text>
);

const EditIcon = ({ color = '#4B3F72' }) => (
  <View style={styles.editIconWrap}>
    <View style={[styles.editLine, { backgroundColor: color }]} />
    <View
      style={[
        styles.editNib,
        {
          borderTopColor: color,
          borderRightColor: color,
        },
      ]}
    />
  </View>
);

const MyDataScreen = ({ navigation }) => {
  const theme = useTheme();
  const darkMode = theme?.darkMode ?? false;
  const colors = theme?.colors ?? {
    background: '#F3F1FA',
    card: '#FFFFFF',
    text: '#111111',
    subText: '#6E6A8A',
    primary: '#4B3F72',
  };

  const palette = {
    pageBg: colors.background,
    cardBg: colors.card,
    text: colors.text,
    subText: colors.subText,
    primary: colors.primary,
    border: darkMode ? '#312D45' : '#F1EFF8',
    inputBg: darkMode ? '#2A273A' : '#FAF9FD',
    inputBorder: darkMode ? '#3A3650' : '#ECE8F5',
    headerBtnBg: colors.card,
    placeholder: darkMode ? '#9E97B8' : '#AAA6BE',
    label: darkMode ? '#C6C0D8' : '#7B7696',
  };

  /*
    مهيأ للمستقبل:
    لاحقًا بدل هذا الـ state الثابت
    تقدرين تجيبين البيانات من API أو قاعدة البيانات
    وتحطينها هنا عن طريق:
    - useEffect
    - fetch / axios
    - React Query
    - Firebase
  */
  const [userData, setUserData] = useState({
    fullName: 'شهد الحساوي',
    email: 'shahad@example.com',
    phone: '05XXXXXXXX',
    city: 'الدمام',
    disabilityType: 'إعاقة حركية',
    preferredWorkType: 'حضوري / عن بعد',
    bio: 'مهتمة بالفرص الوظيفية الداعمة للشمولية وتطوير المهارات المهنية.',
  });

  const fields = useMemo(
    () => [
      { key: 'fullName', label: 'الاسم الكامل', value: userData.fullName },
      { key: 'email', label: 'البريد الإلكتروني', value: userData.email },
      { key: 'phone', label: 'رقم الجوال', value: userData.phone },
      { key: 'city', label: 'المدينة', value: userData.city },
      { key: 'disabilityType', label: 'نوع الإعاقة', value: userData.disabilityType },
      {
        key: 'preferredWorkType',
        label: 'نوع العمل المفضل',
        value: userData.preferredWorkType,
      },
    ],
    [userData]
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
          <Text style={[styles.sectionHint, { color: palette.subText }]}>
             
          </Text>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>
            بياناتي
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: palette.cardBg }]}>
          <View style={styles.cardTopRow}>
  <View style={styles.avatarBlock}>
    <Text style={[styles.avatarName, { color: palette.text }]}>
      {userData.fullName}
    </Text>
    <View style={[styles.avatarCircle, { backgroundColor: palette.inputBg }]}>
      <Text style={[styles.avatarLetter, { color: palette.primary }]}>
        {userData.fullName?.charAt(0) || 'ش'}
      </Text>
    </View>
  </View>

  <TouchableOpacity
    style={[styles.editButton, { backgroundColor: palette.inputBg }]}
    activeOpacity={0.85}
  >
    <EditIcon color={palette.primary} />
    <Text style={[styles.editButtonText, { color: palette.primary }]}>
      تعديل
    </Text>
  </TouchableOpacity>
</View>
          {fields.map((field) => (
            <View key={field.key} style={styles.fieldBlock}>
              <Text style={[styles.fieldLabel, { color: palette.label }]}>
                {field.label}
              </Text>

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
                  value={field.value}
                  editable={false}
                  style={[styles.inputText, { color: palette.text }]}
                  placeholderTextColor={palette.placeholder}
                  textAlign="right"
                />
              </View>
            </View>
          ))}

          <View style={styles.fieldBlock}>
            <Text style={[styles.fieldLabel, { color: palette.label }]}>
              نبذة مختصرة
            </Text>

            <View
              style={[
                styles.textAreaShell,
                {
                  backgroundColor: palette.inputBg,
                  borderColor: palette.inputBorder,
                },
              ]}
            >
              <TextInput
                value={userData.bio}
                editable={false}
                multiline
                style={[styles.textAreaText, { color: palette.text }]}
                placeholderTextColor={palette.placeholder}
                textAlign="right"
              />
            </View>
          </View>
        </View>

        <View style={{ height: 28 }} />
      </ScrollView>
    </View>
  );
};

export default MyDataScreen;

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
    marginBottom: 25,
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
    paddingHorizontal: 18,
    paddingVertical: 18,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  cardTopRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  editButton: {
    minWidth: 86,
    height: 40,
    borderRadius: 14,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },

  editButtonText: {
    fontSize: 13,
    fontWeight: '700',
    marginRight: 8,
  },

  avatarBlock: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },

  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  avatarName: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  fieldBlock: {
    marginBottom: 14,
  },


  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 8,
  },

  inputShell: {
    minHeight: 48,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },

  inputText: {
    fontSize: 14,
    writingDirection: 'rtl',
    textAlign: 'right',
  },

  textAreaShell: {
    minHeight: 110,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingTop: 12,
  },

  textAreaText: {
    fontSize: 14,
    lineHeight: 22,
    writingDirection: 'rtl',
    textAlign: 'right',
    textAlignVertical: 'top',
  },

  backArrowIcon: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 26,
    includeFontPadding: false,
  },
});