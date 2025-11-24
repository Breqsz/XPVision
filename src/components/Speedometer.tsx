import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { XPColors, XPTypography, XPBorderRadius, XPShadows, XPSpacing } from '../theme/colors';

interface SpeedometerProps {
  progress: number; // 0-1
  daysRemaining: number;
  onBoostPress?: () => void;
}

const Speedometer: React.FC<SpeedometerProps> = ({ progress, daysRemaining, onBoostPress }) => {
  const percentage = Math.min(Math.max(progress * 100, 0), 100);
  const circumference = 2 * Math.PI * 60; // raio 60
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <View style={styles.container}>
      <View style={styles.speedometerWrapper}>
        {/* Progress Ring usando View com border */}
        <View style={styles.ringContainer}>
          <View style={[styles.ringBackground, { borderColor: XPColors.grayMedium }]} />
          <View 
            style={[
              styles.ringProgress, 
              { 
                borderColor: XPColors.progressGreen,
                transform: [{ rotate: `${(progress * 360) - 90}deg` }],
              }
            ]} 
          />
        </View>
        
        {/* Centro com informações */}
        <View style={styles.centerContent}>
          <Text style={styles.percentageText}>{percentage.toFixed(0)}%</Text>
          <Text style={styles.labelText}>Concluído</Text>
          <Text style={styles.daysText}>{daysRemaining} dias restantes</Text>
        </View>
      </View>
      
      {onBoostPress && (
        <TouchableOpacity style={styles.boostButton} onPress={onBoostPress}>
          <Text style={styles.boostButtonText}>💰 Contribuir para seu objetivo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: XPSpacing.lg,
  },
  speedometerWrapper: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  ringContainer: {
    position: 'absolute',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringBackground: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 12,
  },
  ringProgress: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 12,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: 48,
    fontWeight: XPTypography.bold,
    color: XPColors.yellow,
    marginBottom: XPSpacing.xs,
  },
  labelText: {
    fontSize: XPTypography.caption,
    color: XPColors.textSecondary,
    marginBottom: XPSpacing.sm,
  },
  daysText: {
    fontSize: XPTypography.body,
    color: XPColors.progressGreen,
    fontWeight: XPTypography.semiBold,
  },
  boostButton: {
    marginTop: XPSpacing.lg,
    backgroundColor: XPColors.yellow,
    paddingHorizontal: XPSpacing.xl,
    paddingVertical: XPSpacing.md,
    borderRadius: XPBorderRadius.full,
    ...XPShadows.button,
  },
  boostButtonText: {
    fontSize: XPTypography.body,
    fontWeight: XPTypography.bold,
    color: XPColors.black,
  },
});

export default Speedometer;

