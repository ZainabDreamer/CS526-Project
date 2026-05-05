import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import colors from '../theme/colors';

// Reminder Card Component
// يعرض تذكير بموعد المقابلة القادمة
const ReminderCard = ({ interview, onPress }) => {
  return (
    <View style={styles.card}>
      {/* Title */}
      <Text style={styles.title}>تذكير !</Text>

      {/* Message */}
      <Text style={styles.message}>
        لديك مقابلة غدًا الساعة {interview.time}.{'\n'}
        يرجى التأكد من جاهزيتك
      </Text>

      {/* Action Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>للوصول الى الموقع</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Card Container
  card: {
    backgroundColor: colors.reminderCard,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 10,
  },

  // Title
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'right',
    marginBottom: 8,
  },

  // Message Text
  message: {
    fontSize: 15,
    color: colors.white,
    textAlign: 'right',
    lineHeight: 22,
    marginBottom: 16,
  },

  // Button
  button: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },

  // Button Text
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default ReminderCard;
