import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from '../components/CustomButton';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');

 const handleReset = async () => {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail) {
    Alert.alert('خطأ', 'يرجى إدخال البريد الإلكتروني');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(cleanEmail)) {
    Alert.alert('خطأ', 'يرجى إدخال بريد إلكتروني صحيح');
    return;
  }

  try {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, cleanEmail);

    Alert.alert(
      'تم الإرسال',
      'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.'
    );
  } catch (error) {
    Alert.alert(
      'خطأ',
      'تعذر إرسال رابط إعادة التعيين. تأكدي من البريد الإلكتروني وحاولي مرة أخرى.'
    );
  }
};
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <LinearGradient
        colors={['#241C56', '#2B2467', '#314D76']}
        locations={[0, 0.6, 1]}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.logoSection}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.centerSection}>
            <View style={styles.formCard}>
              <Text style={styles.title}>نسيت كلمة المرور؟</Text>

              <Text style={styles.subtitle}>
                أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور
              </Text>

              <View style={styles.fieldLabelRow}>
                <Text style={styles.fieldLabel}>البريد الإلكتروني</Text>
              </View>

              <View style={styles.inputWrapper}>
                <TextInput
                 value={email}
                 onChangeText={setEmail}
                 placeholder="example@email.com"
                 placeholderTextColor="#A7A7A7"
                 style={styles.input}
                 keyboardType="email-address"
                 autoCapitalize="none"
                 autoCorrect={false}
                  />
              </View>

              <CustomButton
                title="إرسال الرابط"
                onPress={handleReset}
                style={styles.sendBtn}
                textStyle={styles.sendBtnText}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#241C56',
  },

  gradient: {
    flex: 1,
  },

  keyboardContainer: {
    flex: 1,
  },

  logoSection: {
    paddingTop: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    width: 170,
    height: 60,
  },

  centerSection: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  formCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },

  subtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 24,
  },

  fieldLabelRow: {
    width: '100%',
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },

  fieldLabel: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  inputWrapper: {
    width: '100%',
    height: 54,
    backgroundColor: '#F2F2F2',
    borderRadius: 27,
    justifyContent: 'center',
    paddingHorizontal: 22,
    marginBottom: 22,
  },

  input: {
    width: '100%',
    fontSize: 14,
    color: '#1F1655',
    textAlign: 'left',
    paddingVertical: 0,
  },

  sendBtn: {
    backgroundColor: '#C7C4F0',
    borderRadius: 18,
    paddingVertical: 16,
  },

  sendBtnText: {
    color: '#1F1655',
    fontSize: 19,
    fontWeight: '800',
  },
});

export default ForgotPasswordScreen;
