import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { SCREEN_NAMES } from '../constants/labels';

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

const BackArrowIcon = ({ color = '#4B3F72' }) => (
  <Text style={[styles.backArrowIcon, { color }]}>{'‹'}</Text>
);

const AppHeader = ({
  navigation,
  showBack = false,
  onBackPress,
  onLeftPress,
  onRightPress,
  leftType = 'bell',
  rightType = 'profile',
  title,
  subtitle,
  horizontalPadding = 20,
}) => {
  const { colors, darkMode } = useTheme();

  const palette = {
    card: colors.card,
    text: colors.text,
    subText: colors.subText,
    icon: darkMode ? '#F5F3FB' : '#1F1655',
  };

  const renderButton = (type, onPress) => {
    if (type === 'empty') {
      return <View style={styles.headerSpacer} />;
    }

    if (type === 'back') {
      return (
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: palette.card }]}
          onPress={onPress || (() => navigation.goBack())}
          activeOpacity={0.85}
        >
          <BackArrowIcon color={palette.icon} />
        </TouchableOpacity>
      );
    }

    if (type === 'bell') {
      return (
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: palette.card }]}
          onPress={onPress}
          activeOpacity={0.85}
        >
          <BellIcon color={palette.icon} />
        </TouchableOpacity>
      );
    }

    if (type === 'profile') {
      return (
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: palette.card }]}
          onPress={onPress || (() => navigation.navigate(SCREEN_NAMES.PROFILE))}
          activeOpacity={0.85}
        >
          <ProfileIcon color={palette.icon} />
        </TouchableOpacity>
      );
    }

    return <View style={styles.headerSpacer} />;
  };

  return (
    <>
      <View style={[styles.headerRow, { paddingHorizontal: horizontalPadding }]}>
        {renderButton(leftType, onLeftPress)}

        <Image
          source={require('../../assets/logo2.png')}
          style={styles.topLogo}
          resizeMode="contain"
        />

        {renderButton(
          showBack ? 'back' : rightType,
          showBack ? onBackPress : onRightPress
        )}
      </View>

      {(title || subtitle) && (
        <View style={[styles.textBlock, { paddingHorizontal: horizontalPadding }]}>
          {!!subtitle && (
            <Text style={[styles.subtitle, { color: palette.subText }]}>
              {subtitle}
            </Text>
          )}
          {!!title && (
            <Text style={[styles.title, { color: palette.text }]}>
              {title}
            </Text>
          )}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 52,
    marginBottom: 16,
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

  textBlock: {
    marginBottom: 16,
    alignItems: 'flex-end',
  },

  title: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  subtitle: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 4,
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
    width: 12,
    height: 6,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },

  backArrowIcon: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 26,
    includeFontPadding: false,
  },
});

export default AppHeader;