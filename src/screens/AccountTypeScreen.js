import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { SCREEN_NAMES } from '../constants/labels';

const AccountTypeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F1FA" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoSection}>
          <Image
            source={require('../../assets/logo2.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        
        <View style={styles.headerSection}>
          <Text style={styles.title}>اختر نوع الحساب</Text>
          <Text style={styles.subtitle}>
            اختر نوع الحساب المناسب لك للحصول على تجربة تلبي احتياجاتك في تطبيق شمولية
          </Text>
        </View>

        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>باحث عن عمل</Text>

          <Text style={styles.cardDesc}>
            للأشخاص ذوي الإعاقة الذين يبحثون عن فرص عمل مناسبة وبيئة مهنية داعمة
          </Text>

          <View style={styles.featuresList}>
            {[
              'إنشاء ملف شخصي مهني',
              'البحث في الوظائف المواءمة',
              'الحصول على دعم مهني',
            ].map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <View style={styles.bullet} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate(SCREEN_NAMES.SIGNUP_JOB_SEEKER)}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>إنشاء حساب</Text>
          </TouchableOpacity>
        </View>

        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>مؤسسة</Text>

          <Text style={styles.cardDesc}>
            للمنظمات التي ترغب في قياس الشمولية وتوظيف الأشخاص ذوي الإعاقة
          </Text>

          <View style={styles.featuresList}>
            {[
              'نشر الوظائف الشاغرة',
              'قياس الشمولية في الجهة',
              'استشارات التوظيف الشامل',
            ].map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <View style={styles.bullet} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate(SCREEN_NAMES.SIGNUP_ORGANIZATION)}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryButtonText}>إنشاء حساب للجهة</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F1FA',
  },

  scrollView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },

  logoSection: {
    alignItems: 'center',
    marginBottom: 2,
  },

  logo: {
    width: 200,
    height: 80,
  },

  headerSection: {
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1F1655',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 8,
    paddingHorizontal: 10,
  },

  subtitle: {
    fontSize: 14,
    color: '#6E6A8A',
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 22,
    paddingHorizontal: 10,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F1655',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 6,
  },

  cardDesc: {
    fontSize: 13,
    color: '#6E6A8A',
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 20,
    marginBottom: 14,
  },

  featuresList: {
    marginBottom: 16,
  },

  featureRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },

  featureText: {
    fontSize: 13,
    color: '#1F1655',
    marginRight: 8,
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#36B487',
  },

  primaryButton: {
    backgroundColor: '#C7C4F0',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },

  primaryButtonText: {
    color: '#1F1655',
    fontSize: 15,
    fontWeight: '800',
  },

  secondaryButton: {
    backgroundColor: '#B7B2E6',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },

  secondaryButtonText: {
    color: '#1F1655',
    fontSize: 15,
    fontWeight: '800',
  },
});

export default AccountTypeScreen;