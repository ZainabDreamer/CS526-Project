import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';

import colors from '../theme/colors';
import { SCREEN_NAMES } from '../constants/labels';

const { width, height } = Dimensions.get('window');

// Onboarding slides data
const slides = [
  {
    id: '1',
    image: require('../../assets/onboarding_jobs.png'),
    title: 'وظائف شاملة ومتاحة',
    description:
      'اكتشف فرص العمل في المنظمات التي تدعم الإدماج الوظيفي لذوي الإعاقة وتوفر بيئة عمل مهيأة',
    bg: '#EEF6F1',
    accent: colors.primary,
  },
  {
    id: '2',
    image: require('../../assets/onboarding_measure.png'),
    title: 'قياس الشمولية',
    description:
      'تعرف على مستوى الشمولية في بيئة العمل قبل التقديم مع مؤشر نسبة الشمولية الخاص بكل شركة',
    bg: '#F3F1FA',
    accent: colors.secondary,
  },
  {
    id: '3',
    image: require('../../assets/onboarding_access.png'),
    title: 'دعم إمكانية الوصول',
    description:
      'دعم لغة الإشارة وخدمات الترجمة والمقابلات عن بعد لتسهيل تجربتك في سوق العمل',
    bg: '#EEF6F1',
    accent: colors.primary,
  },
];

const OnboardingScreen = ({ navigation }) => {
  // Current slide state
  const [currentIndex, setCurrentIndex] = useState(0);

  // FlatList reference for manual slide navigation
  const flatListRef = useRef(null);

  const currentSlide = slides[currentIndex];

  // Move to next slide or go to login when onboarding ends
  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setCurrentIndex(nextIndex);
    } else {
      navigation.replace(SCREEN_NAMES.LOGIN);
    }
  };

  // Skip onboarding and go to login
  const handleSkip = () => {
    navigation.replace(SCREEN_NAMES.LOGIN);
  };

  // Render single onboarding slide
  const renderSlide = ({ item }) => (
    <View style={[styles.slide, { width, backgroundColor: item.bg }]}>
      <View style={styles.slideInner}>
        <View style={styles.imageContainer}>
          <Image
            source={item.image}
            style={styles.slideImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textBlock}>
          <Text style={[styles.title, { color: item.accent }]}>
            {item.title}
          </Text>

          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: currentSlide.bg }]}>
      <StatusBar barStyle="dark-content" backgroundColor={currentSlide.bg} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: currentSlide.bg }]}>
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={handleSkip}
          activeOpacity={0.85}
        >
          <Text style={styles.skipText}>تخطي</Text>
        </TouchableOpacity>

        <Image
          source={require('../../assets/logo2.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.headerSpacer} />
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={styles.flatList}
        extraData={currentIndex}
      />

      {/* Footer controls */}
      <View style={[styles.footer, { backgroundColor: currentSlide.bg }]}>
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && {
                  ...styles.activeDot,
                  backgroundColor: currentSlide.accent,
                },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: currentSlide.accent }]}
          onPress={handleNext}
          activeOpacity={0.88}
        >
          <Text style={styles.nextText}>
            {currentIndex === slides.length - 1 ? 'ابدأ الآن' : 'التالي'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 8,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  skipBtn: {
    width: 52,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 8,
  },

  skipText: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '600',
    writingDirection: 'rtl',
  },

  logo: {
    width: 150,
    height: 60,
  },

  headerSpacer: {
    width: 52,
  },

  flatList: {
    flex: 1,
  },

  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },

  slideInner: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 12,
  },

  imageContainer: {
    width: Math.min(width * 0.62, 260),
    height: Math.min(height * 0.32, 260),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },

  slideImage: {
    width: '100%',
    height: '100%',
  },

  textBlock: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 8,
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 32,
    writingDirection: 'rtl',
  },

  description: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 320,
    writingDirection: 'rtl',
  },

  footer: {
    paddingTop: 8,
    paddingBottom: 42,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },

  activeDot: {
    width: 24,
    borderRadius: 6,
  },

  nextBtn: {
    borderRadius: 16,
    minWidth: 210,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  nextText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
    writingDirection: 'rtl',
  },
});

export default OnboardingScreen;
