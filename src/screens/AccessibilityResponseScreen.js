import React, { useMemo, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { SCREEN_NAMES, MOCK_ORG_USER } from '../constants/labels';
import { AuthContext } from '../context/AuthContext';
import { db } from '../services/firebase';
import {
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';


const BackArrowIcon = ({ color = '#4B3F72' }) => (
  <Text style={[styles.backArrowIcon, { color }]}>{'‹'}</Text>
);

const BellIcon = ({ color = '#1F1655' }) => (
  <View style={styles.bellShapeWrap}>
    <View style={[styles.bellTop, { backgroundColor: color }]} />
    <View style={[styles.bellBody, { backgroundColor: color }]} />
    <View style={[styles.bellClapper, { backgroundColor: color }]} />
  </View>
);

const ProfileIcon = ({ color = '#1F1655' }) => (
  <View style={styles.profileMiniWrap}>
    <View style={[styles.profileHead, { backgroundColor: color }]} />
    <View style={[styles.profileBody, { backgroundColor: color }]} />
  </View>
);

const BuildingPlaceholderIcon = ({ color = '#8F8B9E' }) => (
  <View style={styles.buildingWrap}>
    <View style={[styles.buildingRoof, { backgroundColor: color }]} />
    <View style={[styles.buildingBody, { borderColor: color }]} />
    <View style={[styles.buildingDoor, { backgroundColor: color }]} />
    <View style={[styles.buildingWindow1, { backgroundColor: color }]} />
    <View style={[styles.buildingWindow2, { backgroundColor: color }]} />
    <View style={[styles.buildingWindow3, { backgroundColor: color }]} />
    <View style={[styles.buildingWindow4, { backgroundColor: color }]} />
    <View style={[styles.buildingWindow5, { backgroundColor: color }]} />
    <View style={[styles.buildingWindow6, { backgroundColor: color }]} />
  </View>
);

const AccessibilityResponseScreen = ({ navigation, route }) => {
  const { colors, darkMode } = useTheme();
  const { user } = useContext(AuthContext);
  const issue = route?.params?.issue || {};

  const [responseText, setResponseText] = useState(issue?.response || '');

  const palette = useMemo(
    () => ({
      bg: colors.background,
      card: colors.card,
      text: colors.text,
      subText: colors.subText,
      primary: colors.primary,
      icon: darkMode ? '#F5F3FB' : '#1F1655',
      border: darkMode ? '#39344E' : '#ECE7F7',
      inputBg: darkMode ? '#2A273A' : '#F7F5FC',
      inputBorder: darkMode ? '#3A3650' : '#E7E2F2',
      placeholderBg: darkMode ? '#2A273A' : '#F5F3FB',
      placeholderIcon: darkMode ? '#B7B2C9' : '#8F8B9E',
      actionBg: '#3B2B93',
      actionText: '#FFFFFF',
      secondaryBg: darkMode ? '#2E2A40' : '#F1EEFB',
      secondaryText: darkMode ? '#D5D0E7' : colors.primary,
    }),
    [colors, darkMode]
  );

  const handleSave = async () => {
  const clean = responseText.trim();

  if (!clean) {
    Alert.alert('تنبيه', 'يرجى كتابة الرد قبل الحفظ.');
    return;
  }

  try {
    await updateDoc(doc(db, 'evaluations', issue.id), {
      orgReply: {
        text: clean,
        repliedAt: serverTimestamp(),
        repliedBy: user?.uid || user?.id || null,
        repliedByName:
          user?.orgName ||
          user?.name ||
          MOCK_ORG_USER?.name ||
          'المنظمة',
      },
      status: 'resolved',
    });

    Alert.alert('تم الحفظ', 'تم حفظ الرد بنجاح.', [
      {
        text: 'حسنًا',
        onPress: () => navigation.goBack(),
      },
    ]);
  } catch (error) {
    console.log('SAVE ORG RESPONSE ERROR:', error);
    Alert.alert('خطأ', 'حدث خطأ أثناء حفظ الرد.');
  }
};

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: palette.bg }]}>
        <StatusBar
          barStyle={darkMode ? 'light-content' : 'dark-content'}
          backgroundColor={palette.bg}
        />

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            
            <View style={styles.headerRow}>
             <TouchableOpacity
  
  onPress={() => navigation.navigate(SCREEN_NAMES.NOTIFICATIONS)}
  activeOpacity={0.85}
>
  <BellIcon color={palette.iconColor} />
</TouchableOpacity>

              <Image
                source={require('../../assets/logo2.png')}
                style={styles.topLogo}
                resizeMode="contain"
              />

              <TouchableOpacity
                style={[styles.iconButton, { backgroundColor: palette.card }]}
                onPress={() => navigation.navigate(SCREEN_NAMES.PROFILE)}
                activeOpacity={0.85}
              >
                <ProfileIcon color={palette.icon} />
              </TouchableOpacity>

            </View>

            
            <View style={styles.pageTitleBlock}>
              <Text style={[styles.pageHint, { color: palette.subText }]}>
                معالجة الملاحظات الواردة
              </Text>
              <Text style={[styles.pageTitle, { color: palette.text }]}>
                الرد على المشكلة
              </Text>
            </View>

            
            <View style={[styles.card, { backgroundColor: palette.card }]}>
              <View style={styles.cardHeader}>
                <TouchableOpacity
                  style={[
                    styles.backButton,
                    {
                      backgroundColor: palette.secondaryBg,
                      borderColor: palette.border,
                    },
                  ]}
                  onPress={() => navigation.goBack()}
                  activeOpacity={0.88}
                >
                  <BackArrowIcon color={palette.secondaryText} />
                </TouchableOpacity>

                <View style={styles.issueHeaderText}>
                  <Text style={[styles.issueTitle, { color: palette.text }]}>
                    {issue?.title || 'مشكلة إمكانية وصول'}
                  </Text>
                  <Text style={[styles.issueTime, { color: palette.subText }]}>
                    {issue?.timeAgo || 'منذ وقت قصير'}
                  </Text>
                </View>
              </View>

              {issue?.image ? (
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: issue.image }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>
              ) : (
                <View
                  style={[
                    styles.imagePlaceholder,
                    {
                      backgroundColor: palette.placeholderBg,
                      borderColor: palette.border,
                    },
                  ]}
                >
                  <BuildingPlaceholderIcon color={palette.placeholderIcon} />
                </View>
              )}

              <Text style={[styles.sectionLabel, { color: palette.text }]}>
                وصف المشكلة
              </Text>
              <Text style={[styles.issueDescription, { color: palette.subText }]}>
                {issue?.description || 'لا يوجد وصف متاح لهذه المشكلة.'}
              </Text>
            </View>

            
            <View style={[styles.card, { backgroundColor: palette.card }]}>
              <Text style={[styles.formTitle, { color: palette.primary }]}>
                كتابة الرد
              </Text>

              <Text style={[styles.fieldLabel, { color: palette.text }]}>
                نص الرد
              </Text>

              <View
                style={[
                  styles.textAreaWrap,
                  {
                    backgroundColor: palette.inputBg,
                    borderColor: palette.inputBorder,
                  },
                ]}
              >
                <TextInput
                  value={responseText}
                  onChangeText={setResponseText}
                  placeholder="اكتب رد المنظمة هنا بشكل واضح ومهني"
                  placeholderTextColor={palette.subText}
                  multiline
                  textAlign="right"
                  textAlignVertical="top"
                  style={[styles.textArea, { color: palette.text }]}
                  maxLength={1200}
                />
              </View>

              <Text style={[styles.helperText, { color: palette.subText }]}>
                يفضل توضيح الإجراء الذي تم اتخاذه أو الخطة المقترحة لمعالجة المشكلة.
              </Text>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[
                    styles.secondaryButton,
                    {
                      backgroundColor: palette.secondaryBg,
                      borderColor: palette.border,
                    },
                  ]}
                  onPress={() => navigation.goBack()}
                  activeOpacity={0.88}
                >
                  <Text
                    style={[
                      styles.secondaryButtonText,
                      { color: palette.secondaryText },
                    ]}
                  >
                    إلغاء
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    { backgroundColor: palette.actionBg },
                  ]}
                  onPress={handleSave}
                  activeOpacity={0.88}
                >
                  <Text
                    style={[
                      styles.primaryButtonText,
                      { color: palette.actionText },
                    ]}
                  >
                    حفظ الرد
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ height: 30 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 24,
  },

  headerRow: {
    flexDirection: 'row',
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

  topLogo: {
    width: 118,
    height: 60,
  },

  pageTitleBlock: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },

  pageHint: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 4,
  },

  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
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

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  issueHeaderText: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: 12,
  },

  issueTitle: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  issueTime: {
    fontSize: 12,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: 4,
  },

  imageContainer: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 14,
    height: 190,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  imagePlaceholder: {
    height: 190,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
  },

  sectionLabel: {
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 8,
  },

  issueDescription: {
    fontSize: 14,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 26,
  },

  formTitle: {
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 14,
  },

  fieldLabel: {
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 10,
  },

  textAreaWrap: {
    minHeight: 180,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  textArea: {
    minHeight: 150,
    fontSize: 14,
    lineHeight: 24,
    writingDirection: 'rtl',
  },

  helperText: {
    fontSize: 12,
    lineHeight: 20,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: 10,
  },

  actionsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginTop: 18,
    gap: 10,
  },

  primaryButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },

  primaryButtonText: {
    fontSize: 15,
    fontWeight: '800',
    writingDirection: 'rtl',
  },

  secondaryButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },

  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '800',
    writingDirection: 'rtl',
  },

  backArrowIcon: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 26,
    includeFontPadding: false,
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

  profileMiniWrap: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileHead: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 2,
  },

  profileBody: {
    width: 11,
    height: 6,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },

  buildingWrap: {
    width: 64,
    height: 64,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buildingRoof: {
    position: 'absolute',
    top: 10,
    width: 38,
    height: 4,
    borderRadius: 2,
  },

  buildingBody: {
    position: 'absolute',
    top: 14,
    width: 44,
    height: 40,
    borderWidth: 2,
    borderRadius: 4,
  },

  buildingDoor: {
    position: 'absolute',
    bottom: 10,
    width: 10,
    height: 12,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },

  buildingWindow1: {
    position: 'absolute',
    top: 22,
    left: 16,
    width: 5,
    height: 5,
    borderRadius: 1,
  },

  buildingWindow2: {
    position: 'absolute',
    top: 22,
    left: 29,
    width: 5,
    height: 5,
    borderRadius: 1,
  },

  buildingWindow3: {
    position: 'absolute',
    top: 22,
    right: 16,
    width: 5,
    height: 5,
    borderRadius: 1,
  },

  buildingWindow4: {
    position: 'absolute',
    top: 32,
    left: 16,
    width: 5,
    height: 5,
    borderRadius: 1,
  },

  buildingWindow5: {
    position: 'absolute',
    top: 32,
    left: 29,
    width: 5,
    height: 5,
    borderRadius: 1,
  },

  buildingWindow6: {
    position: 'absolute',
    top: 32,
    right: 16,
    width: 5,
    height: 5,
    borderRadius: 1,
  },
});

export default AccessibilityResponseScreen;