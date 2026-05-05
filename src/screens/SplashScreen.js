import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  ImageBackground,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { SCREEN_NAMES } from '../constants/labels';

const { height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  // Navigate to onboarding after splash duration
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace(SCREEN_NAMES.ONBOARDING);
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <ImageBackground
        source={require('../../assets/splash_person.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Soft white overlay */}
        <View style={styles.softOverlay} />

        {/* Bottom dark gradient */}
        <LinearGradient
          colors={[
            '#241c5600',
            'rgba(36,28,86,0.08)',
            'rgba(36,28,86,0.22)',
            'rgba(36,28,86,0.42)',
            'rgba(36,28,86,0.70)',
            '#241C56',
            '#241C56',
          ]}
          locations={[0, 0.28, 0.45, 0.60, 0.76, 0.90, 1]}
          style={styles.gradient}
        />

        {/* Splash slogan */}
        <View style={styles.textBlock}>
          <Text style={styles.line1}>
            لأن <Text style={styles.greenText}>الشــــــــــــمولية</Text>
          </Text>

          <Text style={styles.line2}>حق يُقــــاس ويُطبَّــــق</Text>
        </View>

        {/* App logo */}
        <View style={styles.logoWrapper}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#241C56',
  },

  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  softOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },

  gradient: {
    ...StyleSheet.absoluteFillObject,
  },

  textBlock: {
    position: 'absolute',
    bottom: height * 0.25,
    width: '100%',
    paddingHorizontal: 30,
    alignItems: 'center',
  },

  line1: {
    width: '100%',
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 44,
  },

  line2: {
    width: '100%',
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 44,
    marginTop: 2,
  },

  greenText: {
    color: '#36B487',
  },

  logoWrapper: {
    position: 'absolute',
    bottom: 34,
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  logo: {
    width: 130,
    height: 48,
  },
});

export default SplashScreen;
