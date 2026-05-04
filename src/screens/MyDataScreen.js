import React, { useContext, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { db, storage } from '../services/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const BackArrowIcon = ({ color = '#1F1655' }) => (
  <Text style={[styles.backArrowIcon, { color }]}>{'‹'}</Text>
);

const EditIcon = ({ color = '#4B3F72' }) => (
  <View style={styles.editIconWrap}>
    <View style={[styles.editLine, { backgroundColor: color }]} />
    <View
      style={[
        styles.editNib,
        { borderTopColor: color, borderRightColor: color },
      ]}
    />
  </View>
);

const MyDataScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
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
    inputBg: darkMode ? '#2A273A' : '#FAF9FD',
    inputBorder: darkMode ? '#3A3650' : '#ECE8F5',
    headerBtnBg: colors.card,
    placeholder: darkMode ? '#9E97B8' : '#AAA6BE',
    label: darkMode ? '#C6C0D8' : '#7B7696',
  };

  const initialData = {
    fullName:
      user?.name ||
      user?.fullName ||
      user?.representativeName ||
      user?.orgName ||
      'مستخدم شمولية',
    email: user?.email || user?.username || 'غير محدد',
    phone: user?.phone || 'غير محدد',
    city: user?.city || 'غير محدد',
    disabilityType:
      user?.disabilityType || user?.supports?.join('، ') || 'غير محدد',
    preferredWorkType:
      user?.interview || user?.preferredWorkType || 'غير محدد',
    bio: user?.experience || user?.orgSector || 'لا توجد نبذة مسجلة حاليًا.',
    imageUri: user?.imageUri || null,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);

  const updateField = (key, value) => {
    setUserData((prev) => ({ ...prev, [key]: value }));
  };

  const uploadImageToFirebase = async (uri, uid) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const imageRef = ref(storage, `profileImages/${uid}.jpg`);

    await uploadBytes(imageRef, blob);

    const downloadURL = await getDownloadURL(imageRef);

    return downloadURL;
  };

  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert('الصلاحية مطلوبة', 'يرجى السماح بالوصول للصور.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const uri = result.assets[0].uri;
        updateField('imageUri', uri);
      }
    } catch (error) {
      console.log('PICK IMAGE ERROR:', error);
      Alert.alert('خطأ', 'تعذر اختيار الصورة.');
    }
  };

  const saveProfile = async () => {
    const uid = user?.uid || user?.id;

    if (!uid) {
      Alert.alert('خطأ', 'تعذر تحديد حساب المستخدم.');
      return;
    }

    try {
      setIsSaving(true);

      let finalImageUri = userData.imageUri || null;

      if (finalImageUri && finalImageUri.startsWith('file://')) {
        finalImageUri = await uploadImageToFirebase(finalImageUri, uid);
      }

      const payload = {
        name: userData.fullName.trim(),
        fullName: userData.fullName.trim(),
        email: userData.email.trim().toLowerCase(),
        phone: userData.phone.trim(),
        city: userData.city.trim(),
        disabilityType: userData.disabilityType.trim(),
        preferredWorkType: userData.preferredWorkType.trim(),
        bio: userData.bio.trim(),
        imageUri: finalImageUri,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(doc(db, 'users', uid), payload);

      if (user?.role === 'organization') {
        await updateDoc(doc(db, 'organizations', uid), {
          name: userData.fullName.trim(),
          orgName: userData.fullName.trim(),
          phone: userData.phone.trim(),
          city: userData.city.trim(),
          imageUri: finalImageUri,
          updatedAt: serverTimestamp(),
        });
      }

      setUserData((prev) => ({
        ...prev,
        imageUri: finalImageUri,
      }));

      setIsEditing(false);
      Alert.alert('تم الحفظ', 'تم تحديث بياناتك بنجاح.');
    } catch (error) {
      console.log('UPDATE MY DATA ERROR:', error);
      Alert.alert('خطأ', 'تعذر تحديث بياناتك.');
    } finally {
      setIsSaving(false);
    }
  };

  const fields = useMemo(
    () => [
      { key: 'fullName', label: 'الاسم الكامل' },
      { key: 'email', label: 'البريد الإلكتروني' },
      { key: 'phone', label: 'رقم الجوال' },
      { key: 'city', label: 'المدينة' },
      { key: 'disabilityType', label: 'نوع الإعاقة / الدعم' },
      { key: 'preferredWorkType', label: 'نوع العمل / المقابلة المفضل' },
    ],
    []
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
          <View />
          <Text style={[styles.sectionTitle, { color: palette.text }]}>
            بياناتي
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: palette.cardBg }]}>
          <View style={styles.cardTopRow}>
            <View style={styles.avatarBlock}>
              <TouchableOpacity
                style={[
                  styles.avatarCircle,
                  { backgroundColor: palette.inputBg },
                ]}
                onPress={pickImage}
                activeOpacity={0.85}
              >
                {userData.imageUri ? (
                  <Image
                    source={{ uri: userData.imageUri }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <Text style={[styles.avatarLetter, { color: palette.primary }]}>
                    {userData.fullName?.charAt(0) || 'ش'}
                  </Text>
                )}
              </TouchableOpacity>

              <View style={styles.avatarTextWrap}>
                <Text style={[styles.avatarName, { color: palette.text }]}>
                  {userData.fullName}
                </Text>
                <Text style={[styles.avatarHint, { color: palette.subText }]}>
                  اضغطي على الصورة لتغييرها
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: palette.inputBg }]}
              onPress={isEditing ? saveProfile : () => setIsEditing(true)}
              activeOpacity={0.85}
              disabled={isSaving}
            >
              <EditIcon color={palette.primary} />
              <Text style={[styles.editButtonText, { color: palette.primary }]}>
                {isSaving ? 'جارٍ الحفظ...' : isEditing ? 'حفظ' : 'تعديل'}
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
                  value={String(userData[field.key] || '')}
                  onChangeText={(v) => updateField(field.key, v)}
                  editable={isEditing}
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
                value={String(userData.bio || '')}
                onChangeText={(v) => updateField('bio', v)}
                editable={isEditing}
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
  container: { flex: 1 },

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
    flex: 1,
  },

  avatarCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    overflow: 'hidden',
  },

  avatarImage: {
    width: '100%',
    height: '100%',
  },

  avatarLetter: {
    fontSize: 22,
    fontWeight: '800',
  },

  avatarTextWrap: {
    flex: 1,
    alignItems: 'flex-end',
  },

  avatarName: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    flexShrink: 1,
  },

  avatarHint: {
    fontSize: 11,
    marginTop: 4,
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

  editIconWrap: {
    width: 15,
    height: 15,
    position: 'relative',
  },

  editLine: {
    width: 13,
    height: 3,
    borderRadius: 2,
    transform: [{ rotate: '-35deg' }],
    position: 'absolute',
    top: 6,
    left: 1,
  },

  editNib: {
    width: 6,
    height: 6,
    borderTopWidth: 2,
    borderRightWidth: 2,
    transform: [{ rotate: '-35deg' }],
    position: 'absolute',
    right: 0,
    top: 3,
  },
});