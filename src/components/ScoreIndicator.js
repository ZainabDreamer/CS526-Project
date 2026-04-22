import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import colors from '../theme/colors';

const ScoreIndicator = ({
  percentage = 0,
  size = 70,
  strokeWidth = 6,
  color,
  label = 'نسبة الشمولية',
  showLabel = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = ((100 - percentage) / 100) * circumference;

  // Color based on score
  const getColor = () => {
    if (color) return color;
    if (percentage >= 80) return colors.primary;
    if (percentage >= 60) return colors.scoreOrange;
    return '#E53935';
  };

  const scoreColor = getColor();

  return (
    <View style={[styles.container, { width: size + 20 }]}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} style={styles.svg}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E8E8E8"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={scoreColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        <View style={[styles.labelContainer, { width: size, height: size }]}>
          <Text style={[styles.percentageText, { color: scoreColor, fontSize: size * 0.22 }]}>
            {percentage}%
          </Text>
        </View>
      </View>
      {showLabel && <Text style={styles.scoreLabel}>{label}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
  },
  labelContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontWeight: '700',
    textAlign: 'center',
  },
  scoreLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default ScoreIndicator;
