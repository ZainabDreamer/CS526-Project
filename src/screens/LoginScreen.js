import React, { useRef, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ImageBackground,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SCREEN_NAMES } from '../constants/labels';
import { AuthContext } from '../context/AuthContext';

const { height } = Dimensions.get('window');

const CheckBox = ({ checked, onPress }) => (
  <TouchableOpacity
    style={[styles.checkbox, checked && styles.checkboxChecked]}
    onPress={onPress}
    activeOpacity={0.85}
  >
    {checked ? <Text style={styles.checkboxMark}>✓</Text> : null}
  </TouchableOpacity>
);

const RadioOption = ({ label, selected, onPress }) => (
  <TouchableOpacity style={styles.radioRow} onPress={onPress} activeOpacity={0.85}>
    <Text style={[styles.radioLabel, selected && styles.radioLabelActive]}>{label}</Text>
    <View style={[styles.radioOuter, selected && styles.radioOuterActive]}>
      {selected ? <View style={styles.radioInner} /> : null}
    </View>
  </TouchableOpacity>
);

const PasswordToggle = ({ visible, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.passwordToggle}>
    <Ionicons
      name={visible ? 'eye-off-outline' : 'eye-outline'}
      size={20}
      color="#4B3F72"
    />
  </TouchableOpacity>
);

const LoginScreen = ({ navigation }) => {
  // ✅ M4 AUTH CONNECTION: ربط صفحة تسجيل الدخول مع Firebase Auth + Firestore
  const { login } = useContext(AuthContext);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [accountType, setAccountType] = useState('jobSeeker');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const getPasswordStrength = (value) => {
    const pwd = value.trim();

    if (!pwd) {
      return { label: '', color: '#9C9C9C', width: '0%' };
    }

    let score = 0;

    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd) || /[أ-ي]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9أ-ي]/.test(pwd)) score += 1;

    if (pwd.length < 6) {
      return { label: 'ضعيف', color: '#D94A4A', width: '33%' };
    }

    if (score <= 2) {
      return { label: 'ضعيف', color: '#D94A4A', width: '33%' };
    }

    if (score <= 4) {
      return { label: 'متوسط', color: '#F39A57', width: '66%' };
    }

    return { label: 'قوي', color: '#36B487', width: '100%' };
  };

  const passwordStrength = getPasswordStrength(password);

  const runShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 4,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -4,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLogin = async () => {
    const trimmedIdentifier = identifier.trim();
    const trimmedPassword = password.trim();

    if (!trimmedIdentifier || !trimmedPassword) {
      Alert.alert('خطأ', 'يرجى تعبئة جميع الحقول');
      return;
    }

    if (!accountType) {
      Alert.alert('خطأ', 'يرجى تحديد نوع الحساب');
      return;
    }

    try {
      setIsLoading(true);

      // ✅ M4 AUTH CONNECTION: التحقق من بيانات المستخدم المخزنة في Firebase
      const response = await login(
          trimmedIdentifier,
          trimmedPassword,
          accountType 
         );

      setIsLoading(false);

      if (!response?.success || !response?.user) {
        runShake();
        Alert.alert('فشل تسجيل الدخول', 'بيانات الدخول غير صحيحة أو الحساب غير موجود.');
        return;
      }

      const user = response.user;

      if (user.role === 'jobSeeker') {
        navigation.replace('JobSeekerTabNavigator');
        return;
      }

      if (user.role === 'organization') {
        navigation.replace('OrgTabNavigator');
        return;
      }

      Alert.alert('خطأ', 'تعذر تحديد نوع الحساب.');
    } catch (error) {
      setIsLoading(false);
      runShake();
      Alert.alert('فشل تسجيل الدخول', error?.message || 'حدث خطأ أثناء تسجيل الدخول.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'height' : undefined}
          keyboardVerticalOffset={0}
        >
          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={styles.scrollContent}
          >
            <ImageBackground
              source={require('../../assets/image2.png')}
              style={styles.heroSection}
              resizeMode="cover"
            >
              <LinearGradient
                colors={[
                  'rgba(36,28,86,0.10)',
                  'rgba(36,28,86,0.40)',
                  'rgba(36,28,86,0.80)',
                  '#241C56',
                ]}
                style={styles.heroGradient}
              />

              <Image
                source={require('../../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </ImageBackground>

            <LinearGradient
              colors={['#241C56', '#2B2467', '#314D76']}
              style={styles.formSection}
            >
              <View style={styles.labelRow}>
                <Text style={styles.labelText}>البريد الإلكتروني / اسم المستخدم</Text>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  value={identifier}
                  onChangeText={setIdentifier}
                  placeholder="أدخل البريد الإلكتروني أو اسم المستخدم"
                  placeholderTextColor="#9C9C9C"
                  style={styles.input}
                  textAlign="right"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                />
              </View>

              <View style={[styles.labelRow, styles.secondLabelRow]}>
                <Text style={styles.labelText}>الرمز السري</Text>
              </View>

              <Animated.View
                style={[
                  styles.inputContainerWithAction,
                  { transform: [{ translateX: shakeAnim }] },
                ]}
              >
                <PasswordToggle
                  visible={showPassword}
                  onPress={() => setShowPassword((prev) => !prev)}
                />

                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="أدخل الرمز السري"
                  placeholderTextColor="#9C9C9C"
                  style={styles.inputPassword}
                  secureTextEntry={!showPassword}
                  textAlign="right"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
              </Animated.View>

              {!!password.trim() && (
                <View style={styles.strengthWrap}>
                  <View style={styles.strengthHeader}>
                    <Text style={[styles.strengthLabel, { color: passwordStrength.color }]}>
                      {passwordStrength.label}
                    </Text>
                    <Text style={styles.strengthTitle}>قوة الرمز السري</Text>
                  </View>

                  <View style={styles.strengthTrack}>
                    <View
                      style={[
                        styles.strengthFill,
                        {
                          width: passwordStrength.width,
                          backgroundColor: passwordStrength.color,
                        },
                      ]}
                    />
                  </View>
                </View>
              )}

              <View style={styles.accountTypeWrap}>
                <Text style={styles.accountTypeTitle}>نوع الحساب</Text>

                <View style={styles.accountTypeOptions}>
                  <RadioOption
                    label="منظمة"
                    selected={accountType === 'organization'}
                    onPress={() => setAccountType('organization')}
                  />

                  <RadioOption
                    label="باحث عن عمل"
                    selected={accountType === 'jobSeeker'}
                    onPress={() => setAccountType('jobSeeker')}
                  />
                </View>
              </View>

              <View style={styles.optionsRow}>
                <TouchableOpacity
                  onPress={() => navigation.navigate(SCREEN_NAMES.FORGOT_PASSWORD)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.forgotText}>هل نسيت الرمز ؟</Text>
                </TouchableOpacity>

                <View style={styles.rememberWrapper}>
                  <Text style={styles.rememberText}>تذكرني</Text>
                  <CheckBox
                    checked={rememberMe}
                    onPress={() => setRememberMe((prev) => !prev)}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.88}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#1F1655" />
                ) : (
                  <Text style={styles.primaryButtonText}>تسجيل دخول</Text>
                )}
              </TouchableOpacity>

              <View style={styles.signupRow}>
                <TouchableOpacity
                  onPress={() => navigation.navigate(SCREEN_NAMES.ACCOUNT_TYPE)}
                  activeOpacity={0.88}
                >
                  <Text style={styles.signupLink}>إنشاء حساب</Text>
                </TouchableOpacity>

                <Text style={styles.signupText}>ليس لديك حساب؟</Text>
              </View>
            </LinearGradient>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#241C56',
  },

  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#241C56',
  },

  heroSection: {
    height: height * 0.36,
    minHeight: 260,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },

  logo: {
    width: 168,
    height: 64,
    marginBottom: 26,
  },

  formSection: {
    flex: 1,
    minHeight: height * 0.64,
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 30,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    marginTop: -6,
  },

  labelRow: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 8,
    paddingHorizontal: 10,
  },

  secondLabelRow: {
    marginTop: 16,
  },

  labelText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
    alignSelf: 'flex-end',
    writingDirection: 'rtl',
  },

  inputContainer: {
    width: '100%',
    height: 50,
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },

  inputContainerWithAction: {
    width: '100%',
    height: 50,
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    width: '100%',
    fontSize: 13,
    color: '#1F1655',
    writingDirection: 'rtl',
  },

  inputPassword: {
    flex: 1,
    fontSize: 13,
    color: '#1F1655',
    writingDirection: 'rtl',
    textAlign: 'right',
  },

  passwordToggle: {
    marginLeft: 10,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  strengthWrap: {
    marginTop: 8,
  },

  strengthHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  strengthTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    writingDirection: 'rtl',
  },

  strengthLabel: {
    fontSize: 12,
    fontWeight: '800',
    writingDirection: 'rtl',
  },

  strengthTrack: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 6,
    overflow: 'hidden',
  },

  strengthFill: {
    height: '100%',
    borderRadius: 6,
  },

  accountTypeWrap: {
    marginTop: 18,
  },

  accountTypeTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
    marginBottom: 10,
    writingDirection: 'rtl',
    paddingHorizontal: 10,
  },

  accountTypeOptions: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginHorizontal: 16,
  },

  radioLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    marginLeft: 10,
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  radioLabelActive: {
    fontWeight: '700',
  },

  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#CFC9E8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  radioOuterActive: {
    borderColor: '#C7C4F0',
    backgroundColor: 'rgba(255,255,255,0.10)',
  },

  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C7C4F0',
  },

  optionsRow: {
    width: '100%',
    marginTop: 14,
    marginBottom: 22,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  forgotText: {
    color: '#FFFFFF',
    fontSize: 13,
    textAlign: 'right',
    writingDirection: 'rtl',
    paddingHorizontal: 10,
  },

  rememberWrapper: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },

  rememberText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 13,
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#CFC9E8',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxChecked: {
    backgroundColor: '#C7C4F0',
    borderColor: '#C7C4F0',
  },

  checkboxMark: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1F1655',
    lineHeight: 12,
  },

  primaryButton: {
    width: '100%',
    backgroundColor: '#C7C4F0',
    borderRadius: 18,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  primaryButtonText: {
    color: '#1F1655',
    fontSize: 16,
    fontWeight: '800',
    writingDirection: 'rtl',
  },

  signupRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },

  signupText: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 12,
    writingDirection: 'rtl',
  },

  signupLink: {
    color: '#C7C4F0',
    fontSize: 12,
    fontWeight: '700',
    writingDirection: 'rtl',
    marginLeft: 6,
    textDecorationLine: 'underline',
  },

  buttonDisabled: {
    opacity: 0.7,
  },
});

export default LoginScreen;
