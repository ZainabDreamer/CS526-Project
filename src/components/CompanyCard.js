import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ScoreIndicator from './ScoreIndicator';
import { useTheme } from '../context/ThemeContext';

/**
 * CompanyCard
 * Props:
 * - company
 * - onPress
 * - style
 */
const CompanyCard = ({ company, onPress, style }) => {
  const theme = useTheme();
  const darkMode = theme?.darkMode ?? false;
  const colors = theme?.colors ?? {
    background: '#F3F1FA',
    card: '#FFFFFF',
    text: '#111111',
    subText: '#6E6A8A',
    primary: '#4B3F72',
  };

  const palette = {
    cardBg: colors.card,
    text: colors.text,
    subText: colors.subText,
    primary: colors.primary,
    softText: darkMode ? '#A8A3BC' : '#8A85A0',
    muted: darkMode ? '#B7B2C9' : '#B0AEBB',
    tagBg: darkMode ? '#2A273A' : '#F5F3FB',
    tagText: darkMode ? '#DDD8EE' : '#4B3F72',
    border: darkMode ? '#39344E' : '#ECE7F7',
  };

  const getBadgeEmoji = (badge) => {
    switch (badge) {
      case 'الذهبية':
        return '🥇';
      case 'الفضية':
        return '🥈';
      case 'البرونزية':
        return '🥉';
      case 'التميز':
        return '🏅';
      default:
        return '🏅';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: palette.cardBg },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.row}>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.badge}>{getBadgeEmoji(company.badge)}</Text>
            <Text style={[styles.name, { color: palette.text }]}>
              {company.name}
            </Text>
          </View>

          <Text style={[styles.badgeText, { color: palette.softText }]}>
            حاصلة على شهادة {company.badge}
          </Text>

          <View style={styles.locationRow}>
            <Text style={[styles.city, { color: palette.subText }]}>
              {company.city}
            </Text>
            <View style={styles.locationWrap}>
            <View style={styles.locationPin} />
            <View style={styles.locationDot} />
           </View>
          </View>

          <View style={styles.bottomRow}>
            <Text style={[styles.details, { color: palette.muted }]}>
              للمزيد من التفاصيل
            </Text>

            <View
              style={[
                styles.badgeTag,
                {
                  backgroundColor: palette.tagBg,
                  borderColor: palette.border,
                },
              ]}
            >
              <Text style={[styles.badgeTagText, { color: palette.tagText }]}>
                {company.badge}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.scoreWrap}>
          <ScoreIndicator
            percentage={company.score}
            size={70}
            showLabel={true}
            label="نسبة الشمولية"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 18,
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
    marginBottom: 4,
  },

  badge: {
    fontSize: 17,
    marginLeft: 6,
  },

  name: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  badgeText: {
    fontSize: 13,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 6,
  },

  locationRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 10,
  },

   locationWrap: {
  width: 12,
  height: 16,
  alignItems: 'center',
  justifyContent: 'flex-start',
  marginLeft: 6,
  position: 'relative',
},

locationPin: {
  width: 10,
  height: 10,
  borderRadius: 5,
  backgroundColor: '#D94A4A',
},

locationDot: {
  width: 2,
  height: 6,
  backgroundColor: '#7B6E8D',
  marginTop: 1,
  borderRadius: 2,
},

  city: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  bottomRow: {
    width: '100%',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },

  details: {
    fontSize: 12,
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  badgeTag: {
    minHeight: 28,
    borderRadius: 12,
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderWidth: 1,
  },

  badgeTagText: {
    fontSize: 12,
    fontWeight: '700',
    writingDirection: 'rtl',
  },

  scoreWrap: {
    width: 92,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CompanyCard;