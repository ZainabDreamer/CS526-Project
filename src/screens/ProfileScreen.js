import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import { SCREEN_NAMES } from '../constants/labels';
import { useTheme } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';


const BackArrowIcon = ({ color = '#1F1655' }) => (
  <Text style={[styles.backArrowIcon, { color }]}>{'‹'}</Text>
);

const ForwardArrowIcon = ({ color = '#B0AEBB' }) => (
  <Text style={[styles.forwardArrowIcon, { color }]}>{'‹'}</Text>
);


const ProfileIcon = ({ color = '#1F1655' }) => (
  <View style={styles.profileMiniWrap}>
    <View style={[styles.profileHead, { backgroundColor: color }]} />
    <View style={[styles.profileBody, { backgroundColor: color }]} />
  </View>
);

const GlobeIcon = ({ color = '#1F1655' }) => (
  <View style={styles.globeWrap}>
    <View style={[styles.globeCircle, { borderColor: color }]} />
    <View style={[styles.globeLineV, { backgroundColor: color }]} />
    <View style={[styles.globeLineH, { backgroundColor: color }]} />
  </View>
);

const InfoIcon = ({ color = '#1F1655' }) => (
  <View style={styles.infoWrap}>
    <View style={[styles.infoDot, { backgroundColor: color }]} />
    <View style={[styles.infoLine, { backgroundColor: color }]} />
  </View>
);

const LockIcon = ({ color = '#1F1655' }) => (
  <View style={styles.lockWrap}>
    <View style={[styles.lockTop, { borderColor: color }]} />
    <View style={[styles.lockBody, { backgroundColor: color }]} />
  </View>
);

const StarIcon = ({ color = '#1F1655' }) => (
  <View style={[styles.starWrap, { backgroundColor: color }]} />
);

const MoonIcon = ({ color = '#1F1655', cutColor = '#F0EEF7' }) => (
  <View style={styles.moonWrap}>
    <View style={[styles.moonMain, { backgroundColor: color }]} />
    <View style={[styles.moonCut, { backgroundColor: cutColor }]} />
  </View>
);

const LogoutIcon = ({ color = '#D94B4B' }) => (
  <View style={styles.logoutWrap}>
    <View style={[styles.logoutDoor, { borderColor: color }]} />
    <View style={[styles.logoutArrowLine, { backgroundColor: color }]} />
    <View
      style={[
        styles.logoutArrowHead,
        { borderTopColor: color, borderRightColor: color },
      ]}
    />
  </View>
);
const BookmarkIcon = ({ color = '#1F1655' }) => (
  <View style={styles.bookmarkWrap}>
    <View style={[styles.bookmarkBody, { borderColor: color }]} />
    <View style={[styles.bookmarkCut, { backgroundColor: color }]} />
  </View>
);

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const theme = useTheme();
  const darkMode = theme?.darkMode ?? false;
  const toggleTheme = theme?.toggleTheme ?? (() => {});
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
    iconBg: darkMode ? '#2E2A40' : '#F0EEF7',
    text: colors.text,
    subText: colors.subText,
    primary: colors.primary,
    border: darkMode ? '#312D45' : '#F1EFF8',
    headerBtnBg: colors.card,
    arrow: darkMode ? '#A9A5BC' : '#B0AEBB',
    danger: '#D94B4B',
    switchTrackOn: darkMode ? '#6F5CDE' : '#3B2B93',
    switchTrackOff: darkMode ? '#45405E' : '#D8D4E6',
    switchThumb: '#FFFFFF',
    moonCut: darkMode ? '#2E2A40' : '#F0EEF7',
    logoutBg: darkMode ? '#33232A' : '#FBEDEE',
  };

const isOrganization = user?.role === 'organization';
const isJobSeeker = user?.role === 'jobSeeker';

const profileItems = [
  { key: 'data', label: 'بياناتي', icon: ProfileIcon },

  ...(isJobSeeker
    ? [
        { key: 'savedJobs', label: 'الوظائف المحفوظة', icon: BookmarkIcon },
        { key: 'interviews', label: 'المقابلات', icon: BookmarkIcon },
      ]
    : []),

  ...(isOrganization
    ? [{ key: 'editCompany', label: 'تعديل بيانات الشركة', icon: ProfileIcon }]
    : []),

  { key: 'language', label: 'اللغة', icon: GlobeIcon },
  { key: 'about', label: 'من نحن', icon: InfoIcon },
  { key: 'terms', label: 'الشروط', icon: InfoIcon },
  { key: 'policies', label: 'السياسات', icon: LockIcon },
  { key: 'values', label: 'قيم التطبيق', icon: StarIcon },
];

  const handleItem = (key) => {

    if (key === 'savedJobs') {
     navigation.navigate('SavedJobs');
     return;
    }
    if (key === 'interviews') {
     navigation.navigate(SCREEN_NAMES.JOB_SEEKER_INTERVIEWS);
     return;
    }
    if (key === 'editCompany') {
      navigation.navigate(SCREEN_NAMES.EDIT_COMPANY_PROFILE);
     return;
    }
    if (key === 'data') {
      navigation.navigate(SCREEN_NAMES.MY_DATA);
      return;
    }

    if (key === 'language') {
      navigation.navigate(SCREEN_NAMES.LANGUAGE_SELECT);
      return;
    }

    if (key === 'about') {
      navigation.navigate(SCREEN_NAMES.ABOUT);
      return;
    }

    if (key === 'terms') {
      navigation.navigate(SCREEN_NAMES.TERMS);
      return;
    }

    if (key === 'policies') {
      navigation.navigate(SCREEN_NAMES.POLICIES);
      return;
    }

    if (key === 'values') {
      navigation.navigate(SCREEN_NAMES.APP_VALUES);
    }
  };

  const handleLogout = () => {
  Alert.alert(
    'تسجيل الخروج',
    'هل أنت متأكد من رغبتك في تسجيل الخروج؟',
    [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'تسجيل الخروج',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.replace(SCREEN_NAMES.LOGIN);
        },
      },
    ]
  );
};

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
            الملف الشخصي
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: palette.cardBg }]}>
          {profileItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.row,
                  index !== profileItems.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: palette.border,
                  },
                ]}
                onPress={() => handleItem(item.key)}
                activeOpacity={0.82}
              >
                
                <View style={styles.rowArrowSide}>
                  <ForwardArrowIcon color={palette.arrow} />
                </View>

                
                <View style={styles.rowMainSide}>
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: palette.iconBg },
                    ]}
                  >
                    <Icon color={palette.primary} />
                  </View>

                  <Text style={[styles.rowLabel, { color: palette.text }]}>
                    {item.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}

          <View
            style={[
              styles.row,
              { borderTopWidth: 1, borderTopColor: palette.border },
            ]}
          >
            
            <View style={styles.rowArrowSide}>
              <Switch
                value={darkMode}
                onValueChange={toggleTheme}
                trackColor={{
                  false: palette.switchTrackOff,
                  true: palette.switchTrackOn,
                }}
                thumbColor={palette.switchThumb}
              />
            </View>

            
            <View style={styles.rowMainSide}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: palette.iconBg },
                ]}
              >
                <MoonIcon color={palette.primary} cutColor={palette.moonCut} />
              </View>

              <Text style={[styles.rowLabel, { color: palette.text }]}>
                الوضع الداكن
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: palette.cardBg, marginTop: 14 },
          ]}
        >
          <TouchableOpacity
            style={styles.logoutRow}
            onPress={handleLogout}
            activeOpacity={0.82}
          >
            
            <View style={styles.logoutTextSide}>
              <Text style={[styles.rowLabel, { color: palette.danger }]}>
                تسجيل الخروج
              </Text>
            </View>

            
            <View style={styles.logoutIconSide}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: palette.logoutBg },
                ]}
              >
                <LogoutIcon color={palette.danger} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: 28 }} />
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

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
    marginBottom: 12,
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
    writingDirection: 'rtl',
    textAlign: 'right',
    paddingHorizontal: 10,
  },

  card: {
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 6,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },

  rowArrowSide: {
    minWidth: 42,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  rowMainSide: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  logoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },

  logoutTextSide: {
    flex: 1,
    alignItems: 'flex-start',
  },

  logoutIconSide: {
    width: 60,
    alignItems: 'flex-end',
  },

  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  rowLabel: {
    fontSize: 15,
    fontWeight: '600',
    writingDirection: 'rtl',
    textAlign: 'right',
  },

  backArrowIcon: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 26,
    includeFontPadding: false,
  },

  forwardArrowIcon: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 24,
    includeFontPadding: false,
  },

  profileMiniWrap: {
    alignItems: 'center',
  },

  profileHead: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 2,
  },

  profileBody: {
    width: 10,
    height: 6,
    borderRadius: 3,
  },

  globeWrap: {
    width: 16,
    height: 16,
  },

  globeCircle: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
  },

  globeLineV: {
    position: 'absolute',
    width: 1,
    height: 14,
    left: 7,
  },

  globeLineH: {
    position: 'absolute',
    width: 14,
    height: 1,
    top: 7,
  },

  infoWrap: {
    alignItems: 'center',
  },

  infoDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    marginBottom: 2,
  },

  infoLine: {
    width: 2,
    height: 8,
  },

  lockWrap: {
    alignItems: 'center',
  },

  lockTop: {
    width: 8,
    height: 5,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },

  lockBody: {
    width: 10,
    height: 8,
    borderRadius: 2,
  },

  starWrap: {
    width: 10,
    height: 10,
    transform: [{ rotate: '45deg' }],
  },

  moonWrap: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  moonMain: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  moonCut: {
    position: 'absolute',
    top: 1,
    right: 1,
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },

  logoutWrap: {
    width: 16,
    height: 16,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoutDoor: {
    position: 'absolute',
    left: 1,
    width: 7,
    height: 12,
    borderWidth: 1.5,
    borderRadius: 2,
  },

  logoutArrowLine: {
    position: 'absolute',
    right: 2,
    width: 7,
    height: 1.8,
    borderRadius: 2,
  },

  logoutArrowHead: {
    position: 'absolute',
    right: 1,
    width: 5,
    height: 5,
    borderTopWidth: 1.8,
    borderRightWidth: 1.8,
    transform: [{ rotate: '45deg' }],
  },

  bookmarkWrap: {
  width: 16,
  height: 18,
  position: 'relative',
},

bookmarkBody: {
  width: 14,
  height: 18,
  borderWidth: 1.8,
  borderTopLeftRadius: 3,
  borderTopRightRadius: 3,
  borderBottomWidth: 0,
},

bookmarkCut: {
  position: 'absolute',
  bottom: 0,
  left: 3,
  width: 8,
  height: 8,
  transform: [{ rotate: '45deg' }],
},
});
