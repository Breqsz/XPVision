import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { XPColors, XPBorderRadius, XPShadows } from '../theme/colors';

interface XPCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'highlight';
}

const XPCard: React.FC<XPCardProps> = ({ children, style, variant = 'default' }) => {
  return (
    <View 
      style={[
        styles.card, 
        variant === 'highlight' && styles.cardHighlight,
        style
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: XPColors.cardBackground,
    borderRadius: XPBorderRadius.xl,
    padding: 20,
    ...XPShadows.card,
  },
  cardHighlight: {
    backgroundColor: XPColors.grayMedium,
    borderWidth: 1,
    borderColor: XPColors.yellow,
  },
});

export default XPCard;

