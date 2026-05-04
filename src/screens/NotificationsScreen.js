import React, { useCallback, useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import {
  getStoredNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../services/notificationService';

const BackArrowIcon = ({ color = '#1F1655' }) => (
  <Text style={{ color, fontSize: 28, fontWeight: '800' }}>{'‹'}</Text>
);

const NotificationsScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { colors, darkMode } = useTheme();
  const [notifications, setNotifications] = useState([]);

  const userId = user?.uid || user?.id;

  const palette = {
    bg: colors.background,
    card: colors.card,
    text: colors.text,
    subText: colors.subText,
    primary: colors.primary || '#4B3F72',
    border: darkMode ? '#39344E' : '#ECE7F7',
    unreadBg: darkMode ? '#2A273A' : '#F4F1FF',
  };

  const loadNotifications = async () => {
    const data = await getStoredNotifications(userId);
    setNotifications(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [userId])
  );

  const handleOpenNotification = async (item) => {
    await markNotificationAsRead(userId, item.id);
    await loadNotifications();

    const screen = item.data?.screen;

    if (screen) {
      navigation.navigate(screen);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead(userId);
    await loadNotifications();
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={palette.bg}
      />

      <View style={styles.headerRow}>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: palette.card }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <BackArrowIcon color={palette.primary} />
        </TouchableOpacity>

        <Image
          source={require('../../assets/logo2.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
       <View style={styles.titleRow}>
  <TouchableOpacity onPress={handleMarkAllRead} activeOpacity={0.85}>
    <Text style={[styles.title, { color: palette.primary }]}>
        الإشعارات
    </Text>
  </TouchableOpacity>
</View>

        {notifications.length > 0 ? (
          notifications.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.notificationCard,
                {
                  backgroundColor: item.read ? palette.card : palette.unreadBg,
                  borderColor: palette.border,
                },
              ]}
              onPress={() => handleOpenNotification(item)}
              activeOpacity={0.85}
            >
              <View style={styles.notificationTop}>
                {!item.read && <View style={styles.unreadDot} />}

                <Text style={[styles.notificationTitle, { color: palette.text }]}>
                  {item.title}
                </Text>
              </View>

              <Text style={[styles.notificationBody, { color: palette.subText }]}>
                {item.body}
              </Text>

              <Text style={[styles.notificationDate, { color: palette.subText }]}>
                {new Date(item.createdAt).toLocaleString('ar-SA')}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor: palette.card,
                borderColor: palette.border,
              },
            ]}
          >
            <Text style={[styles.emptyTitle, { color: palette.text }]}>
              لا توجد إشعارات حالياً
            </Text>
            <Text style={[styles.emptyText, { color: palette.subText }]}>
              ستظهر هنا إشعارات المقابلات، التقييمات، والردود الجديدة.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default NotificationsScreen;

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

  logo: {
    width: 120,
    height: 60,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  titleRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'right',
    writingDirection: 'rtl',
    paddingHorizontal: 10,
  },

  markRead: {
    fontSize: 12,
    fontWeight: '800',
    writingDirection: 'rtl',
  },

  notificationCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },

  notificationTop: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 8,
  },

  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#36B487',
    marginRight: 8,
  },

  notificationTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  notificationBody: {
    fontSize: 13,
    lineHeight: 22,
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  notificationDate: {
    fontSize: 11,
    marginTop: 10,
    textAlign: 'left',
  },

  emptyCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 8,
    writingDirection: 'rtl',
  },

  emptyText: {
    fontSize: 13,
    lineHeight: 22,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
});