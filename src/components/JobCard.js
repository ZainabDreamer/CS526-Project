import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ScoreIndicator from './ScoreIndicator';
import { useTheme } from '../context/ThemeContext';

/**
 * JobCard
 * Props:
 * - job
 * - onPress
 * - style
 */
const JobCard = ({ job, onPress, style }) => {
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
    muted: darkMode ? '#B7B2C9' : '#B0AEBB',
    tagBg: darkMode ? '#2A273A' : '#F5F3FB',
    tagText: darkMode ? '#DDD8EE' : '#4B3F72',
    border: darkMode ? '#39344E' : '#ECE7F7',
  };

  const tags = [
    job.city || job.location,
    job.workEnv || 'حضوري',
    job.supportType || 'شمولية',
  ].filter(Boolean);

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
          <Text style={[styles.title, { color: palette.text }]}>
            {job.title}
          </Text>

          <View style={styles.locationRow}>
            <Text style={[styles.location, { color: palette.subText }]}>
              {job.city || job.location}
            </Text>
            <Text style={styles.locationIcon}>📍</Text>
          </View>

          <View style={styles.tagsRow}>
            {tags.map((tag) => (
              <View
                key={tag}
                style={[
                  styles.tag,
                  {
                    backgroundColor: palette.tagBg,
                    borderColor: palette.border,
                  },
                ]}
              >
                <Text style={[styles.tagText, { color: palette.tagText }]}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>

          <Text style={[styles.details, { color: palette.muted }]}>
            للمزيد من التفاصيل
          </Text>
        </View>

        <View style={styles.scoreWrap}>
          <ScoreIndicator
            percentage={job.score}
            size={65}
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

  title: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 6,
  },

  locationRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 10,
  },

  locationIcon: {
    fontSize: 12,
    marginLeft: 6,
  },

  location: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  tagsRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    alignSelf: 'flex-end',
    marginBottom: 10,
  },

  tag: {
    minHeight: 28,
    borderRadius: 12,
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderWidth: 1,
    marginLeft: 8,
    marginBottom: 8,
  },

  tagText: {
    fontSize: 12,
    fontWeight: '700',
    writingDirection: 'rtl',
  },

  details: {
    fontSize: 12,
    textAlign: 'right',
    writingDirection: 'rtl',
    alignSelf: 'flex-end',
  },

  scoreWrap: {
    width: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default JobCard;