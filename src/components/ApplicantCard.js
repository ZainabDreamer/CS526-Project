import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useTheme } from '../context/ThemeContext';

/**
 * ApplicantCard
 *
 * Props:
 * - applicant
 * - onAccept
 * - onDetails
 */
const ApplicantCard = ({ applicant, onAccept, onDetails }) => {
  const { colors, darkMode } = useTheme();

  // Card color palette based on current theme
  const palette = {
    cardBg: colors.card,
    text: colors.text,
    subText: colors.subText,
    primary: colors.primary,
    border: darkMode ? '#39344E' : '#ECE7F7',
    softBg: darkMode ? '#2A273A' : '#F5F3FB',
    softText: darkMode ? '#B7B2C9' : '#8A85A0',
    outlineBg: darkMode ? '#262334' : '#FFFFFF',
    outlineBorder: darkMode ? '#4A4560' : '#D9D3EA',
    acceptText: '#FFFFFF',
  };

  return (
    <View style={[styles.card, { backgroundColor: palette.cardBg }]}>
      <View style={styles.row}>
        {/* Applicant information */}
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: applicant.avatarColor || palette.softBg },
              ]}
            >
              <Text style={styles.avatarText}>👤</Text>
            </View>

            <View style={styles.nameInfo}>
              <Text style={[styles.name, { color: palette.text }]}>
                {applicant.name}
              </Text>

              <Text style={[styles.disability, { color: palette.subText }]}>
                {applicant.disabilityIcon} {applicant.disabilityType}
              </Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: palette.softBg,
                  borderColor: palette.border,
                },
              ]}
            >
              <Text style={[styles.statusText, { color: palette.primary }]}>
                {applicant.status || 'قيد المراجعة'}
              </Text>
            </View>

            {applicant.jobTitle ? (
              <Text style={[styles.jobTitle, { color: palette.softText }]}>
                {applicant.jobTitle}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.acceptBtn, { backgroundColor: palette.primary }]}
            onPress={onAccept}
            activeOpacity={0.85}
          >
            <Text style={[styles.acceptText, { color: palette.acceptText }]}>
              قبول الطلب
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.detailsBtn,
              {
                backgroundColor: palette.outlineBg,
                borderColor: palette.outlineBorder,
              },
            ]}
            onPress={onDetails}
            activeOpacity={0.85}
          >
            <Text style={[styles.detailsText, { color: palette.text }]}>
              تفاصيل
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  info: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: 14,
  },

  nameRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    width: '100%',
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },

  avatarText: {
    fontSize: 20,
  },

  nameInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },

  name: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  disability: {
    fontSize: 13,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: 4,
  },

  metaRow: {
    width: '100%',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },

  statusBadge: {
    minHeight: 28,
    borderRadius: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    justifyContent: 'center',
  },

  statusText: {
    fontSize: 12,
    fontWeight: '700',
    writingDirection: 'rtl',
  },

  jobTitle: {
    fontSize: 12,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginLeft: 10,
    flex: 1,
  },

  actions: {
    width: 112,
    justifyContent: 'center',
  },

  acceptBtn: {
    minHeight: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    paddingHorizontal: 10,
  },

  acceptText: {
    fontSize: 13,
    fontWeight: '700',
    writingDirection: 'rtl',
    textAlign: 'center',
  },

  detailsBtn: {
    minHeight: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    paddingHorizontal: 10,
  },

  detailsText: {
    fontSize: 13,
    fontWeight: '700',
    writingDirection: 'rtl',
    textAlign: 'center',
  },
});

export default ApplicantCard;
