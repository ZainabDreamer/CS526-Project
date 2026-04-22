import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../theme/colors';

const ReminderCard = ({ interview, onPress }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>تذكير !</Text>
      <Text style={styles.message}>
        لديك مقابلة غدًا الساعة {interview.time}.{'\n'}
        يرجى التأكد من جاهزيتك
      </Text>
      <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.85}>
        <Text style={styles.buttonText}>للوصول الى الموقع</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.reminderCard,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'right',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: colors.white,
    textAlign: 'right',
    lineHeight: 22,
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default ReminderCard;
