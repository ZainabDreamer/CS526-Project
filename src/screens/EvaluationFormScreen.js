import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useTheme } from '../context/ThemeContext';
import AppHeader from '../components/AppHeader';
import { AuthContext } from '../context/AuthContext';
import { SCREEN_NAMES } from '../constants/labels';
import { db } from '../services/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
} from 'firebase/firestore';

const FilterIcon = ({ color = '#8F8B9E' }) => (
  <View style={styles.filterWrap}>
    <View style={[styles.filterTop, { backgroundColor: color }]} />
    <View style={[styles.filterStem, { backgroundColor: color }]} />
  </View>
);

const ImagePlaceholderIcon = ({ color = '#8F8B9E' }) => (
  <View style={styles.imageIconWrap}>
    <View style={[styles.imageBox, { borderColor: color }]} />
    <View style={[styles.imageSun, { backgroundColor: color }]} />
    <View style={[styles.imageHill, { backgroundColor: color }]} />
  </View>
);

const EvaluationFormScreen = ({ navigation, route }) => {
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

  const { company = {} } = route.params || {};
  const [activeTab, setActiveTab] = useState('current');
  const [notes, setNotes] = useState('');
  const [isReady, setIsReady] = useState('');
  const [treatment, setTreatment] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [rating, setRating] = useState(4);
  const [file, setFile] = useState(null);

  const palette = {
    pageBg: colors.background,
    cardBg: colors.card,
    text: colors.text,
    subText: colors.subText,
    primary: colors.primary,
    iconMuted: darkMode ? '#B7B2C9' : '#8F8B9E',
    tabBg: darkMode ? '#1F1B2E' : '#FFFFFF',
    tabBorder: darkMode ? '#39344E' : '#ECE7F7',
    fieldLabel: darkMode ? '#DDD8EE' : '#111111',
    timeText: darkMode ? '#A8A3BC' : '#8A85A0',
    uploadBg: darkMode ? '#1E1B2E' : '#F5F3FB',
    uploadBorder: darkMode ? '#4A4660' : '#ECE7F7',
    uploadText: darkMode ? '#B7B2C9' : '#8F8B9E',
    starBg: darkMode ? '#312D45' : '#F1EEF8',
    starFilledBg: darkMode ? '#4B3A21' : '#FFF1D6',
    starMuted: darkMode ? '#A7A2BA' : '#A7A2BA',
    starActive: '#F39A57',
    helperText: '#36B487',
    bannerSubText: 'rgba(255,255,255,0.85)',
  };

  const handleSubmit = async () => {
    if (!notes.trim() || !isReady.trim() || !treatment.trim()) {
      Alert.alert('بيانات ناقصة', 'يرجى تعبئة الحقول الأساسية قبل إرسال التقييم.');
      return;
    }

    const payload = {
      userId: user?.uid || user?.id || null,
      userName: user?.name || '',
      company: {
      id: company?.id || company?.orgId || null,
      name: company?.name || company?.orgName || 'جهة غير محددة',
      },
      orgId: company?.orgId || company?.id || null,
      orgName: company?.name || company?.orgName || 'جهة غير محددة',
      rating,
      notes: notes.trim(),
      isReady: isReady.trim(),
      treatment: treatment.trim(),
      suggestions: suggestions.trim(),
      attachment: file
        ? {
            uri: file.uri,
            fileName: file.fileName || file.name || 'evaluation_attachment.jpg',
            type: file.type || 'image',
          }
        : null,
      status: 'submitted',
      createdAt: serverTimestamp(),
    };

    try {
  await addDoc(collection(db, 'evaluations'), payload);

  if (payload.orgId) {
    await updateDoc(doc(db, 'organizations', payload.orgId), {
      evaluationsCount: increment(1),
      updatedAt: serverTimestamp(),
    });
  }

  Alert.alert('تم إرسال التقييم', 'تم حفظ تقييمك بنجاح.', [
    {
      text: 'حسنًا',
      onPress: () => navigation.goBack(),
    },
  ]);
} catch (error) {
  Alert.alert('خطأ', 'تعذر حفظ التقييم. يرجى المحاولة مرة أخرى.');
}
  };

  const pickFile = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('الصلاحية مطلوبة', 'يرجى السماح بالوصول للصور.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setFile(result.assets[0]);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.pageBg }]}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={palette.pageBg}
      />

      <AppHeader
        navigation={navigation}
        leftType="bell"
        rightType="profile"
        horizontalPadding={25}
      />

      <LinearGradient
        colors={['#4B3F72', '#40357E', '#312767']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.banner}
      >
        <Text style={styles.bannerText}>
          التقييم الصحيح لبيئة <Text style={styles.bannerHighlight}>شاملة</Text>
        </Text>
        <Text style={[styles.bannerSubText, { color: palette.bannerSubText }]}>
          شارك رأيك لتطوير بيئة عمل أكثر شمولية ووضوحًا للجميع
        </Text>
      </LinearGradient>

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: palette.cardBg }]}
          activeOpacity={0.85}
        >
          <FilterIcon color={palette.iconMuted} />
        </TouchableOpacity>

        <View
          style={[
            styles.tabs,
            { backgroundColor: palette.tabBg, borderColor: palette.tabBorder },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'current' && { backgroundColor: palette.primary },
            ]}
            onPress={() => setActiveTab('current')}
            activeOpacity={0.88}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'current' ? '#FFFFFF' : palette.text },
              ]}
            >
              الحالي
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'previous' && { backgroundColor: palette.primary },
            ]}
            onPress={() => setActiveTab('previous')}
            activeOpacity={0.88}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'previous' ? '#FFFFFF' : palette.text },
              ]}
            >
              السابق
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.infoCard, { backgroundColor: palette.cardBg }]}>
          <View style={styles.metaRow}>
            <Text style={[styles.companyName, { color: palette.text }]}>
              {company.name || 'شركة أحمد للمقاولات'}
            </Text>
            <Text style={[styles.timeAgo, { color: palette.timeText }]}>منذ 3 شهور</Text>
          </View>

          <Text style={[styles.addNew, { color: palette.helperText }]}>إضافة تقييم جديد</Text>

          <Text style={[styles.fieldLabel, { color: palette.fieldLabel }]}>تقييمك</Text>

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                activeOpacity={0.85}
                style={styles.starBtn}
              >
                <View
                  style={[
                    styles.starShape,
                    {
                      backgroundColor:
                        star <= rating ? palette.starFilledBg : palette.starBg,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.starText,
                      {
                        color:
                          star <= rating ? palette.starActive : palette.starMuted,
                      },
                    ]}
                  >
                    ★
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.formCard, { backgroundColor: palette.cardBg }]}>
          <CustomInput
            label="ملاحظات"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            placeholder=""
          />

          <CustomInput
            label="هل الشركة مهيأة لذوي الإعاقة؟"
            value={isReady}
            onChangeText={setIsReady}
            placeholder=""
          />

          <CustomInput
            label="تعامل الموظفين"
            value={treatment}
            onChangeText={setTreatment}
            placeholder=""
          />

          <CustomInput
            label="تقديم اقتراحات لتحسين الشمولية"
            value={suggestions}
            onChangeText={setSuggestions}
            multiline
            numberOfLines={3}
            placeholder=""
          />

          <View style={styles.uploadBlock}>
            <Text style={[styles.uploadLabel, { color: palette.fieldLabel }]}>
              إرفاق صورة أو مستند
            </Text>

            <TouchableOpacity
              style={[
                styles.imagePlaceholder,
                {
                  backgroundColor: palette.uploadBg,
                  borderColor: palette.uploadBorder,
                },
              ]}
              activeOpacity={0.85}
              onPress={pickFile}
            >
              {file ? (
                <>
                  <Image
                    source={{ uri: file.uri }}
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                  <View style={styles.fileOverlay}>
                    <Text style={styles.fileOverlayText}>تم اختيار مرفق</Text>
                  </View>
                </>
              ) : (
                <>
                  <ImagePlaceholderIcon color={palette.uploadText} />
                  <Text
                    style={[styles.imagePlaceholderText, { color: palette.uploadText }]}
                  >
                    اضغط لإضافة مرفق
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <CustomButton
            title="إرسال التقييم"
            onPress={handleSubmit}
            style={[styles.submitBtn, { backgroundColor: palette.primary }]}
            textStyle={styles.submitBtnText}
          />
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

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

  banner: {
    marginHorizontal: 20,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 25,
    marginBottom: 18,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },

  bannerText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'right',
    fontWeight: '700',
    writingDirection: 'rtl',
  },

  bannerHighlight: {
    color: '#56B692',
    fontWeight: '800',
  },

  bannerSubText: {
    fontSize: 13,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: 8,
    lineHeight: 20,
  },

  tabRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
  },

  filterButton: {
    width: 42,
    height: 42,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },

  tabs: {
    flex: 1,
    flexDirection: 'row-reverse',
    borderRadius: 18,
    padding: 4,
    borderWidth: 1,
  },

  tab: {
    flex: 1,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },

  tabText: {
    fontSize: 14,
    fontWeight: '700',
    writingDirection: 'rtl',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 20,
  },

  infoCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  metaRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  companyName: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  timeAgo: {
    fontSize: 12,
    writingDirection: 'rtl',
  },

  addNew: {
    fontSize: 13,
    textAlign: 'right',
    marginBottom: 16,
    fontWeight: '700',
    writingDirection: 'rtl',
  },

  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
    marginBottom: 10,
    writingDirection: 'rtl',
  },

  starsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    alignSelf: 'flex-end',
    marginBottom: 2,
  },

  starBtn: {
    marginLeft: 8,
  },

  starShape: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },

  starText: {
    fontSize: 18,
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

  uploadBlock: {
    marginTop: 6,
    marginBottom: 16,
  },

  uploadLabel: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
    marginBottom: 10,
    writingDirection: 'rtl',
  },

  imagePlaceholder: {
    height: 110,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },

  previewImage: {
    width: '100%',
    height: '100%',
  },

  fileOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
  },

  fileOverlayText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    writingDirection: 'rtl',
  },

  imageIconWrap: {
    width: 38,
    height: 30,
    position: 'relative',
    marginBottom: 8,
  },

  imageBox: {
    position: 'absolute',
    width: 38,
    height: 26,
    borderRadius: 6,
    borderWidth: 2,
    bottom: 0,
  },

  imageSun: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 3.5,
    top: 7,
    right: 7,
  },

  imageHill: {
    position: 'absolute',
    width: 18,
    height: 10,
    bottom: 4,
    left: 7,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  imagePlaceholderText: {
    fontSize: 13,
    fontWeight: '600',
    writingDirection: 'rtl',
  },

  submitBtn: {
    marginTop: 6,
    borderRadius: 16,
    paddingVertical: 14,
  },

  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});

export default EvaluationFormScreen;
