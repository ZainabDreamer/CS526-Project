import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const BuildingPlaceholderIcon = ({ color = '#8F8B9E' }) => (
  <View style={styles.buildingWrap}>
    <View style={[styles.buildingRoof, { backgroundColor: color }]} />
    <View style={[styles.buildingBody, { borderColor: color }]} />
    <View style={[styles.buildingDoor, { backgroundColor: color }]} />
    <View style={[styles.buildingWindow1, { backgroundColor: color }]} />
    <View style={[styles.buildingWindow2, { backgroundColor: color }]} />
    <View style={[styles.buildingWindow3, { backgroundColor: color }]} />
    <View style={[styles.buildingWindow4, { backgroundColor: color }]} />
    <View style={[styles.buildingWindow5, { backgroundColor: color }]} />
    <View style={[styles.buildingWindow6, { backgroundColor: color }]} />
  </View>
);

const ReplyIcon = ({ color = '#4B3F72' }) => (
  <View style={styles.replyWrap}>
    <View style={[styles.replyLine, { backgroundColor: color }]} />
    <View
      style={[
        styles.replyHead,
        {
          borderTopColor: color,
          borderLeftColor: color,
        },
      ]}
    />
  </View>
);

const AccessibilityIssueCard = ({
  issue,
  onAddResponse,
  showResponse = false,
}) => {
  const { colors, darkMode } = useTheme();

  const palette = {
    cardBg: colors.card,
    text: colors.text,
    subText: colors.subText,
    primary: colors.primary,
    border: darkMode ? '#39344E' : '#ECE7F7',
    softBg: darkMode ? '#262334' : '#F8F6FC',
    responseBg: darkMode ? '#2A273A' : '#F7F5FC',
    placeholderBg: darkMode ? '#2A273A' : '#F5F3FB',
    placeholderIcon: darkMode ? '#B7B2C9' : '#8F8B9E',
    actionBg: darkMode ? '#2E2A40' : '#F1EEFB',
    actionText: darkMode ? '#D5D0E7' : colors.primary,
  };

  const actionLabel =
    showResponse && issue.response ? 'تعديل الرد' : 'إضافة رد';

  return (
    <View style={[styles.card, { backgroundColor: palette.cardBg }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerTextBlock}>
          <Text style={[styles.title, { color: palette.text }]}>
            {issue.title}
          </Text>
          <Text style={[styles.timeAgo, { color: palette.subText }]}>
            {issue.timeAgo}
          </Text>
        </View>
      </View>

      {/* Image */}
      {issue.image ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: issue.image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      ) : (
        <View
          style={[
            styles.imagePlaceholder,
            {
              backgroundColor: palette.placeholderBg,
              borderColor: palette.border,
            },
          ]}
        >
          <BuildingPlaceholderIcon color={palette.placeholderIcon} />
        </View>
      )}

      {/* Description */}
      <Text style={[styles.sectionLabel, { color: palette.text }]}>
        وصف المشكلة
      </Text>
      <Text style={[styles.description, { color: palette.subText }]}>
        {issue.description}
      </Text>

      {/* Response */}
      {showResponse && issue.response ? (
        <View
          style={[
            styles.responseSection,
            {
              backgroundColor: palette.responseBg,
              borderColor: palette.border,
            },
          ]}
        >
          <Text style={[styles.responseLabel, { color: palette.text }]}>
            الرد
          </Text>
          <Text style={[styles.responseText, { color: palette.subText }]}>
            {issue.response}
          </Text>
        </View>
      ) : null}

      {/* Action */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[
            styles.replyButton,
            {
              backgroundColor: palette.actionBg,
              borderColor: palette.border,
            },
          ]}
          onPress={onAddResponse}
          activeOpacity={0.88}
        >
          <ReplyIcon color={palette.actionText} />
          <Text style={[styles.replyButtonText, { color: palette.actionText }]}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#201547',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  headerRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  headerTextBlock: {
    flex: 1,
    alignItems: 'flex-end',
  },

  title: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  timeAgo: {
    fontSize: 12,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: 4,
  },

  imageContainer: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 14,
    height: 190,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  imagePlaceholder: {
    height: 190,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
  },

  sectionLabel: {
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 26,
  },

  responseSection: {
    marginTop: 16,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },

  responseLabel: {
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 8,
  },

  responseText: {
    fontSize: 13,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 24,
  },

  actionRow: {
    marginTop: 16,
    alignItems: 'flex-end',
  },

  replyButton: {
    minHeight: 42,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
  },

  replyButtonText: {
    fontSize: 13,
    fontWeight: '800',
    writingDirection: 'rtl',
    marginRight: 8,
  },

  replyWrap: {
    width: 16,
    height: 16,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  replyLine: {
    width: 9,
    height: 2,
    borderRadius: 2,
    position: 'absolute',
    right: 2,
  },

  replyHead: {
    width: 6,
    height: 6,
    borderTopWidth: 1.8,
    borderLeftWidth: 1.8,
    position: 'absolute',
    left: 1,
    transform: [{ rotate: '-45deg' }],
  },

  buildingWrap: {
    width: 64,
    height: 64,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buildingRoof: {
    position: 'absolute',
    top: 10,
    width: 38,
    height: 4,
    borderRadius: 2,
  },

  buildingBody: {
    position: 'absolute',
    top: 14,
    width: 44,
    height: 40,
    borderWidth: 2,
    borderRadius: 4,
  },

  buildingDoor: {
    position: 'absolute',
    bottom: 10,
    width: 10,
    height: 12,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },

  buildingWindow1: {
    position: 'absolute',
    top: 22,
    left: 16,
    width: 5,
    height: 5,
    borderRadius: 1,
  },

  buildingWindow2: {
    position: 'absolute',
    top: 22,
    left: 29,
    width: 5,
    height: 5,
    borderRadius: 1,
  },

  buildingWindow3: {
    position: 'absolute',
    top: 22,
    right: 16,
    width: 5,
    height: 5,
    borderRadius: 1,
  },

  buildingWindow4: {
    position: 'absolute',
    top: 32,
    left: 16,
    width: 5,
    height: 5,
    borderRadius: 1,
  },

  buildingWindow5: {
    position: 'absolute',
    top: 32,
    left: 29,
    width: 5,
    height: 5,
    borderRadius: 1,
  },

  buildingWindow6: {
    position: 'absolute',
    top: 32,
    right: 16,
    width: 5,
    height: 5,
    borderRadius: 1,
  },
});

export default AccessibilityIssueCard;